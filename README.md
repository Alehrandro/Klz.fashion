# KLZ Fashion — Moda masculina

Loja virtual (HTML + CSS + JavaScript puro) com painel admin, carrinho, cupons e checkout.
Os dados ficam no **Supabase**; o site é publicado no **GitHub Pages**.

```
index.html          página
css/style.css       estilos
js/config.js        URL e chave pública do Supabase  <-- você edita
js/cloud.js         integração com o Supabase
js/app.js           lógica da loja e do admin
supabase/schema.sql tabelas, regras de segurança (RLS), funções e dados iniciais
```

## 1. Configurar o Supabase
1. Crie um projeto em supabase.com.
2. **SQL Editor → New query**, cole o conteúdo de `supabase/schema.sql` e clique em **Run**.
3. **Authentication → Users → Add user**: crie seu usuário (e-mail + senha).
4. No SQL Editor, torne-o administrador (troque o e-mail):
   ```sql
   insert into public.admins (user_id)
   select id from auth.users where email = 'SEU-EMAIL@exemplo.com';
   ```
5. **Project Settings → API**: copie a *Project URL* e a chave *anon / publishable*.
6. Cole as duas em `js/config.js`.

> A chave anon/publishable é pública por natureza e pode ir ao GitHub. **Nunca** use a `service_role`/secret no front-end.

## 2. Publicar no GitHub Pages
```bash
git init
git add .
git commit -m "KLZ Fashion"
git branch -M main
git remote add origin https://github.com/SEU-USUARIO/SEU-REPO.git
git push -u origin main
```
No GitHub: **Settings → Pages → Deploy from a branch → main / (root)**.
Depois, no Supabase: **Authentication → URL Configuration** e coloque a URL do Pages em *Site URL*.

## Como funciona a segurança
- Visitantes só **leem** produtos e configurações.
- Pedidos são criados pela função `place_order`, que confere estoque e recalcula preço, cupom, frete e desconto Pix no servidor.
- Produtos, estoque, pedidos, cupons, banners e fotos só podem ser alterados por quem está na tabela `admins`.
- A lista de cupons não é pública; o cliente só valida um código por vez.

## Modo demonstração
Com `js/config.js` vazio, o app funciona só no navegador (localStorage).
Login admin da demonstração: `demo@klz.local` / `demo123456`.
Com o Supabase configurado, esse login deixa de existir e vale o usuário do Supabase.
