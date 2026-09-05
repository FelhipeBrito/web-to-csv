#!/usr/bin/env bash
set -euo pipefail

project_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
output_dir="${project_root}/dist"
output_file="${output_dir}/web-to-csv-v1.0.0.zip"

mkdir -p "${output_dir}"
temporary_dir="$(mktemp -d "${output_dir}/.web-to-csv-package.XXXXXX")"
temporary_file="${temporary_dir}/web-to-csv-v1.0.0.zip"

cd "${project_root}"
zip -q -r "${temporary_file}" \
  manifest.json \
  popup \
  scripts/extractor.js \
  utils/csv.js \
  icons/icon-16.png \
  icons/icon-32.png \
  icons/icon-48.png \
  icons/icon-128.png

mv -f "${temporary_file}" "${output_file}"
rmdir "${temporary_dir}"
printf 'Pacote criado: %s\n' "${output_file}"
