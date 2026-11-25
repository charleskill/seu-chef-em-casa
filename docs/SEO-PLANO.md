# Plano de SEO · Seu Chef em Casa (25/11/2026)

Objetivo do Carlos: SEO redondo antes de divulgar para clientes; depois, tráfego pago.

## Situação hoje
- Há `robots.txt`, `sitemap.xml` (só a página inicial) e tags Open Graph.
- O site é uma página única com rotas por `#` (`/#/chef/id`, `/#/buscar`). O Google ignora o que vem depois do `#`: perfis, busca e serviços não são indexados.
- `functions/c/[id].js` gera um cartão de compartilhamento sem `#` (só resumo), e `functions/m/[[rota]].js` faz o mesmo para menus.
- Vitrine com 0 chefs reais visíveis (perfis fictícios escondidos em 25/11).

## Ordem de trabalho
1. **Perfis indexáveis:** `/chef/<slug>` renderizado no servidor (Pages Functions), com HTML completo do perfil (nome, especialidade, cidades, bio, pratos, fotos), `<title>`, meta description, canonical, Open Graph e JSON-LD (Person/LocalBusiness + Menu). O app continua funcionando por cima. Redirecionar `/c/<id>` para o novo endereço (301).
2. **Páginas de cidade:** `/personal-chef/<cidade>` (Florianópolis, São José, Palhoça, Balneário Camboriú, Joinville, Blumenau...), listando chefs reais da cidade, com texto próprio e FAQ (JSON-LD FAQPage). Sem chefs, mostrar convite e não indexar (noindex) até ter ao menos 1 chef.
3. **Páginas de serviço:** `/servicos/<ocasiao>` (jantar a dois, churrasco, marmitas da semana...).
4. **Sitemap dinâmico** gerado do banco (chefs visíveis e completos, cidades com chef, serviços) e `robots.txt` apontando para ele.
5. **Desempenho e qualidade:** Core Web Vitals no celular (LCP, CLS), imagens com tamanho e `alt`, títulos únicos, `lang="pt-BR"`, 404 real.
6. **Contas Google (com o Carlos):** Search Console (verificar domínio via DNS na Cloudflare, enviar sitemap) e Perfil da Empresa no Google.
7. **Conteúdo com a voz da marca** (cozinha, sem inventar números): "Quanto custa um personal chef em SC" (só com dados reais), "Jantar a dois em casa", "Ceia de Natal com chef", "Marmitas da semana".

## Regras
- Nada de chefs, preços ou depoimentos inventados. Perfis fictícios nunca indexados.
- Mudar endereços só uma vez, antes de divulgar.
- Skills de SEO: só de fontes confiáveis (ComposioHQ/awesome-claude-skills, VoltAgent/awesome-agent-skills, alirezarezvani/claude-skills), lendo o conteúdo antes de instalar. Evitar cópias com nomes aleatórios.
- Publicar só com o SIM do Carlos.
