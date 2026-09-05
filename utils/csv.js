(function initCsvUtils(root, factory) {
  const api = factory();

  if (typeof module === "object" && module.exports) {
    module.exports = api;
  } else {
    root.CsvUtils = api;
  }
})(typeof globalThis !== "undefined" ? globalThis : this, function createCsvUtils() {
  "use strict";

  const UTF8_BOM = "\uFEFF";

  function escapeCsvCell(value) {
    const text = value == null ? "" : String(value);

    if (/[",\r\n]/.test(text)) {
      return `"${text.replace(/"/g, '""')}"`;
    }

    return text;
  }

  function matrixToCsv(rows) {
    if (!Array.isArray(rows)) {
      throw new TypeError("Os dados do CSV devem ser uma matriz.");
    }

    return rows
      .map((row) => {
        if (!Array.isArray(row)) {
          throw new TypeError("Cada linha do CSV deve ser um array.");
        }

        return row.map(escapeCsvCell).join(",");
      })
      .join("\r\n");
  }

  function sanitizeTsvCell(value) {
    return (value == null ? "" : String(value))
      .replace(/\t/g, " ")
      .replace(/\r?\n/g, " ");
  }

  function matrixToTsv(rows) {
    if (!Array.isArray(rows)) {
      throw new TypeError("Os dados do TSV devem ser uma matriz.");
    }

    return rows
      .map((row) => row.map(sanitizeTsvCell).join("\t"))
      .join("\r\n");
  }

  return Object.freeze({
    UTF8_BOM,
    escapeCsvCell,
    matrixToCsv,
    matrixToTsv,
  });
});
