# Contexto do projeto — Seu Chef em Casa

Leia este arquivo no começo de cada conversa nova, junto com `AGENTS.md` e `docs/` (PROJETO, TAREFAS, DECISOES, ATIVAR-CLOUDFLARE).
Atualizado em 09/11/2026, na passagem do projeto para o Claude Code.

## O que é
- Marketplace para achar personal chefs (foco em Santa Catarina), montar o cardápio e pedir orçamento pelo WhatsApp.
- Nome: **Seu Chef em Casa** (Carlos descartou "Mesa Posta" em 09/11). Domínio pretendido: seuchefemcasa.com.br (ainda não comprado; compra no registro.br, feita por Carlos).
- Marca separada do Seu Restaurante Online (outro repositório), mas na mesma base técnica (Cloudflare).
- Termos: o app é só uma vitrine; não responde pelo que acontece entre cliente e chef.
- Meta imediata: piloto com 3 chefs profissionais reais.

## Onde está
- **Versão real (no ar desde 09/11):** https://seu-chef-em-casa.pages.dev — Cloudflare Pages ligado ao GitHub (cada push na `main` publica sozinho), Functions em `functions/api/[[rota]].js`, banco D1 `chefemcasa` (binding `DB`), código de convite em segredo `CONVITE` (Carlos sabe o valor). Conta Cloudflare: carlosmendes.ricci@gmail.com.
- **Demonstração (GitHub Pages, dados só no aparelho):** https://charleskill.github.io/seu-chef-em-casa/ — 50 perfis de exemplo.
- Banco: `migrations/0001_piloto.sql` e `0002_google.sql` já aplicadas no D1 de produção.
- Testes: `npm run check`, `npm test` (41), `npm run build` (rodar o build antes de cada commit: ele carimba a versão dos arquivos no `index.html`).
- Teste local da versão real: `wrangler pages dev dist` com `wrangler.toml` temporário (não versionar), D1 local e as migrações; há um servidor falso do Google descrito em `docs/TAREFAS.md` (entrega do login com Google).

## Regras fixas do Carlos
- Commit e push direto na `main`, sem pull request.
- Telefone de teste em **todo** dado fictício (perfis de exemplo, testes, contas de teste): **(48) 99110-6355**.
- Registrar entregas em `docs/TAREFAS.md` (com o que foi realmente verificado) e decisões em `docs/DECISOES.md`.
- Não afirmar que abrir o WhatsApp confirma envio.

## Pendências (em ordem)
1. Primeiro chef de teste na versão real (Carlos cria com o convite) e conferir em outro aparelho.
2. Feito em 09/11: Mensagens e perfis de exemplo escondidos na versão real; Pausar perfil e Excluir conta.
3. Login com Google: Carlos cria a credencial (docs/ATIVAR-CLOUDFLARE.md, seção 6) e adiciona `GOOGLE_CLIENT_ID` e `GOOGLE_CLIENT_SECRET` na Cloudflare.
4. GitHub → Settings → Pages → Source: **GitHub Actions** (hoje publica da branch e expõe `docs/` e `migrations/` na demonstração).
5. Domínio seuchefemcasa.com.br: comprar, pôr na Cloudflare, ligar ao Pages e acrescentar no Google.
6. Termos: e-mail de contato e revisão por advogado.
7. Depois do piloto: login Microsoft, troca de senha por e-mail.
