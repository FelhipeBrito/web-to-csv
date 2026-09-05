# Web to CSV — Chrome Extension

Extensão Manifest V3 que detecta tabelas HTML na aba ativa, mostra uma prévia, copia os dados em TSV e exporta CSV UTF-8. Todo o processamento ocorre localmente, sem backend, login ou analytics.

## Escopo da V1

- detectar elementos `<table>` na página principal;
- mostrar linhas, colunas e prévia de até cinco linhas;
- copiar em TSV para colar em Excel ou Google Sheets;
- exportar CSV padrão com vírgula, CRLF e BOM UTF-8;
- preservar células vazias e tratar vírgulas, aspas e quebras de linha;
- suporte básico a `rowspan` e `colspan` (conteúdo na primeira posição e posições mescladas vazias);
- mensagem clara quando nenhuma tabela for encontrada.

Ficam para uma V2: seleção visual de elementos repetidos, múltiplas páginas, histórico, XLSX/JSON, templates e recursos premium.

## Estrutura

```text
web-to-csv/
├── manifest.json
├── popup/
├── scripts/
├── utils/
├── icons/
├── privacy-policy/
├── store-assets/
├── tests/
├── STORE_LISTING.md
└── README.md
```

## Instalação local

1. Abra `chrome://extensions`.
2. Ative o **Modo do desenvolvedor**.
3. Clique em **Carregar sem compactação**.
4. Selecione a pasta `web-to-csv`.
5. Fixe a extensão na barra do Chrome.

## Teste manual rápido

1. Sirva a pasta do projeto com `python3 -m http.server 8080`.
2. Abra `http://localhost:8080/tests/test-page.html` no Chrome.
3. Clique no ícone da extensão.
4. Confirme que duas tabelas são detectadas.
5. Abra as prévias e confira acentos, células vazias e células mescladas.
6. Clique em **Copiar** e cole em uma planilha.
7. Exporte os dois CSVs e abra-os no Excel ou Google Sheets.
8. Abra uma página sem `<table>` e confirme a mensagem de estado vazio.
9. Abra `chrome://settings`, clique na extensão e confirme a mensagem de página protegida.
10. Em `chrome://extensions`, use **Inspecionar visualizações: popup** e confirme que não há erros relevantes.

## Testes automatizados

Requer Node.js 18 ou superior. Não há dependências para instalar.

```bash
npm test
npm run validate
npm run package
```

## Permissões

- `activeTab`: acesso temporário somente depois de o usuário abrir a extensão na aba.
- `scripting`: injeta o extrator local sob demanda.

Não há `host_permissions`, `<all_urls>`, content script permanente ou execução em segundo plano.

## Empacotamento

O ZIP de publicação contém apenas os arquivos necessários à execução da extensão. Documentação, testes, política hospedável e imagens de divulgação ficam fora do pacote.

Depois de qualquer mudança no código:

1. atualize a versão em `manifest.json`;
2. execute os testes e a validação;
3. gere novamente o ZIP;
4. recarregue a extensão e repita o teste manual.

Consulte `STORE_LISTING.md` para os textos, permissões e recursos da publicação.
O passo a passo final está em `PUBLISHING_CHECKLIST.md`.
