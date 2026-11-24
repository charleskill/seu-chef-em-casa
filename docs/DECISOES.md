# Decisões do Projeto

Registro de escolhas arquiteturais, limites e regras de negócio para manter consistência e rastreabilidade.

## 23/11/2026 · Identidade em todas as telas e menus especiais
- Carlos escolheu **verde oliva, marfim e vinho discreto**, substituindo a proposta inicial ameixa/lavanda/pera. Identidade aplicada também a busca, serviços, perfil, orçamento, acesso, configurações, painel do chef, administração e vitrine compartilhável.
- Recurso aprovado na conversa: menus por ocasião, com cardápio, preço/base explícita, quantidade, modo de atendimento, inclusões e prazo; divulgação por PNG quadrado/feed/story e mensagem com link próprio. Não exige geração por IA para cada arte.
- Datas comemorativas ficam reunidas em Menus especiais, dentro de Serviços e com entrada na página inicial. Não se cria uma aba permanente para cada feriado.

## 23/11/2026 · Ajustes técnicos e UX pós-auditoria do Chef
- Criação estática de robots.txt e sitemap.xml para desarmar o fallback de SPA no Cloudflare Pages para essas rotas e garantir leitura pelos crawlers.
- Limpar busca: botão de estado vazio passa a disparar a ação de limpeza de filtros em vez de ser um link passivo para #/buscar.
- Termos de uso reposicionados no fim do formulário de cadastro, respeitando a convenção de mercado.

## 24/11/2026 · Mercado Corporativo e Blindagem Fiscal
- O Seu Chef em Casa atua estritamente como vitrine de divulgação e ponte de contato entre clientes e chefs.
- A plataforma não tem relação jurídica com a emissão de Notas Fiscais dos serviços gastronômicos contratados.
- Cada chef cadastrado (PJ / MEI) é o único responsável legal pela prestação do serviço e pela emissão da Nota Fiscal diretamente à empresa ou cliente contratante.
- Inclusão dos filtros e sinalizações "Corporativo & Empresas" e "Emite Nota Fiscal (PJ)".

## 24/11/2026 · Perfil do Chef Estilo Instagram com Bio Recolhível
- Previa dos chefs e perfil individual redesenhados com referências ao Instagram (anel de avatar, badges PJ, alinhamento limpo, botões de ação horizontais).
- Textos de apresentação (bio) extensos são limitados com "ver mais" / "ver menos" para evitar poluição visual e páginas excessivamente compridas.
