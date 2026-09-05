# Checklist de publicação — Chrome Web Store

## 1. Antes do upload

- [ ] Instalar a pasta sem compactação em `chrome://extensions`.
- [ ] Executar o roteiro manual do `README.md` em pelo menos três sites reais.
- [ ] Confirmar cópia no Google Sheets e abertura do CSV no Excel/LibreOffice.
- [ ] Conferir o console do popup e a página de erros em `chrome://extensions`.
- [ ] Hospedar `privacy-policy/index.html` em uma URL HTTPS pública.
- [ ] Substituir a screenshot promocional se a interface instalada tiver sido alterada.
- [ ] Executar `npm test`, `npm run validate` e `npm run package`.

## 2. Criar o item

1. Acesse o [Chrome Web Store Developer Dashboard](https://chrome.google.com/webstore/devconsole/).
2. Clique em **Add new item / Novo item**.
3. Envie `dist/web-to-csv-v1.0.0.zip`.
4. Confirme que o painel aceitou o manifesto. O `manifest.json` está na raiz do ZIP, como exigido.

## 3. Store listing

Copie os textos de `STORE_LISTING.md` e use:

- idioma: Português (Brasil);
- categoria: Produtividade;
- ícone: `icons/icon-128.png`;
- screenshot: `store-assets/screenshot-1280x800.png`;
- bloco promocional: `store-assets/small-promo-440x280.png`;
- conteúdo adulto: não;
- compras no aplicativo: não.

## 4. Privacy practices

- finalidade única: copie o campo **Finalidade única** de `STORE_LISTING.md`;
- `activeTab`: copie a justificativa correspondente;
- `scripting`: copie a justificativa correspondente;
- código remoto: **não usa código remoto**;
- dados tratados: declare **conteúdo do site**;
- uso: funcionalidade principal solicitada pelo usuário;
- venda, anúncios, perfilamento e compartilhamento: não;
- política de privacidade: informe a URL HTTPS publicada;
- certificação de Uso Limitado: confirme as declarações compatíveis com o comportamento da V1.

A leitura local de tabelas ainda é considerada tratamento de dados pelas regras da loja. A declaração deve dizer “conteúdo do site”, mesmo que nada saia do dispositivo.

## 5. Distribution e envio

- visibilidade: pública;
- regiões: todas, salvo decisão comercial diferente;
- preço: gratuito;
- aceite os termos finais e clique para enviar à análise.

A publicação pública efetiva depende da revisão da Chrome Web Store; enviar hoje não garante aprovação no mesmo dia.

## Referências oficiais consultadas

- [Preparar a extensão e o ZIP](https://developer.chrome.com/docs/webstore/prepare)
- [Publicar na Chrome Web Store](https://developer.chrome.com/docs/webstore/publish)
- [Preencher os campos de privacidade](https://developer.chrome.com/docs/webstore/cws-dashboard-privacy)
- [Política e tratamento local de dados](https://developer.chrome.com/docs/webstore/program-policies/user-data-faq)
- [Dimensões e regras para imagens](https://developer.chrome.com/docs/webstore/images)
