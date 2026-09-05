const fs = require("node:fs");
const path = require("node:path");

const projectRoot = path.resolve(__dirname, "..");
const manifestPath = path.join(projectRoot, "manifest.json");
const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));

const failures = [];
const requiredFiles = [
  "manifest.json",
  "popup/popup.html",
  "popup/popup.css",
  "popup/popup.js",
  "scripts/extractor.js",
  "utils/csv.js",
  "icons/icon-16.png",
  "icons/icon-32.png",
  "icons/icon-48.png",
  "icons/icon-128.png",
];

if (manifest.manifest_version !== 3) failures.push("manifest_version deve ser 3");
if (!/^\d+\.\d+\.\d+$/.test(manifest.version)) failures.push("versão inválida");
if (manifest.host_permissions?.length) failures.push("host_permissions não deve existir na V1");
if (manifest.content_scripts?.length) failures.push("content_scripts permanente não deve existir na V1");

const permissions = [...(manifest.permissions ?? [])].sort();
if (JSON.stringify(permissions) !== JSON.stringify(["activeTab", "scripting"])) {
  failures.push("as únicas permissões devem ser activeTab e scripting");
}

requiredFiles.forEach((relativePath) => {
  if (!fs.existsSync(path.join(projectRoot, relativePath))) {
    failures.push(`arquivo ausente: ${relativePath}`);
  }
});

if (failures.length > 0) {
  console.error(failures.map((failure) => `- ${failure}`).join("\n"));
  process.exitCode = 1;
} else {
  console.log("Pacote válido: Manifest V3, permissões mínimas e arquivos presentes.");
}
