# Revisão da identidade — 23/11/2026

Continuação do PR 17, origem d48e759, por pedido de Carlos. Não fazer merge nem publicar no domínio oficial sem seu OK. O branch visual-fotos-fontes-efeitos permanece separado e intacto. Trabalho realizado em cópia isolada para preservar alterações locais de outro atendimento.

## Direção mantida

- Ameixa #392645 para estrutura e ações, tinta #281e30 para leitura, lavanda #f2ebf6 para a busca e pausas visuais, pera #dce9a8 para o convite principal, fundo #fcf9fd e texto secundário #5c5063.
- Palatino/Palatino Linotype com Georgia de reserva nos títulos; fonte de sistema nos textos e formulários. Sem dependência de fontes externas.
- Abertura com foto e texto lado a lado no computador, fotografia antes do texto no celular e busca encaixada na mesma composição. Serviços com fotos grandes, conteúdo alinhado à esquerda e menos molduras.
- A cor distingue a marca do Brasa. A lembrança principal é a combinação ameixa/pera com fotografia de cozinha; sem ornamentos, números decorativos ou efeitos novos. Textos, imagens, formulários e destinos preservados.

## Refinamentos desta rodada

- Título da abertura com largura e escala equilibradas: duas linhas na tela de computador revisada, sem quebra artificial no meio de palavras.
- Foto da abertura em 4:3 no celular e ponto de enquadramento ajustado para preservar o rosto. Carregamento prioritário apenas para a foto principal; demais fotos continuam sob demanda.
- Formulário em três campos com ação abaixo em telas intermediárias, evitando campos apertados; no celular, campos de data/pessoas lado a lado e botão com largura total. Texto de entrada de 16px no celular.
- Estados de foco e hover em ameixa/lavanda, incluindo o cabeçalho da inicial, sem retorno ao verde carvão no botão Buscar. Ajustes de leitura e foco dos cartões e enquadramento de sushi/brunch.

## Validação

- A prévia original da Cloudflare abriu em https://codex-identidade-mesa.seu-chef-em-casa.pages.dev/; comentário do deploy do PR confirmou d48e759.
- Revisão local em desktop, 820px, 390px e 320px: sem transbordamento horizontal; legibilidade, enquadramento e campos conferidos. Fotos precisam terminar de carregar antes de capturar a página.
- Busca com Florianópolis, 12/12/2026 e seis pessoas transferiu os três valores para a tela de resultados. Os quatro cartões selecionaram a experiência correspondente; Ver todos os serviços abriu 55 cartões. Testes funcionais locais usam os dados de demonstração, sem acesso ao banco de produção.
- npm run check, npm test (63) e npm run build passaram após os ajustes; git diff --check sem erros. Nenhuma alteração de backend, credenciais ou banco.

As prévias de branch não exibem os cadastros reais quando não há banco vinculado; o estado vazio da seção de chefs não é perda de conteúdo. O catálogo de serviços e a abertura podem ser avaliados normalmente.

## 23/11/2026 · Continuação: oliva, marfim e vinho

Direção escolhida por Carlos depois da primeira proposta. O tema compartilhado fica em `assets/identity.css`: oliva #455238, marfim #f6f3eb/#fffdf8, vinho #754653. Os títulos usam Palatino/Palatino Linotype com Georgia de reserva; corpo mantém a fonte do sistema. Tipografia, espaço entre elementos, estados de interação e fotos maiores dão continuidade entre início, busca, serviços, perfis, formulários e painéis.

A vitrine `/c/<id>` também recebe a direção de cores e tipografia. O tema da administração só é aplicado em tela, preservando a impressão do dashboard. A estrutura funcional e os conteúdos anteriores são mantidos. Há uma nova área de menus especiais; ver `docs/MENUS-ESPECIAIS.md`.

Revisão no navegador: início, busca com cidade/data/pessoas, cartões de serviço, perfil, orçamento e novo recurso em 1440px e 390px; editor/detalhe em 320px. Ajustado o cabeçalho estreito, o preenchimento dos cartões com fotos e a quebra das abas do painel do chef, que causavam rolagem horizontal em 320px. As capturas e artes de exemplo foram salvas fora do repositório para avaliação do Carlos.
