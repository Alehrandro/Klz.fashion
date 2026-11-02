# Mercado Livre – protótipo mobile

Protótipo front-end (HTML, CSS e JavaScript puro, sem build) de um app de compras: tela inicial, página de produto, carrinho e painel Admin.

## Estrutura
- `index.html` – páginas e estrutura
- `css/style.css` – estilos (tema claro e escuro)
- `js/app.js` – lógica, produtos, carrinho e admin

## Publicar no GitHub Pages
1. Crie um repositório no GitHub e envie todos estes arquivos para a raiz (branch `main`).
2. Em **Settings > Pages**, escolha **Deploy from a branch**, branch `main`, pasta `/ (root)`.
3. Aguarde alguns minutos: o site abre em `https://SEU-USUARIO.github.io/NOME-DO-REPOSITORIO/`.

Para testar localmente, abra `index.html` no navegador.

## Painel Admin
Botão **Admin** no cabeçalho: criar e excluir produtos (imagens, descrição, preço e desconto), editar categorias, trocar a imagem do cabeçalho (logotipo), o nome do app, a cor, os banners, o desconto no Pix e o valor do frete grátis, editar produtos (estoque, tamanhos e cores), apagar avaliações, cadastrar os links de WhatsApp e Instagram do vendedor, além de ver as compras em aberto.

Os dados ficam no `localStorage` do navegador de cada visitante. Contas, senhas, avaliações (com fotos e vídeos) e pedidos também ficam só no navegador, e as credenciais do admin estão no código: isso é apenas demonstração. Para uso real, adicione autenticação e um back-end (por exemplo Firebase ou Supabase).

Projeto educacional, sem relação oficial com o Mercado Livre.
