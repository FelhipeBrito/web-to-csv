(function initPopup() {
  "use strict";

  const PREVIEW_ROW_LIMIT = 5;
  const state = {
    pageTitle: "pagina",
    tables: [],
  };

  const elements = {
    status: document.querySelector("#status"),
    results: document.querySelector("#results"),
    summary: document.querySelector("#summary"),
    tableList: document.querySelector("#table-list"),
    refreshButton: document.querySelector("#refresh-button"),
    toast: document.querySelector("#toast"),
  };

  let toastTimer;

  function plural(value, singular, pluralForm) {
    return value === 1 ? singular : pluralForm;
  }

  function setLoading() {
    elements.results.hidden = true;
    elements.status.hidden = false;
    elements.status.replaceChildren();

    const spinner = document.createElement("div");
    spinner.className = "spinner";
    spinner.setAttribute("aria-hidden", "true");

    const message = document.createElement("p");
    message.textContent = "Analisando a página…";
    elements.status.append(spinner, message);
  }

  function showStatus(message, canRetry = false) {
    elements.results.hidden = true;
    elements.status.hidden = false;
    elements.status.replaceChildren();

    const text = document.createElement("p");
    text.textContent = message;
    elements.status.append(text);

    if (canRetry) {
      const button = document.createElement("button");
      button.className = "retry-button";
      button.type = "button";
      button.textContent = "Tentar novamente";
      button.addEventListener("click", scanPage);
      elements.status.append(button);
    }
  }

  function showToast(message) {
    window.clearTimeout(toastTimer);
    elements.toast.textContent = message;
    elements.toast.hidden = false;
    toastTimer = window.setTimeout(() => {
      elements.toast.hidden = true;
    }, 2200);
  }

  function isValidExtraction(result) {
    return result
      && typeof result === "object"
      && Array.isArray(result.tables)
      && result.tables.every((table) => (
        table
        && typeof table === "object"
        && Array.isArray(table.data)
        && table.data.every(Array.isArray)
      ));
  }

  function safeFilePart(value) {
    const normalized = String(value || "tabela")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 60);

    return normalized || "tabela";
  }

  async function copyText(text) {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return;
    }

    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.setAttribute("readonly", "");
    textarea.style.position = "fixed";
    textarea.style.opacity = "0";
    document.body.append(textarea);
    textarea.select();
    const copied = document.execCommand("copy");
    textarea.remove();

    if (!copied) throw new Error("Falha ao copiar.");
  }

  function downloadCsv(table) {
    const csv = CsvUtils.UTF8_BOM + CsvUtils.matrixToCsv(table.data);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    const tableNumber = Number(table.index) + 1;

    link.href = url;
    link.download = `${safeFilePart(state.pageTitle)}-tabela-${tableNumber}.csv`;
    document.body.append(link);
    link.click();
    link.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  function buildPreview(table) {
    const container = document.createElement("div");
    container.className = "preview";
    container.hidden = true;

    const previewTable = document.createElement("table");
    const body = document.createElement("tbody");

    table.data.slice(0, PREVIEW_ROW_LIMIT).forEach((row) => {
      const tr = document.createElement("tr");
      row.forEach((value) => {
        const td = document.createElement("td");
        td.textContent = String(value ?? "");
        td.title = String(value ?? "");
        tr.append(td);
      });
      body.append(tr);
    });

    previewTable.append(body);
    container.append(previewTable);

    if (table.rowCount > PREVIEW_ROW_LIMIT) {
      const note = document.createElement("p");
      note.className = "preview-note";
      note.textContent = `Prévia das primeiras ${PREVIEW_ROW_LIMIT} linhas.`;
      container.append(note);
    }

    return container;
  }

  function buildTableCard(table) {
    const card = document.createElement("article");
    card.className = "table-card";

    const header = document.createElement("div");
    header.className = "table-card-header";

    const title = document.createElement("h2");
    title.textContent = String(table.label || `Tabela ${Number(table.index) + 1}`);
    title.title = title.textContent;

    const meta = document.createElement("p");
    meta.className = "table-meta";
    meta.textContent = `${table.rowCount} ${plural(table.rowCount, "linha", "linhas")} • ${table.columnCount} ${plural(table.columnCount, "coluna", "colunas")}`;
    header.append(title, meta);

    const actions = document.createElement("div");
    actions.className = "card-actions";

    const previewButton = document.createElement("button");
    previewButton.className = "action-button";
    previewButton.type = "button";
    previewButton.textContent = "Visualizar";

    const copyButton = document.createElement("button");
    copyButton.className = "action-button";
    copyButton.type = "button";
    copyButton.textContent = "Copiar";

    const exportButton = document.createElement("button");
    exportButton.className = "action-button primary";
    exportButton.type = "button";
    exportButton.textContent = "Exportar";

    const hasData = table.rowCount > 0 && table.columnCount > 0;
    previewButton.disabled = !hasData;
    copyButton.disabled = !hasData;
    exportButton.disabled = !hasData;

    const preview = buildPreview(table);
    previewButton.addEventListener("click", () => {
      preview.hidden = !preview.hidden;
      previewButton.textContent = preview.hidden ? "Visualizar" : "Ocultar";
    });

    copyButton.addEventListener("click", async () => {
      try {
        await copyText(CsvUtils.matrixToTsv(table.data));
        showToast("Tabela copiada. Cole diretamente na planilha.");
      } catch (error) {
        console.error("Falha ao copiar a tabela:", error);
        showToast("Não foi possível copiar a tabela.");
      }
    });

    exportButton.addEventListener("click", () => {
      downloadCsv(table);
      showToast("Arquivo CSV gerado.");
    });

    actions.append(previewButton, copyButton, exportButton);
    card.append(header, actions, preview);
    return card;
  }

  function renderResults() {
    elements.status.hidden = true;
    elements.results.hidden = false;
    elements.tableList.replaceChildren();

    const count = state.tables.length;
    elements.summary.textContent = `${count} ${plural(count, "tabela encontrada", "tabelas encontradas")}`;
    state.tables.forEach((table) => elements.tableList.append(buildTableCard(table)));
  }

  function friendlyError(error) {
    const message = String(error?.message || error || "");

    if (/Cannot access|The extensions gallery cannot be scripted|Missing host permission|chrome:\/\//i.test(message)) {
      return "O Chrome não permite analisar esta página interna. Abra um site comum e tente novamente.";
    }

    return "Não foi possível analisar esta página. Recarregue a aba e tente novamente.";
  }

  async function scanPage() {
    setLoading();

    try {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      if (!tab?.id) throw new Error("A aba ativa não foi encontrada.");

      await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        files: ["scripts/extractor.js"],
      });

      const injectionResults = await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: () => globalThis.WebToCSVExtractor.extractTables(),
      });

      const extraction = injectionResults?.[0]?.result;
      if (!isValidExtraction(extraction)) {
        throw new Error("A página retornou dados em formato inesperado.");
      }

      state.pageTitle = String(extraction.pageTitle || "pagina");
      state.tables = extraction.tables;

      if (state.tables.length === 0) {
        showStatus("Nenhuma tabela foi encontrada nesta página.", true);
        return;
      }

      renderResults();
    } catch (error) {
      console.error("Falha ao analisar a página:", error);
      showStatus(friendlyError(error), true);
    }
  }

  elements.refreshButton.addEventListener("click", scanPage);
  scanPage();
})();
