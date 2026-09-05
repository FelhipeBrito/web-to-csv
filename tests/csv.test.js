const test = require("node:test");
const assert = require("node:assert/strict");
const {
  UTF8_BOM,
  escapeCsvCell,
  matrixToCsv,
  matrixToTsv,
} = require("../utils/csv.js");

test("escapa vírgulas, aspas e quebras de linha no CSV", () => {
  assert.equal(escapeCsvCell("Mouse, gamer"), '"Mouse, gamer"');
  assert.equal(escapeCsvCell('Monitor 24"'), '"Monitor 24"""');
  assert.equal(escapeCsvCell("linha 1\nlinha 2"), '"linha 1\nlinha 2"');
  assert.equal(escapeCsvCell("R$ 100"), "R$ 100");
});

test("gera CSV RFC 4180 com CRLF e Unicode preservado", () => {
  const csv = matrixToCsv([
    ["Produto", "Preço", "Loja"],
    ["Mouse A", "R$ 100,00", "São José"],
  ]);

  assert.equal(
    UTF8_BOM + csv,
    '\uFEFFProduto,Preço,Loja\r\nMouse A,"R$ 100,00",São José',
  );
});

test("gera TSV adequado para colar em planilhas", () => {
  assert.equal(
    matrixToTsv([["A\tB", "linha 1\nlinha 2"], ["ç", "R$ 9"]]),
    "A B\tlinha 1 linha 2\r\nç\tR$ 9",
  );
});

test("rejeita entradas que não sejam matrizes", () => {
  assert.throws(() => matrixToCsv("texto"), TypeError);
  assert.throws(() => matrixToCsv([["ok"], "inválida"]), TypeError);
});
