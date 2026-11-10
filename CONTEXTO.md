# Contexto do projeto — Seu Chef em Casa

Leia este arquivo no começo de cada conversa nova, junto com `AGENTS.md` e `docs/` (PROJETO, TAREFAS, DECISOES, ATIVAR-CLOUDFLARE).
Atualizado em 09/11/2026, na passagem do projeto para o Claude Code.

## O que é
- Marketplace para achar personal chefs (foco em Santa Catarina), montar o cardápio e pedir orçamento pelo WhatsApp.
- Nome: **Seu Chef em Casa** (Carlos descartou "Mesa Posta" em 09/11). Domínio: seuchefemcasa.com.br, registrado por Carlos no registro.br em 09/11/2026 (válido até 09/11/2027) e ligado ao Pages no mesmo dia: https://seuchefemcasa.com.br abre a versão real.
- Marca separada do Seu Restaurante Online (outro repositório), mas na mesma base técnica (Cloudflare).
- Termos: o app é só uma vitrine; não responde pelo que acontece entre cliente e chef.
- Meta imediata: piloto com 3 chefs profissionais reais.

## Onde está
- **Versão real (no ar desde 09/11):** https://seu-chef-em-casa.pages.dev — Cloudflare Pages ligado ao GitHub (cada push na `main` publica sozinho), Functions em `functions/api/[[rota]].js`, banco D1 `chefemcasa` (binding `DB`), código de convite opcional pelo segredo `CONVITE`, apagado da Cloudflare em 09/11 à noite: o cadastro de chef está aberto (recriar a variável fecha de novo). Conta Cloudflare: carlosmendes.ricci@gmail.com.
- **Demonstração (GitHub Pages, dados só no aparelho):** https://charleskill.github.io/seu-chef-em-casa/ — 50 perfis de exemplo.
- Banco: `migrations/0001_piloto.sql` e `0002_google.sql` já aplicadas no D1 de produção.
- Testes: `npm run check`, `npm test` (41), `npm run build` (rodar o build antes de cada commit: ele carimba a versão dos arquivos no `index.html`).
- Teste local da versão real: `wrangler pages dev dist` com `wrangler.toml` temporário (não versionar), D1 local e as migrações; há um servidor falso do Google descrito em `docs/TAREFAS.md` (entrega do login com Google).

## Regras fixas do Carlos
- Commit e push direto na `main`, sem pull request (vale para o assistente principal, que o Carlos acompanha na hora). Outros assistentes, como o Jules, abrem pull request e não fazem merge: ver `docs/GUIA-OUTRO-ASSISTENTE.md`.
- Telefone de teste em **todo** dado fictício (perfis de exemplo, testes, contas de teste): **(48) 99110-6355**.
- Registrar entregas em `docs/TAREFAS.md` (com o que foi realmente verificado) e decisões em `docs/DECISOES.md`.
- Não afirmar que abrir o WhatsApp confirma envio.

## Área da equipe ligada (10/11)
- `ADMIN_EMAILS` criada na Cloudflare (Carlos e Fer). Quem entra com um desses e-mails vê o botão Equipe (`/#/admin`), com esconder perfil, link de nova senha e excluir conta.

## Site aberto de novo (10/11)
- A senha de acesso foi desligada no código em 10/11 (`LIGADA = false` em `functions/_middleware.js`). A variável `SENHA_SITE` continua na Cloudflare, sem efeito.

## Histórico: site fechado para testes (10/11)
- O site na Cloudflare pede uma senha de acesso antes de abrir (`functions/_middleware.js`, variável secreta `SENHA_SITE`). Para abrir ao público, apagar a variável e publicar de novo. Detalhes em docs/ATIVAR-CLOUDFLARE.md, seção 9. A demonstração do GitHub Pages continua aberta.

## Novidades de 09/11 (noite)
- Cadastro de chef aberto (sem convite; `CONVITE` opcional), área da equipe `/#/admin` (`ADMIN_EMAILS`), link de compartilhamento `/c/<id>` com prévia, aviso de pedido por e-mail (precisa de domínio). Detalhes em docs/TAREFAS.md e ATIVAR-CLOUDFLARE.md (seções 7 e 8).

## Pendências (em ordem)
1. Primeiro chef de teste na versão real (Carlos cria com o convite) e conferir em outro aparelho.
2. Feito em 09/11: Mensagens e perfis de exemplo escondidos na versão real; Pausar perfil e Excluir conta.
3. Login com Google: Carlos cria a credencial (docs/ATIVAR-CLOUDFLARE.md, seção 6) e adiciona `GOOGLE_CLIENT_ID` e `GOOGLE_CLIENT_SECRET` na Cloudflare.
4. GitHub → Settings → Pages → Source: **GitHub Actions** (hoje publica da branch e expõe `docs/` e `migrations/` na demonstração).
5. Domínio seuchefemcasa.com.br: comprado, posto na Cloudflare e ligado ao Pages em 09/11 (raiz e `www`, em Custom domains); `https://seuchefemcasa.com.br` e `/api/saude` respondem. Falta acrescentar o domínio no Google quando a credencial for criada. Os registros atuais (SPF `-all`, MX nulo) bloqueiam e-mail no domínio e terão de mudar para o aviso de pedido por e-mail. Detalhes em `docs/VISAO-GERAL.md`, seção 7.
6. Termos: e-mail de contato e revisão por advogado.
7. Depois do piloto: login Microsoft, troca de senha por e-mail.
