# Contexto do projeto — Seu Chef em Casa

Leia este arquivo no começo de cada conversa nova, junto com `AGENTS.md` e `docs/`.

## O que é
- Marketplace para achar personal chefs (foco em Santa Catarina), montar o cardápio e pedir orçamento pelo WhatsApp. Nome futuro em estudo: Mesa Posta.
- Marca separada do Seu Restaurante Online (outro repositório), mas na mesma base técnica (Cloudflare).
- Termos: o app é só uma vitrine; não responde pelo que acontece entre cliente e chef.

## Onde está
- Demonstração pública (GitHub Pages, dados só no aparelho): https://charleskill.github.io/seu-chef-em-casa/
- Versão real (banco D1 + login de chef com código de convite) pronta no código, liga quando publicada na Cloudflare. Passo a passo: `docs/ATIVAR-CLOUDFLARE.md`.
- Testes: `npm run check`, `npm test`, `npm run build`.

## Pendências
- Carlos: criar conta Cloudflare, banco `chefemcasa`, ligar o repositório, definir o `CONVITE` e mandar aos 2 chefs reais.
- Troca de senha por e-mail (precisa de serviço de e-mail e domínio).
- E-mail de contato e revisão por advogado(a) dos termos.
- Desligar os 50 perfis de exemplo quando houver chefs reais suficientes.

## Como trabalhar neste repositório
- Commit e push direto na `main`, sem pull request (pedido do Carlos).
- Registrar entregas em `docs/TAREFAS.md` e decisões em `docs/DECISOES.md`.
