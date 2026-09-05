# Chrome Web Store — textos da V1

## Nome

Web to CSV - Exportar Tabelas

## Resumo curto

Detecte tabelas em páginas, visualize, copie e exporte os dados para CSV com processamento local.

## Categoria sugerida

Produtividade

## Descrição completa (pt-BR)

Transforme tabelas de páginas web em arquivos CSV em poucos cliques.

O Web to CSV detecta as tabelas HTML existentes na aba aberta e permite conferir uma prévia antes de copiar ou exportar os dados. Tudo acontece localmente no seu navegador.

Recursos:

- detecção automática de tabelas HTML;
- quantidade de linhas e colunas;
- prévia das primeiras cinco linhas;
- cópia em formato compatível com planilhas;
- exportação CSV em UTF-8 com suporte a acentos;
- tratamento de vírgulas, aspas e quebras de linha;
- suporte básico a células com rowspan e colspan;
- nenhuma conta, login ou servidor externo.

Como usar:

1. Abra uma página que contenha uma tabela.
2. Clique no ícone do Web to CSV.
3. Visualize, copie ou exporte a tabela desejada.

Privacidade:

O conteúdo das tabelas é processado somente no seu dispositivo. A extensão não coleta, envia ou armazena o conteúdo das páginas nem seu histórico de navegação.

Limitações da V1:

- extrai elementos HTML `<table>` da página principal;
- não identifica listas ou cartões construídos apenas com `<div>`;
- não acessa páginas internas protegidas do Chrome;
- não contorna login, CAPTCHA, paywall ou proteções do site.

## Finalidade única

Permitir que o usuário extraia tabelas HTML presentes na aba escolhida para prévia, cópia em planilhas e exportação em CSV.

## Justificativa de permissões

### activeTab

Usada para obter acesso temporário à aba ativa somente quando o usuário abre a extensão. A extensão não mantém acesso permanente aos sites nem executa automaticamente em segundo plano.

### scripting

Usada para injetar, sob demanda, o extrator empacotado na aba ativa e localizar elementos HTML `<table>`. Nenhum código remoto é carregado ou executado.

### Acesso amplo a hosts

Não solicitado. O manifesto não contém `host_permissions` nem `<all_urls>`.

## Declarações de privacidade — respostas da V1

- A extensão trata dados do usuário: **sim**, porque lê conteúdo de tabelas da página mesmo que o processamento seja local.
- Categoria a declarar: **conteúdo do site**.
- Finalidade: funcionalidade principal da extensão.
- Processamento do conteúdo: apenas local, iniciado pelo usuário.
- Transmissão para servidor: não.
- Armazenamento externo: não.
- Analytics ou rastreamento: não.
- Venda ou compartilhamento de dados: não.
- Código remoto: não.
- Histórico de navegação: não é coletado ou armazenado.
- Certificação de Uso Limitado: confirmar, pois o acesso serve apenas à finalidade única divulgada.

Mesmo sem transmissão, a Chrome Web Store considera a leitura local de conteúdo da página como tratamento de dados. Por isso, não marque “não trata dados” se o painel usar esse conceito amplo.

## Política de privacidade

Publique `privacy-policy/index.html` em uma URL HTTPS pública e informe essa URL no painel. Não use uma URL local ou um arquivo dentro do ZIP.

## Recursos gráficos

- Ícone da loja: `icons/icon-128.png` (128 × 128).
- Screenshot: `store-assets/screenshot-1280x800.png` (1280 × 800).
- Bloco promocional pequeno opcional: `store-assets/small-promo-440x280.png` (440 × 280).

Antes do envio, confira se a screenshot corresponde à interface da versão instalada e não contém informações pessoais.
