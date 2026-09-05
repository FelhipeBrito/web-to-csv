(function initExtractor(root, factory) {
  const api = factory();

  if (typeof module === "object" && module.exports) {
    module.exports = api;
  } else {
    root.WebToCSVExtractor = api;
  }
})(typeof globalThis !== "undefined" ? globalThis : this, function createExtractor() {
  "use strict";

  const MAX_COLSPAN = 1000;

  function normalizeText(value) {
    return String(value ?? "")
      .replace(/\u00a0/g, " ")
      .replace(/\r\n?/g, "\n")
      .split("\n")
      .map((line) => line.replace(/[ \t]+/g, " ").trim())
      .join("\n")
      .trim();
  }

  function cellText(cell) {
    const value = typeof cell.innerText === "string"
      ? cell.innerText
      : cell.textContent;

    return normalizeText(value);
  }

  function boundedSpan(value, maximum) {
    const parsed = Number.parseInt(value, 10);
    if (!Number.isFinite(parsed) || parsed < 1) return 1;
    return Math.min(parsed, maximum);
  }

  function tableToMatrix(table) {
    const domRows = Array.from(table?.rows ?? []);
    const grid = [];

    domRows.forEach((domRow, rowIndex) => {
      if (!grid[rowIndex]) grid[rowIndex] = [];
      let columnIndex = 0;

      Array.from(domRow?.cells ?? []).forEach((cell) => {
        while (grid[rowIndex][columnIndex] !== undefined) {
          columnIndex += 1;
        }

        const remainingRows = Math.max(1, domRows.length - rowIndex);
        const rowSpan = boundedSpan(cell.rowSpan, remainingRows);
        const colSpan = boundedSpan(cell.colSpan, MAX_COLSPAN);
        const value = cellText(cell);

        for (let rowOffset = 0; rowOffset < rowSpan; rowOffset += 1) {
          const targetRow = rowIndex + rowOffset;
          if (!grid[targetRow]) grid[targetRow] = [];

          for (let colOffset = 0; colOffset < colSpan; colOffset += 1) {
            const targetColumn = columnIndex + colOffset;
            grid[targetRow][targetColumn] = rowOffset === 0 && colOffset === 0
              ? value
              : "";
          }
        }

        columnIndex += colSpan;
      });
    });

    const columnCount = grid.reduce(
      (largest, row) => Math.max(largest, row.length),
      0,
    );

    return grid.map((row) => Array.from(
      { length: columnCount },
      (_, index) => row[index] ?? "",
    ));
  }

  function tableLabel(table, index) {
    const caption = normalizeText(table?.caption?.innerText ?? table?.caption?.textContent);
    const ariaLabel = normalizeText(table?.getAttribute?.("aria-label"));
    return caption || ariaLabel || `Tabela ${index + 1}`;
  }

  function extractTables(doc) {
    const source = doc ?? document;
    const tables = Array.from(source.querySelectorAll("table"));

    return {
      pageTitle: normalizeText(source.title),
      tables: tables.map((table, index) => {
        const data = tableToMatrix(table);
        return {
          index,
          label: tableLabel(table, index),
          rowCount: data.length,
          columnCount: data.reduce(
            (largest, row) => Math.max(largest, row.length),
            0,
          ),
          data,
        };
      }),
    };
  }

  return Object.freeze({
    normalizeText,
    tableToMatrix,
    extractTables,
  });
});
