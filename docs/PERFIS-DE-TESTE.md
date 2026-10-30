# Perfis de teste (50 chefs fictícios)

Existem para testar o app com o catálogo cheio antes do lançamento. Tudo é fictício: nomes, bios, preços, avaliações e imagens. Nenhum tem WhatsApp, e-mail ou Instagram, então nenhum recebe contato de verdade. O app os identifica com a etiqueta "Perfil de exemplo".

## Como funcionam
- Vêm do código (`assets/demo-data.js` e `assets/demo-images.js`) e **nunca são gravados no navegador**. Eles aparecem em qualquer navegador, mesmo com chefs já salvos, e entram depois dos chefs reais.
- Os pedidos de teste feitos neles só geram a simulação (copiar texto). O botão de abrir o WhatsApp não aparece para perfis de exemplo.
- Pratos: catálogo de 238 receitas (Santa Catarina, Brasil e internacional) em `scripts/demo/catalogo.cjs`.
- Imagens: ilustrações geradas (prato com emoji) e algumas fotos do Unsplash que já estavam no projeto. Não são fotos de pratos reais.

## Esconder todos de uma vez
Em `assets/demo-data.js`, troque `window.ChefDemo={enabled:true}` por `enabled:false`. Nenhum navegador precisa ser limpo.

## Remover de vez
1. Apague `assets/demo-data.js` e `assets/demo-images.js`.
2. Apague as duas linhas `<script defer src="assets/demo-...">` do `index.html` e os nomes `demo-data.js` e `demo-images.js` em `scripts/build.cjs` e `package.json` (script `check`).
3. Apague `tests/demo-data.test.cjs` (e, se quiser, `scripts/gerar-demo.cjs` e `scripts/demo/`).

O app funciona sem esses arquivos. Os chefs reais cadastrados e o "painel de demonstração" não são afetados.

## Regenerar
`node scripts/gerar-demo.cjs` recria os dois arquivos a partir do catálogo e de `scripts/demo/base-perfis.json`. As imagens exigem Playwright com Chromium instalado.
