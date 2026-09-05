const test = require("node:test");
const assert = require("node:assert/strict");
const {
  normalizeText,
  tableToMatrix,
  extractTables,
} = require("../scripts/extractor.js");

function cell(text, rowSpan = 1, colSpan = 1) {
  return { innerText: text, rowSpan, colSpan };
}

function table(rows, options = {}) {
  return {
    rows: rows.map((cells) => ({ cells })),
    caption: options.caption ? { innerText: options.caption } : null,
    getAttribute(name) {
      return name === "aria-label" ? options.ariaLabel ?? null : null;
    },
  };
}

test("normaliza espaços sem remover quebras internas", () => {
  assert.equal(normalizeText("  São\u00a0Paulo \n  R$   10  "), "São Paulo\nR$ 10");
});

test("extrai tabela retangular e preserva células vazias", () => {
  const result = tableToMatrix(table([
    [cell("Produto"), cell("Preço")],
    [cell("Mouse"), cell("")],
  ]));

  assert.deepEqual(result, [["Produto", "Preço"], ["Mouse", ""]]);
});

test("expande rowspan e colspan com posições mescladas vazias", () => {
  const result = tableToMatrix(table([
    [cell("Categoria", 2), cell("Valores", 1, 2)],
    [cell("Mínimo"), cell("Máximo")],
  ]));

  assert.deepEqual(result, [
    ["Categoria", "Valores", ""],
    ["", "Mínimo", "Máximo"],
  ]);
});

test("extrai metadados e rótulo da legenda", () => {
  const sample = table([[cell("A"), cell("B")]], { caption: "Produtos" });
  const doc = {
    title: "Página de teste",
    querySelectorAll(selector) {
      assert.equal(selector, "table");
      return [sample];
    },
  };

  assert.deepEqual(extractTables(doc), {
    pageTitle: "Página de teste",
    tables: [{
      index: 0,
      label: "Produtos",
      rowCount: 1,
      columnCount: 2,
      data: [["A", "B"]],
    }],
  });
});
