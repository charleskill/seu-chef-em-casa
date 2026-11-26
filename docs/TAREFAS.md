# Tarefas
## Revisão — 23/11/2026: identidade mesa, PR 17
- Continuação de d48e759: título com largura equilibrada, foto da abertura sem cortar o rosto no celular, formulário responsivo, foco/hover coerentes e ajustes de leitura e recorte dos serviços. Foto principal com carregamento prioritário.
- Prévia original da Cloudflare abriu. Revisão desktop/820/390/320px e fluxos de busca (cidade, data, pessoas), quatro experiências e catálogo com 55 cartões. Check, 63 testes, build e diff --check passaram. Detalhes em REVISAO-IDENTIDADE-MESA.md.
- Mantidos conteúdo e fluxos. Nenhuma alteração em backend/banco ou no branch visual-fotos-fontes-efeitos. Somente prévia no PR; produção aguarda OK explícito de Carlos.

## Entrega — 15/11/2026: perfis para apresentação aos sócios
- Três personagens completos, cada um com 25 pratos e nove fotos (pratos, eventos e preparo), além de retrato gerado por IA. Conteúdo e inclusão manual/idempotente em scripts/perfis-apresentacao.cjs; arquivos em assets/apresentacao e fontes/prompts em docs.
- Caminho local de fotos reconhecido no app e na página compartilhável /c/. Edição administrativa preserva apenas os arquivos estáticos previamente pertencentes ao perfil, sem aceitar fotos estáticas de outro personagem. Nenhuma mudança de autenticação, autorização ou credencial de conta existente.
- Validação local: check, sintaxe do gerador e /c/, 61 testes e build. Testes cobrem 3/9/25, número de teste, arquivos presentes, rejeição de caminhos inválidos e preservação/rejeição de fotos na edição. SQLite local e navegador: três perfis na busca, nove fotos e cardápio completo, desktop e celular. Inserção em produção é uma etapa manual após publicar as imagens.

## Entrega — 15/11/2026: prévia de Serviços na página inicial
- Antes de Cozinha com identidade, nova seção Serviços para cada ocasião com quatro experiências: jantar a dois, churrasco, noite japonesa e brunch. Fotos locais existentes em destaque e descrições do catálogo, sem duplicar dados de serviços.
- Ver todos os serviços abre o catálogo completo; cartões reutilizam a seleção de experiência e levam à busca correspondente. Grade de quatro colunas no desktop e duas nas telas menores, com respeito a movimento reduzido.
- Verificação: npm run check, npm test (59), npm run build e revisão visual desktop/celular. Quatro fotos carregadas, sem transbordamento no celular; link abre 55 serviços e cartão japonês abre a busca com a experiência selecionada.

## Entrega — 15/11/2026: 55 serviços com fotografias
- Mais vinte experiências: paella, peruana/ceviches, tailandesa, coreana, nhoque, crepes, queijos, sopas, pães, saladas, peixes, carnes nobres, costela, moqueca, café colonial, piquenique, finger food, grega, lámen e poke. Mesma integração com atendimento do chef, busca e tipo de pedido; começam desligadas nos perfis.
- Todos os 55 cartões têm foto: substituídos os ícones das quarenta experiências adicionadas nas duas entregas. Imagens selecionadas do Unsplash e Pexels, conferidas em folhas de contato; substituídas opções com recorte ruim. Fontes e licenças em FOTOS-SERVICOS.json.
- Hospedagem local em assets/servicos: 55 WebPs de 640 × 640, aproximadamente 3,55 MB no conjunto, carregamento sob demanda. Sem dependência de CDN externo para as fotos dos cartões. assets/service-photos.js associa serviço e arquivo; build inclui o mapa na cópia de revisão.
- Verificação: check, checagem sintática do novo mapa, 59 testes e build. Teste de integridade cobre todos os serviços, chaves únicas e arquivos WebP presentes. No navegador local: 55 cartões, 55 fotos carregadas com largura natural 640, zero quebradas; revisão desktop e celular sem transbordamento horizontal.

## Entrega — 15/11/2026: mais vinte experiências gastronômicas
- Catálogo passa de 15 para 35 serviços. Novas opções: brunch, café da manhã, massas, risotos, japonesa, italiana, francesa, mediterrânea, mexicana, árabe, indiana, nordestina, feijoada, vegetariana, vegana, degustação, harmonização, tapas, confeitaria e chá da tarde.
- Cadastro compartilhado em ChefCore.EXPERIENCIAS: gera serviços, opções de atendimento do chef e tipos de encontro no pedido. Novas capacidades começam desligadas; a busca considera a escolha do profissional, sem atribuir serviços a perfis reais automaticamente.
- Novos cartões usam ícones SVG gastronômicos em marfim e verde. Preservadas as fotos existentes, sem dependências ou novas imagens externas.
- Validação: npm run check, npm test (58), npm run build e revisão local do catálogo e clique Brunch → busca filtrada. Revisão responsiva em 390px. Sem alteração de dados em produção.

## Ajuste — 15/11/2026: harmonia das etapas
- A pedido de Carlos, removidos números soltos. Ícones em medalhões circulares com acabamento marfim e borda discreta, cor única e espaçamento alinhado aos títulos. Preservados os textos.
- Verificação: check, 57 testes e build; revisão visual desktop e celular.

## Entrega — 15/11/2026: ícones nas etapas de Como funciona
- Ícones vetoriais de busca, cloche e conversa, reutilizando o conjunto existente. Bases suaves em areia, verde e terracota; números e textos preservados. Ícones decorativos ocultos dos leitores de tela.
- Mudança focada em assets/app.js e assets/improvements.css; sem imagens externas ou dependências. Verificação: check, testes e build, além de revisão visual responsiva.

## Entrega — 15/11/2026: dashboard e navegação administrativa
- Branch codex/dashboard-administrativo, baseada na main 4140142. Menu contextual, cabeçalho próprio, seções, ações de conta agrupadas e estilos responsivos em assets/admin.css.
- Dashboard com períodos rápidos e personalizado, indicadores e comparação anterior, evolução diária, situações, modalidades, ranking, vitrine atual, tabela diária e estados vazio/erro. API somente de leitura, protegida por sessão e autorização da equipe.
- Salvar PDF usa impressão do navegador com stylesheet A4 horizontal e metodologia. O navegador integrado não mostrou uma prévia; a gravação do PDF no Chrome não foi concluída durante uso simultâneo pelo usuário. Não foi validado um arquivo PDF final.
- npm run check, npm test (57 testes) e npm run build passaram. Testes cobrem autorização, agregações, meia-noite de Brasília, períodos inválidos, comparação e zeros; sem dados pessoais de clientes na resposta.
- Revisão no navegador com SQLite e dados fictícios locais: desktop e 390px, filtros e período vazio, navegação, chefs, menu de conta e editor de conteúdo. Sem erros de console. Nenhum dado fictício enviado à produção.

## Concluído
- [x] Carlos criou repositório privado.
- [x] Preservar protótipo original como index.html.
- [x] Registrar diagnóstico inicial e regras de colaboração.

## Próximas tarefas, em ordem
- [ ] Executar protótipo e testar navegação, formulário e comportamento móvel.
- [ ] Definir infraestrutura de banco, autenticação, fotos e hospedagem.
- [ ] Criar modelo de dados e regras de acesso: cada chef altera apenas seus dados.
- [ ] Substituir login local e recuperação sem verificação.
- [ ] Migrar perfis, cardápios e fotos para dados compartilhados.
- [ ] Registrar pedido antes de abrir WhatsApp; tratar erros sem indicar entrega confirmada.
- [ ] Retirar recursos sociais locais do fluxo público do piloto.
- [ ] Validar dados e imagens com chefs participantes.
- [ ] Testar em duas sessões independentes: cadastro, busca e orçamento.
- [ ] Verificar que um chef não edita os dados de outro.
- [ ] Publicar piloto e verificar o fluxo no endereço publicado.

## Como trabalhar
Antes de começar, registrar responsável, tarefa e versão de origem.
Uma IA implementa por tarefa; outra pode revisar.
Ao concluir, registrar arquivos alterados, testes reais e limitações.
Não marcar testes como realizados sem execução.


## Trabalho em andamento — 29/10/2026
Responsável técnico: ChatGPT, a pedido de Carlos.
Origem: main, commit 8922addac6322d2ec916dbec577ab681f505bd1a.
Escopo: revisão do piloto, navegação, fotos, orçamento, persistência local e validações.
Entrega em branch de revisão; sem migração de infraestrutura ou lançamento público.

## Entrega em revisão — 29/10/2026
- [x] Reorganizar navegação e busca; corrigir destinos arbitrários de orçamento/mensagens.
- [x] Abrir fotos em modal com legenda, navegação e fechamento por teclado.
- [x] Exibir conversas locais à esquerda no desktop e separar lista/conversa no celular.
- [x] Redesenhar telas, cardápio, formulário e resumo de orçamento.
- [x] Corrigir salvamento conjunto do perfil, validação de preço e edição de pratos.
- [x] Retirar recuperação insegura por dados públicos; preservar compatibilidade das senhas locais.
- [x] Preservar dados legados e tratar erros de armazenamento sem sobrescrever o registro anterior.
- [x] Executar 15 testes Node, checagem sintática e build estático.
- [x] Conferir fluxos no navegador desktop e em iframe com larguras de 320 e 390 px.
- [ ] Conectar autenticação real, banco, armazenamento de imagens e recuperação de senha verificada.
- [ ] Aplicar e testar a migração SQL e as políticas de acesso com usuários independentes.
- [ ] Validar identidade, fotos, contatos e condições dos chefs reais antes do piloto.
- [ ] Validar dispositivos reais e fluxo final de envio no WhatsApp.

Detalhes de escopo, testes efetivos e limitações: REVISAO-2026-10-29.md. A migração SQL da revisão anterior foi preservada sem aplicação; nenhum lançamento foi feito.


## Entrega em revisão — 30/10/2026
Origem: main (34f25cb). O `index.html` de main havia sido substituído por uma versão de arquivo único que ignora `assets/`; esta branch restaura o `index.html` de a0002ed e aplica melhorias por camada, sem alterar `app.js`, `app-core.js`, `order-validation.js`, `demo-data.js` nem `styles.css`.
- [x] `assets/improvements.js`: aviso do erro de validação do pedido, estimativa por número de adultos no resumo (com o mesmo aviso de não ser preço final), máscara de telefone, botão de compartilhar perfil.
- [x] `assets/improvements.css`: contraste do texto secundário, alvos de toque maiores, estados de foco/hover, estilo de impressão.
- [x] `assets/demo-fixes.js`: correções de texto nos perfis de exemplo (“especializado(a)”, “Húmido”, “File Mignon”) e prato principal repetido do perfil c21.
- [x] `index.html`: metas `og:`, preconnect ao Unsplash e carregamento dos arquivos novos; `scripts/build.cjs` e `npm run check` incluem os arquivos novos.
- Verificado de fato: `npm run check`, `npm test` (15 de 15) e `npm run build`; fluxo básico do HTML gerado em navegador simulado (jsdom): início, perfil, cardápio, pedido, validação, busca, entrar; sem erros de JavaScript.
- Não verificado: navegador e dispositivo reais, WhatsApp, compartilhamento nativo do celular. Nenhuma publicação nem alteração de dados ou de SQL.


## Entrega em revisão — 30/10/2026 (perfis de teste e marmitas)
Origem: main (607ef19). Pedido de Carlos: 50 perfis de teste removíveis, pratos de SC, Brasil e internacional, e opção de marmitas no orçamento. Detalhes em PERFIS-DE-TESTE.md.
- [x] 50 chefs fictícios (`demo-01` a `demo-50`) com 8 a 12 pratos, galeria de 5 imagens, especialidade e cidades de SC; 18 deles oferecem marmitas.
- [x] Catálogo de 238 pratos (42 de SC, 49 do Brasil, 147 internacionais), 79 marcados como adequados a marmita.
- [x] Perfis de teste vêm do código e não são gravados no navegador; chave `enabled` esconde todos. Corrige o caso de chefs já salvos no navegador ocultarem os de exemplo.
- [x] Orçamento com "Plano de marmitas": frequência semanal, quinzenal ou mensal; marmitas por entrega; duração (1, 2, 3 ou 6 meses); entrega ou preparo na casa do cliente; dias preferidos; pratos de interesse. Estimativa por mês e do plano, com 4 semanas por mês e aviso de que não é preço final.
- [x] Painel do chef: aba "Marmitas" (preço de referência, mínimo por entrega, frequências, formas de atendimento) e marcação "Disponível como marmita" por prato.
- [x] Busca: filtro "Faz marmitas" e busca por especialidade; perfil e cartões mostram marmitas e especialidade.
- Verificado de fato: `npm run check`, `npm test` (27 de 27), `npm run build`; fluxo completo do HTML gerado em navegador simulado (busca, perfil, plano de marmitas, validações, painel do chef, esconder perfis, navegador com chefs já salvos); telas conferidas no Chromium em 390 e 1280 px, sem erros de JavaScript do app.
- Não verificado: dispositivos reais, WhatsApp, fotos do Unsplash (sem acesso à internet no ambiente de teste; a primeira imagem de cada galeria é ilustração local para a capa nunca falhar).
- Pendente de Carlos: validar com chefs reais o modelo de marmitas (campos, 4 semanas por mês, ausência de desconto por prazo) e o texto do pedido; o modelo é proposta, não decisão.


## Entrega — 07/11/2026 (banco compartilhado e login real)
Origem: main (7d2b3c2). Pedido de Carlos: deixar o app real para os dois chefs, na mesma base Cloudflare da plataforma de restaurantes.
- [x] `migrations/0001_piloto.sql`: banco D1 com chefs, sessões, fotos, pedidos e limites de tentativa.
- [x] `functions/api/[[rota]].js`: API em Cloudflare Pages Functions. Cadastro só com código de convite, login com sessão em cookie seguro (30 dias), senha PBKDF2, perfil limpo no servidor (só campos conhecidos), fotos JPEG guardadas no banco, pedidos registrados, limite de tentativas.
- [x] `assets/cloud.js` e ganchos em `app.js`: se `/api` responder, o app usa o banco; se não (GitHub Pages), continua na demonstração local. Pedido é registrado antes de abrir o WhatsApp.
- [x] Chefs reais aparecem antes dos perfis de exemplo; textos de "neste navegador" mudam quando há conta.
- Verificado de fato: `npm run check`, `npm test` (37 de 37), `npm run build`; 21 testes da API rodando localmente com `wrangler pages dev` e D1 local (convite, e-mail repetido, isolamento entre dois chefs, foto de outro chef bloqueada, lista pública sem e-mail, senha errada, sessão em dois aparelhos, sair, limite de tentativas, pedido visível só para o chef dono); teste de ponta a ponta no Chromium em 390 px com três aparelhos (cadastro, bio, foto, busca e perfil em outro aparelho, login em outro aparelho, sessão após recarregar), sem erros de JavaScript.
- Não verificado: Cloudflare real (conta ainda não criada), dispositivos reais, WhatsApp.
- [ ] Carlos: seguir `docs/ATIVAR-CLOUDFLARE.md` e enviar o código de convite aos dois chefs.
- [ ] Tela de pedidos recebidos no painel do chef e troca de senha por e-mail.


## Entrega — 08/11/2026 (número de teste nos perfis fictícios)
Origem: main (a41b42c). Pedido de Carlos: usar (48) 99110-6355 em todo dado fictício.
- [x] `scripts/gerar-demo.cjs` com `TELEFONE_TESTE`; `assets/demo-data.js` regenerado (só WhatsApp e telefone mudaram nos 50 perfis).
- [x] `assets/app.js`: perfis de exemplo com número válido mostram "Abrir WhatsApp"; avisos ajustados.
- [x] Testes automáticos usam o número de teste.
- Verificado de fato: `npm run check`, `npm test` (37 de 37), `npm run build`.

## Testes completos — 08/11/2026 (chef e cliente)
Pedido de Carlos: criar um perfil de chef e um de cliente e testar tudo, sempre com o número (48) 99110-6355.
Ambiente: modo real com `wrangler pages dev` + D1 local (convite `teste-local`) e modo demonstração com `dist/` estático; Chrome em 390 px. Contas de teste só locais, apagadas ao final.
- Chef (Chef Teste Carlos, WhatsApp e telefone de teste): cadastro com convite, perfil e bio, 5 pratos (2 para marmita), marmitas (R$ 30, mínimo 5, semanal/quinzenal, entrega/casa), sugestão de kit, atendimento (garçom e grupos grandes desligados), agenda (20 e 21/11 ocupados), foto do prato e foto de perfil. Tudo gravado no banco e conferido pela API.
- Cliente: busca por cidade/data/pessoas (some na data ocupada e com 25 pessoas), busca por nome, perfil (cardápio, bio, sem e-mail), "Conversar no WhatsApp", pedido de evento com validações (vazio, telefone inválido, data ocupada), resumo e WhatsApp no número de teste, plano de marmitas com kit (estimativa R$ 360/mês, R$ 720 em 2 meses), pedido a perfil de exemplo, rascunho de conversa.
- Chef depois: 5 pedidos registrados em `/api/meus-pedidos`; senha errada recusada; login em outro aparelho com os mesmos dados; sessão mantida ao recarregar; sair; convite errado recusado; lista pública sem e-mail.
- Demonstração: conta local, perfis de exemplo, pedido a perfil de exemplo abre o WhatsApp de teste, aba Marmitas, termos.
- Resultado: tudo passou, sem erros de JavaScript do app.
- Problemas encontrados (corrigidos na entrega seguinte):
  - [x] Modo real: o botão de cadastro ainda diz "Criar conta local" e o rodapé diz "Esta versão ainda não é um serviço de acesso seguro" (textos da demonstração).
  - [x] O painel não tem campo de especialidade; chef real aparece como "Personal chef" e não é achado na busca por especialidade.
  - [x] Painel sem tela de pedidos recebidos (já pendente; a API funciona).
  - [x] Demonstração: a conta local do chef aparece em último na busca (51º), escondida atrás de "ver mais".
- Não verificado: Cloudflare real, celular real, WhatsApp de verdade (o ambiente de teste não acessa wa.me; foi conferido o endereço aberto, wa.me/5548991106355).

## Entrega — 08/11/2026 (correções dos testes)
- [x] Modo real: botão "Criar conta" e aviso de acesso protegido; o atalho e o aviso da demonstração só aparecem na demonstração.
- [x] Painel > Perfil: campo "Especialidade" (já aceito pela API). Aparece no cartão e entra na busca.
- [x] Busca: chefs reais e contas locais vêm antes dos perfis de exemplo.
- [x] Painel > Pedidos: lista os pedidos (no modo real, de `/api/meus-pedidos`; na demonstração, os feitos neste navegador), com nome, telefone, data, texto completo, "Responder no WhatsApp" (abre o número do cliente) e "Copiar pedido". Aviso de que o registro não garante envio pelo WhatsApp.
- [x] Abas do painel em duas linhas (a aba Pedidos ficava escondida no celular).
- Verificado de fato: `npm run check`, `npm test` (37 de 37), `npm run build`; repetição completa dos testes de chef e cliente (modo real com D1 local e demonstração), 40 verificações aprovadas; telas do painel conferidas em 390 e 1280 px.
- Não feito: troca de senha por e-mail (precisa de um serviço de envio de e-mail e de um domínio; decisão de Carlos) e e-mail de contato nos termos.

## Entrega — 08/11/2026 (sugestões de endereço)
- [x] `assets/endereco.js`: sugestões ao digitar (Photon/OpenStreetMap) no endereço do pedido, no "Onde?" da página inicial e nas cidades do chef; teclado (setas, Enter, Esc), toque e crédito do OpenStreetMap.
- [x] `tests/endereco.test.cjs`: formato das sugestões (rua com número digitado, cidade, filtro do Brasil).
- Verificado de fato: `npm run check`, `npm test` (40 de 40), `npm run build`; fluxo no Chrome em 390 px com respostas simuladas (escolha por teclado e por toque, link do Maps atualizado, rascunho mantido ao recarregar); respostas reais do Photon conferidas no navegador do app.
- [x] Build marca os arquivos com a versão do conteúdo (`?v=hash`) no `dist/index.html`, para o navegador não misturar arquivos antigos e novos depois de uma atualização (aconteceu no teste).
- [x] O GitHub Pages está publicando direto da branch `main` (raiz do repositório), não da pasta `dist/` do workflow: por isso `docs/` e `migrations/` aparecem no site. O build agora marca a versão também no `index.html` da raiz (rode `npm run build` antes de cada commit).
- [ ] Carlos: em Settings → Pages → Source, escolher **GitHub Actions** para publicar só `dist/`.

## Entrega — 08/11/2026 (fotos reais nas capas dos perfis de exemplo)
Pedido de Carlos: melhorar as imagens dos cartões (ilustrações de emoji).
- [x] `scripts/demo/fotos.json`: 75 fotos reais de comida do Unsplash, 3 por especialidade, escolhidas e conferidas no navegador (todas carregam).
- [x] Galeria dos 50 perfis de exemplo: as 3 fotos da especialidade primeiro (a capa alterna entre chefs da mesma especialidade), depois as fotos que já existiam. As ilustrações viraram reserva: se a foto não carregar, o app mostra a ilustração do prato.
- Verificado de fato: `npm run check`, `npm test` (41 de 41), `npm run build`; reserva testada no Chrome sem internet (cartões mostram as ilustrações, sem erros); fotos conferidas no site publicado.

## Entrega — 08/11/2026 (página inicial e celular)
- [x] Página inicial: "Como funciona" vem antes de "Conheça os chefs" (pedido de Carlos).
- [x] Busca da página inicial no celular: "Onde?" na largura toda, data e pessoas lado a lado, botão largo (antes os campos ficavam estreitos).
- Observação: a captura de Carlos no celular mostrava o layout de computador (3 colunas), sinal de que o navegador estava em "versão para computador"; o site já tem a marcação de celular (viewport).
- Verificado de fato: `npm test` (41 de 41), `npm run build`; telas conferidas no Chrome em 412 px.
- [x] `assets/tela.js`: quando um celular abre o site em "site para computador" (página desenhada com ~980 px e encolhida, menu e textos minúsculos), o site detecta (toque + tela estreita + página larga), liga as regras de CSS de celular e amplia a página para a largura real. Testado no Chrome simulando esse modo (980 px de página, tela de 412 px): resultado igual ao celular normal; computador sem mudança.
- [x] Textos maiores no celular: cartões dos chefs (nome 15 px, cidade e rodapé 13 px), aviso de demonstração, menu inferior, textos de ajuda.

## Entrega — 08/11/2026 (busca mais simples)
Pedido de Carlos: botão de buscar e não precisar preencher tudo para só olhar.
- [x] Tela Buscar: campo único com botão "Buscar" (fecha o teclado e leva aos resultados), cidade, e "Mais filtros (opcional)" fechado por padrão com data ("vazio = qualquer data"), pessoas e os filtros rápidos; abre sozinho e mostra "ativos" quando algum filtro está ligado; "Limpar filtros" fecha.
- [x] A busca também procura na bio e na descrição dos pratos (ex.: "sushi" encontra a chef de cozinha japonesa).
- Verificado de fato: `npm test` (41 de 41), `npm run build`; fluxo no Chrome em 412 e 1280 px (buscar, abrir filtros, marmitas, limpar).

## Entrega — 08/11/2026 (login com Google)
- [x] API: `/api/google/iniciar` e `/api/google/retorno`; `/api/saude` informa se o Google está ativo; `migrations/0002_google.sql`.
- [x] App: "Entrar com Google" e "Criar conta com Google" (tela de criar conta reorganizada: nome, WhatsApp, cidades, convite e termos primeiro; e-mail e senha como alternativa); avisos ao voltar do Google (cancelado, expirado, sem conta…).
- [x] Passo a passo em `docs/ATIVAR-CLOUDFLARE.md` (seção 6).
- Verificado de fato: `npm run check`, `npm test` (41 de 41), `npm run build`; ponta a ponta com `wrangler pages dev`, D1 local e um servidor falso do Google: convite errado barrado antes do Google, cadastro com Google (nome do Google, WhatsApp e cidade gravados), sair e entrar de novo, senha numa conta Google orienta a usar o Google, Google sem conta volta com aviso, Google com e-mail de conta existente entra nela sem duplicar, retorno com estado falso e com cancelamento recusados; testes anteriores de chef e cliente repetidos sem falhas.
- Não verificado: Google de verdade (precisa das credenciais e do endereço na Cloudflare).
- [ ] Carlos: criar a credencial no Google e colar as duas variáveis na Cloudflare (seção 6).

## Ativação na Cloudflare — 09/11/2026
- [x] Conta Cloudflare de Carlos (carlosmendes.ricci@gmail.com), criada e acessada por ele.
- [x] Banco D1 `chefemcasa` com as tabelas de `0001_piloto.sql` e `0002_google.sql` (conferidas no console: chefs, sessoes, fotos, pedidos, limites, oauth_pendente).
- [x] Projeto Pages `seu-chef-em-casa` ligado ao GitHub (branch main, `npm run build`, saída `dist`): https://seu-chef-em-casa.pages.dev
- [x] Binding `DB` → `chefemcasa`; variável secreta `CONVITE` (valor digitado por Carlos, guardado com ele).
- [x] No ar às 13:31 (a Cloudflare levou ~40 min para propagar as publicações da conta nova): `/api/saude` → `{"ok":true,"google":false}`.
- [ ] Login com Google: criar a credencial (seção 6) e adicionar `GOOGLE_CLIENT_ID` e `GOOGLE_CLIENT_SECRET`.


## Entrega — 09/11/2026 (versão real: Mensagens, perfis de exemplo, pausar e excluir conta)
Origem: main (f3f4d5e).
- [x] `assets/app.js`: aba Mensagens escondida (chave `MENSAGENS`); perfis de exemplo e aviso de demonstração fora da versão real, com mensagem quando ainda não há chefs; Painel > Perfil com Pausar/Reativar e Excluir conta (digitar EXCLUIR).
- [x] API: `PUT /api/eu` aceita `pausado` (usa a coluna `publicado`, sem migração); `DELETE /api/eu` apaga pedidos, fotos, sessões e o chef.
- [x] `assets/termos.js`: seções 8 e 9 dizem que perfis e pedidos ficam no servidor.
- Verificado de fato: `npm test` (41 de 41), `npm run build`; 15 verificações da API com `wrangler pages dev` e D1 local (pausar, some da lista, não recebe pedido, reativar, excluir, sem sessão recusado, só o chef excluído some, sem sobras no banco); telas no navegador com API simulada.
- Não verificado: Cloudflare real, celular real.
- [ ] E-mail de contato nos termos e revisão por advogado(a).

## Entrega — 09/11/2026 (leveza e proteções)
- [x] `assets/real.js`: a versão real não baixa os perfis de exemplo (cerca de 520 KB); a demonstração continua igual.
- [x] `_headers`: CSP e demais cabeçalhos de segurança, copiados para `dist/` no build.
- [x] Imagem de compartilhamento (`og:image`).
- [x] Pedido a chef pausado é barrado na revisão, antes de abrir o WhatsApp.
- Verificado de fato: `npm run check`, `npm test` (41 de 41), `npm run build`; `wrangler pages dev` com D1 local: rotas principais sem violação de CSP nem erros no console, chef pausado barrado.

## Entrega — 09/11/2026 (cidades com etiquetas e jornada completa)
- [x] "Cidades onde atende": várias cidades como etiquetas removíveis (`assets/endereco.js`); segue salvo como "A, B, C".
- Simulação completa pelas telas (`wrangler pages dev`, D1 local, número de teste): chef (convite errado, termos, cadastro, perfil, 3 pratos, marmitas, atendimento, agenda, foto, sair) e cliente em aparelho limpo (busca por prato, cidade e data ocupada, perfil, validações, pedido de evento, plano de marmitas, WhatsApp); chef de volta (senha errada, entrar, pedidos, responder, pausar, reativar, excluir). Sem erros de JavaScript.
- Não verificado: Cloudflare real com conta de chef, celular físico, WhatsApp de verdade (a abertura foi conferida pelo endereço wa.me).

## Entrega — 09/11/2026 (depois do pedido)
- [x] Ao abrir o WhatsApp, o cliente vê os próximos passos, com opções de reabrir o WhatsApp (sem registrar outro pedido) e copiar o pedido. O texto deixa claro que o pedido só chega depois de enviado.


## Entrega — 09/11/2026 (perfil pronto)
- [x] Chef sem foto, prato ou cidade não aparece aos clientes nem recebe pedidos; o painel mostra o que falta, com atalhos.
- Verificado de fato: npm test (42 de 42); API com D1 local (6 verificações); aviso do painel no navegador.


## Entrega — 09/11/2026 (situação dos pedidos)
- [x] Painel > Pedidos: cada pedido pode ser marcado como Novo, Respondido ou Fechado. Fica no JSON `dados` do pedido, sem migração do banco (`PATCH /api/meus-pedidos/:id`).
- Verificado de fato: npm test (42 de 42); API com D1 local (7 verificações, inclusive outro chef sem acesso); troca e persistência no navegador.
## Entrega — 09/11/2026 (cadastro sem convite)
- [x] API: convite só exigido se `CONVITE` existir; `/api/saude` informa `convite`.
- [x] App: sem campo e sem textos de convite quando não exigido; mensagens do Google ajustadas.
- Verificado de fato: `npm run check`, `npm test`, `npm run build`; local com `wrangler pages dev` sem `CONVITE` e Google falso: tela de criar conta sem convite, cadastro com Google e com e-mail sem convite, "Entrar com Google" sem conta orienta a criar.
- [ ] Apagar a variável `CONVITE` na Cloudflare; criar a credencial do Google e adicionar `GOOGLE_CLIENT_ID`/`GOOGLE_CLIENT_SECRET`.

## Entrega — 09/11/2026 (área da equipe, link do chef, aviso por e-mail)
- [x] **Área da equipe** (`/#/admin`, botão "Equipe" no painel): só para e-mails em `ADMIN_EMAILS`. Números (chefs, visíveis, pedidos em 7 dias e no total), filtros, situação de cada chef (visível, incompleto e o que falta, pausado, escondido), e-mail, data de cadastro, pratos, fotos, pedidos, links para o perfil e o WhatsApp, e **Esconder / Mostrar de novo** (toque duplo para esconder). Perfil escondido some da busca, do link e não recebe pedidos; o chef vê o aviso e não consegue desfazer. API: `GET /api/admin/chefs`, `POST /api/admin/chefs/:id`. Coluna `oculto` criada automaticamente (`migrations/0003_admin.sql`).
- [x] **Link do chef para compartilhar**: `/c/<id>` mostra prévia com foto, nome, especialidade e cidades (WhatsApp, Instagram, Facebook) e abre o perfil. Botão **Compartilhar meu perfil** no painel (compartilhamento do celular ou copia o link); só funciona com o perfil visível.
- [x] **Aviso de pedido por e-mail** ao chef (assunto com cliente e data, texto do pedido, link do painel), via Cloudflare Email Service; liga com `EMAIL_REMETENTE`, `CF_ACCOUNT_ID`, `CF_EMAIL_TOKEN`. Sem elas, não envia.
- Verificado de fato: `npm run check`, `npm test` (43), `npm run build`; local com `wrangler pages dev`, D1 sem a coluna nova (criada no primeiro acesso), Google falso e servidor de e-mail falso — 25 verificações aprovadas (permissões da área da equipe, prévia do link, e-mail com remetente/destinatário/assunto, esconder e mostrar, chef escondido sem pedidos e sem conseguir se mostrar); cadastro sem convite repetido; demonstração estática sem erros.
- Não verificado: envio real de e-mail (precisa de domínio) e a prévia no WhatsApp de verdade (só depois de publicado).
- [ ] Carlos: `ADMIN_EMAILS` na Cloudflare (seção 7). E-mail: depois do domínio (seção 8).

- [x] 09/11: Instagram oficial criado por Carlos, @seuchefemcasaoficial; link no rodapé da página inicial. TikTok: pendente.

## Brandbook (2026-11-09)
- Feito: brandbook completo como Design System no Claude: https://claude.ai/artifact/ShKjAJDJEbNxmTVA9djrCt (privado; o Carlos decide se compartilha).
- Conteúdo: essência, públicos, voz e tom, logo (3 SVGs), cores (16 tokens), tipografia, fotografia, iconografia, redes sociais, aplicações, componentes (botão, etiqueta, cartão de chef, aviso, post do Instagram) e capa.
- Verificado: as prévias dos componentes e dos logos foram renderizadas e conferidas visualmente antes de publicar.
- Pendente do Carlos: aprovar propósito, missão e valores (marcados como [proposta]); decidir sobre o cinza #737c72, que tem contraste 3,97:1 no creme (abaixo de 4,5:1) para texto pequeno.

## Entrega — 09/11/2026 (domínio ligado e documento geral)
- [x] Domínio `seuchefemcasa.com.br` e `www` ligados ao projeto Pages (Custom domains). Verificado de fato: os dois endereços respondem 200 por HTTPS; `/api/saude` no domínio → `{"ok":true,"google":false,"convite":true}`.
- [x] `docs/VISAO-GERAL.md`: documento geral do projeto; `CONTEXTO.md` atualizado com o domínio.
- Não verificado: abertura em celular físico. Só documentação mudou; `npm run check`, `npm test` e `npm run build` não foram executados (máquina sem Node).
- [x] Variável `CONVITE` apagada na Cloudflare (Settings → Variables and secrets), a pedido; conferido no painel que a lista de variáveis ficou vazia.


## Entrega — 09/11/2026 (bloco "Como este chef atende" compacto)
- [x] Perfil do chef: o bloco virou uma linha que abre ao toque ("Como este chef atende · N opções"), fechado por padrão; etiquetas menores quando aberto. O aviso de que o chef não atende crianças continua sempre visível. Arquivos: `assets/app.js` (`opcoesInfo`) e `assets/improvements.css`.
- Não verificado antes de publicar: `npm run check`, `npm test` e `npm run build` (máquina sem Node); versões do `index.html` da raiz carimbadas à mão com o mesmo cálculo do build.


## Entrega — 10/11/2026 (catálogo de pratos clássicos, lado do chef)
Branch `catalogo-pratos`, prévia em https://catalogo-pratos.seu-chef-em-casa.pages.dev (sem banco; roda como demonstração).
- [x] `assets/pratos.js`: catálogo de 1.556 nomes de pratos clássicos (Entradas 339, Pratos Principais 483, Massas 154, Frutos do mar 217, Sobremesas 258, Bebidas & drinks 105), com categoria e cozinha, e busca que ignora acentos.
- [x] Painel > Cardápio: ao digitar no "Nome do prato" aparecem até 8 sugestões; escolher (toque, ou setas e Enter) preenche o nome e a categoria e leva à descrição. O chef pode ignorar e escrever o próprio nome. Descrição e preço continuam por conta do chef.
- [x] `tests/pratos.test.cjs`, `npm run check`, `scripts/build.cjs` e `index.html` incluem o arquivo novo.
- Verificado de fato, no navegador, na prévia: as mesmas verificações de `tests/pratos.test.cjs` rodadas no console (a ordem das categorias falhou na primeira vez e foi corrigida); sugestão ao digitar "tirami" e "moqueca", escolha por teclado e por toque, categoria trocada sozinha, formulário não enviado pelo Enter, sem erros de JavaScript do app.
- Não verificado: `npm run check`, `npm test` e `npm run build` na máquina (sem Node; o build da Cloudflare passou na prévia); celular físico; versão real com banco; salvar um prato escolhido da lista.
- Fora desta entrega: descrições prontas dos pratos e o campo para o cliente pedir um prato fora do cardápio.


## Entrega — 10/11/2026 (site fechado com senha)
- [x] `functions/_middleware.js`: com `SENHA_SITE` definida, páginas, arquivos e `/api` respondem 401 com uma tela de senha; a senha certa grava um cookie seguro de 30 dias e volta para a página pedida. Sem a variável, nada muda.
- [x] Passo a passo em `docs/ATIVAR-CLOUDFLARE.md`, seção 9.
- [x] Variável `SENHA_SITE` criada na Cloudflare (tipo Secret, valor digitado pela usuária) em 10/11; site publicado de novo para a senha valer.
- Verificado de fato em 10/11, no site publicado: `seuchefemcasa.com.br`, `www` e `pages.dev` respondem 401 com a tela de senha; `/api`, arquivos e `/c/<id>` fechados; senha errada e cookie falso recusados; destino externo no campo `para` trocado por `/`. Entrada com a senha certa confirmada pela usuária no próprio aparelho.
- Não coberto: a demonstração do GitHub Pages continua aberta.
- [x] 10/11: tela de senha reescrita em tom de suspense de cozinha, a pedido ("Grandes coisas estão para acontecer.", fundo escuro, botão "Abrir a porta da cozinha"). Só texto e estilo; a lógica não mudou.
- [x] 10/11: tela de senha com um livro de receitas antigo que se abre sozinho e mostra o campo da senha (só HTML e CSS, sem JavaScript nem imagens). Depois de uma senha errada, e para quem tem "reduzir movimento" ligado no aparelho, o livro já aparece aberto. Verificado no site publicado, em largura de celular: capa fechada, livro aberto com o formulário, sem rolagem lateral. Não verificado: a animação em movimento (o navegador de teste tem "reduzir movimento" ligado) e os quadros intermediários.
- [x] 10/11: livro da tela de senha refeito, porque a primeira versão não parecia um livro: aparece fechado (lombada com nervuras, moldura dourada, bloco de folhas, fita marcadora), a capa abre, duas folhas viram e a tela se aproxima da página da senha (4,8 s no total). `/acesso?previa` mostra a tela mesmo para quem já entrou. Verificado na prévia do branch `livro-senha`, em largura de celular, com a animação pausada em 0 s, 1,6 s, 2,75 s, 3,5 s e 4,8 s, sem rolagem lateral. Não verificado: a animação correndo em tempo real (o navegador de teste tem "reduzir movimento" ligado) e celular físico.
- [x] 10/11: a pedido, a tela de senha voltou a um modelo simples e sóbrio (o livro animado foi considerado infantil para a marca): fundo escuro, título em serifa, fio dourado, campo só com a linha de baixo, botão "Entrar" em contorno e aparecimento suave do conteúdo. O livro continua no histórico (commit 4357e2a).


## Entrega — 10/11/2026 (vitrine do chef)
Branch `vitrine-chef`, prévia em https://vitrine-chef.seu-chef-em-casa.pages.dev/c/exemplo
- [x] `functions/c/[id].js`: o link de compartilhamento `/c/<id>` deixou de só redirecionar e virou uma página de apresentação com cara de site próprio do chef: capa com foto, nome, especialidade e cidades; sobre; até 8 pratos do cardápio com preço de referência; até 6 fotos; como trabalha e experiências; como funciona; chamada final. Botões "Montar meu orçamento" (abre o pedido no app) e "Conversar no WhatsApp"; barra fixa no celular. Montada no servidor, sem JavaScript; mantém a prévia para WhatsApp e redes.
- [x] Mesmas regras da busca: só perfil publicado, não escondido e pronto (foto, prato e cidade); senão, página "perfil não disponível" (404).
- [x] `/c/exemplo`: vitrine de um chef fictício (fotos ilustrativas do Unsplash, telefone de teste), para mostrar aos chefs e testar sem banco.
- Verificado de fato, na prévia, com `/c/exemplo`: página inteira em largura de celular (capa, sobre, cardápio, fotos, como trabalho, chamada final, barra fixa), 7 fotos carregadas, sem rolagem lateral nem erros no console; endereço de chef inexistente responde 404.
- Não verificado: perfil real vindo do banco (a prévia não tem banco); layout de computador (só o topo foi visto); prévia do link no WhatsApp; celular físico; `npm test` (máquina sem Node).
- Atenção: com o site fechado por senha, quem recebe o link também precisa da senha.


## Entrega — 10/11/2026 (verde mais escuro)
Branch `verde-escuro`, prévia em https://verde-escuro.seu-chef-em-casa.pages.dev
- [x] Verde da marca trocado em `assets/styles.css`, `assets/improvements.css`, `assets/app.js`, `index.html` (cor do tema e ícone da aba) e `functions/c/[id].js` (vitrine). Nenhuma ocorrência do verde antigo sobrou nesses arquivos.
- Verificado de fato, na prévia, em largura de celular: página inicial, Serviços e Buscar com o verde novo (logo, capa, botão Buscar, textos).
- Não verificado: painel do chef, pedido, termos, largura de computador, contraste medido, celular físico; `npm test` (máquina sem Node). Brandbook não atualizado.


## Entrega — 10/11/2026 (senha do site desligada)
- [x] A pedido, a senha de acesso do site foi desligada: `LIGADA = false` em `functions/_middleware.js`. A variável `SENHA_SITE` ficou na Cloudflare, sem efeito (pode ser apagada). Para fechar de novo: `LIGADA = true`.


## Entrega — 10/11/2026 (área da equipe: nova senha e excluir conta)
Branch `equipe-senha-excluir`, prévia em https://equipe-senha-excluir.seu-chef-em-casa.pages.dev
- [x] **Link de nova senha**: na área da equipe, o botão gera um link (`/#/nova-senha/<id>/<token>`) que vale 48 horas e uma vez só; a equipe copia ou envia pelo WhatsApp do chef. O chef abre, cria a senha e já entra; as sessões em outros aparelhos são encerradas. A equipe nunca vê nem escolhe a senha. API: `POST /api/admin/chefs/:id` com `acao: "nova-senha"` e `POST /api/nova-senha`. O pedido fica no JSON `credencial` do chef (só o hash do token), sem migração.
- [x] **Excluir conta**: botão na área da equipe, com segundo toque para confirmar; apaga perfil, fotos, pedidos e sessões. Não deixa excluir a própria conta por ali. API: `DELETE /api/admin/chefs/:id`.
- Verificado de fato, na prévia (sem banco): o app carrega sem erro de JavaScript do app, a rota `/#/nova-senha/...` e a área da equipe abrem, e as rotas novas da API respondem.
- NÃO verificado: nada que dependa do banco. Gerar o link, criar a senha, link vencido ou reusado, exclusão e permissões não foram executados (a prévia não tem banco, a máquina não tem Node nem wrangler). Precisa de teste com `wrangler pages dev` e D1 local, ou em produção com uma conta de teste.
- Depende de `ADMIN_EMAILS` na Cloudflare; sem ela, a área da equipe continua desligada.
- Publicado na `main` em 10/11. Verificado de fato no site principal: link com formato inválido e link com token errado para um chef existente são recusados ("Este link não vale mais"); as rotas da equipe sem sessão respondem "Entre com a conta da equipe"; o site e a lista de chefs seguem normais. Continua sem teste o caminho que dá certo (gerar link, criar senha, excluir), que depende de `ADMIN_EMAILS`.


## Ativação — 10/11/2026 (área da equipe ligada)
- [x] Variável `ADMIN_EMAILS` (tipo Text) criada na Cloudflare por Carlos, com dois e-mails: o dele e o da Fer. Conferido no painel que a variável aparece na lista.
- [x] Site publicado de novo para a variável valer.
- Não verificado: entrar com uma conta de administrador e ver o botão Equipe; gerar link de nova senha; excluir conta. Fazer primeiro numa conta de chef de teste.


## Entrega — 10/11/2026 (guia para outro assistente)
- [x] `docs/GUIA-OUTRO-ASSISTENTE.md`: como outro assistente (Jules, Gemini) entrega uma mudança simples por pull request, onde fica cada coisa, o que não tocar, como voltar uma versão e um texto pronto para iniciar a conversa. `AGENTS.md` e `CONTEXTO.md` apontam para ele.
- Carlos ligou o Jules à conta dele do GitHub em 10/11. Não verificado: o Jules ainda não fez nenhuma tarefa neste repositório.


## Ambiente — 10/11/2026 (Node e Git na máquina do Carlos)
- [x] Node 26.13.0 LTS instalado pelo winget (instalador oficial de nodejs.org). Git do projeto configurado com nome e e-mail do Carlos (só neste repositório).
- [x] Primeira execução local completa: `npm run check` sem erros, `npm test` com 45 de 45, `npm run build` concluído. Isso cobre, com atraso, as entregas de 09 e 10/11 que tinham sido publicadas sem esses testes (catálogo de pratos, bloco de atendimento, cores, área da equipe). Os testes automáticos não exercitam o servidor (`functions/`), que segue sem teste de ponta a ponta.
- [x] `index.html` recarimbado pelo build de verdade (os carimbos anteriores tinham sido calculados à mão).
- [x] Guia: seção 8, para quem trabalha na pasta local (Antigravity).
- Feito (2026-11-11): apresentação do brandbook em slides (26 slides): https://claude.ai/artifact/4nKGsM5nKvxq2Bk1oyxhgW (privada). Usa as cores e fontes do brandbook, o símbolo em vetor, um print do app no celular, o post-modelo e a foto de perfil. Não foi aberta para conferência visual depois de publicada.


## Entrega em revisão — 15/11/2026 (administração e configurações)
Responsável: Codex, a pedido de Carlos. Origem: main 4adda6d. Branch: codex/organizar-painel.
- [x] /admin redireciona à administração; entrada da equipe identificada; login por senha de administrador leva à área administrativa. Retorno administrativo com Google preparado, mas Google real não foi testado.
- [x] Conteúdo do site: título, apresentação, capa Unsplash e legenda, convite aos chefs, e-mail de contato, WhatsApp e redes. Prévia e confirmação de salvamento; esquema validado no servidor e verificação de versão para evitar substituir edição já salva por outra pessoa.
- [x] Gestão: busca de chefs por nome/e-mail/cidade; edição de perfil, pratos, foto do perfil, portfólio e legendas. Mantidos esconder, nova senha e excluir. A edição de conteúdo não altera credenciais ou permissões.
- [x] Configurações: acesso/e-mail, pausa, exclusão com confirmação EXCLUIR, saída e ajuda. Conta local também pode ser excluída; clientes sem conta têm limpeza dos dados locais com explicação dos limites.
- [x] Removida a aba Publicar, duplicada com Fotos; Pedidos passa a ser a abertura do painel. Filtro da vitrine não inclui o próprio chef incompleto, pausado ou escondido.
- [x] Login no domínio real não oferece conta local quando a API está indisponível. Salvamento de configurações da conta espera a confirmação do servidor antes de informar sucesso.
- [x] Guia de uso em docs/ADMINISTRACAO.md e aba Como usar no painel.
- Banco: nova tabela site_config, criada automaticamente; migração 0004 registra o esquema. Não aplicado em produção.
- Arquivos principais: assets/app.js, cloud.js, site-settings.js, management.js, improvements.css, termos.js; functions/admin.js e functions/api/[[rota]].js; index.html, build e checagem; teste de integração da API com SQLite real.
- Verificado no navegador, com contas fictícias e API local: /admin e entrada por senha, salvar texto e conferir na home, editar nome/prato/preço, enviar e salvar foto de perfil, atualização da lista; chef comum sem acesso administrativo; Configurações e modal de exclusão (cancelado); navegação de busca e Serviços; largura de 390 px sem rolagem horizontal no editor.
- Verificado automaticamente: npm run check, npm test (52/52) e npm run build. A suíte integra SQL real em Node 26; em Node 18/20, somente os novos testes SQLite são explicitamente pulados (requerem Node 22.13+).
- Não verificado: banco D1 da Cloudflare, Google real, dispositivo físico, envio de WhatsApp, exclusão pelo navegador e animações. A exclusão foi exercitada pela API exclusivamente em banco de teste. Nenhuma conta ou conteúdo real foi alterado.
- Ainda depende de revisão e merge do PR por Carlos. A prévia da branch não tem banco, portanto não testa administração real.


## Entrega — 15/11/2026 (acesso administrativo sem cabeçalho e menu)
- A pedido de Carlos, a tela de acesso restrito em /admin e o login #/entrar/admin mostram somente a área de acesso, centralizada. Cabeçalho e navegação pública ficam escondidos nessas telas, incluindo o menu inferior no celular.
- Ao entrar na administração ou navegar para outra página, o layout normal é restaurado. Nenhuma regra de autenticação foi alterada.
- Arquivos: assets/app.js, assets/improvements.css e index.html recarimbado pelo build.
- Verificações: npm run check, npm test (52/52), npm run build.


## Entrega — 15/11/2026 (aparência do cartão administrativo)
- Cartão de acesso com conteúdo centralizado, ícone discreto de cadeado, espaçamento entre título e apresentação, texto de apoio mais curto e botão verde de largura total. Ajuste responsivo para telas pequenas, preservando o acesso sem menu ou cabeçalho.
- Arquivos: assets/management.js, assets/improvements.css e index.html recarimbado. Sem alteração de autenticação.
- Validação: npm run check, npm test (52/52) e npm run build.


## Entrega — 15/11/2026 (mostrar ou ocultar senha)
- Campos de nova senha e confirmação, no cadastro e na redefinição, passam a ter botão de olho independente. O login mantém o mesmo recurso, usando o componente compartilhado.
- Todos começam ocultos; o botão alterna ícone, descrição acessível e aria-pressed, sem enviar o formulário. Área de toque de 44 px. Nenhuma alteração de senha ou autenticação no servidor.
- Arquivos: assets/app.js, assets/improvements.css e index.html recarimbado.
- Verificado: npm run check, npm test (52/52), npm run build; no navegador local, alternância independente dos dois campos e estado aria-pressed. Campos vazios, sem envio nem alteração de senha real.


## Entrega — 15/11/2026 (medição de visitas e contexto)
- _headers: a CSP passa a permitir o script e o envio do Web Analytics da Cloudflare, antes bloqueados (erro no console em toda página). CONTEXTO.md atualizado com o estado depois do Codex.
- Verificado: npm run check, npm test (61 de 61), npm run build; cabeçalho conferido no site publicado.


## Entrega — 20/11/2026 (administração só para o Carlos)
- Feita pelo Codex em 15/11 e publicada pelo Claude em 20/11, a pedido da Fer. /admin e as rotas /api/admin/* passam a aceitar só carlosmendes.ricci@gmail.com (ChefCore.isAdminEmail). ADMIN_EMAILS na Cloudflare deixa de ampliar o acesso. O link Administração do rodapé só aparece para esse administrador.
- Trocar o administrador exige mudar ADMIN_EMAIL em ssets/app-core.js e publicar.
- Verificado: npm run check, npm test (63 de 63, com 2 testes novos da regra), npm run build; no site, código novo servido e rotas administrativas recusando quem não está logado. Não testado: entrar como Carlos no /admin.

## 21/11/2026 — Visual: fotos, fonte e efeitos (ramo visual-fotos-fontes-efeitos)
- Fonte Rethink Sans no site todo, servida de assets/fonts (licença OFL); texto secundário mais escuro (--mut #5f675e). Arquivo: assets/visual.css.
- Capa nova (Unsplash photo-1681270543584); 6 serviços com fotos novas (Jantar a dois, Churrasco, Menu Degustação, Marmitas, Café colonial, Brunch) e 28 baixados de novo em 1200 px. Os 21 de outras fontes continuam em 640 px. Fontes em docs/FOTOS-SERVICOS.json.
- Efeitos na página inicial (assets/efeitos.js): título palavra por palavra, contagem em 'Ver os N serviços', brilho no botão da capa, luz que segue o mouse nos cartões. Param com 'reduzir movimento'; ?movimento no endereço liga para revisar.
- check, 63 testes e build passando. Sem publicar.
- Cartão do chef (início e busca): foto de perfil maior, nome, cidades e especialidade em destaque e 3 pratos pequenos da galeria, no lugar da foto grande de prato. check, 63 testes e build passando.
- Capa trocada por foto horizontal (Unsplash photo-1794867875846, prato com pinça sobre fundo escuro), que funciona na faixa larga do celular; no celular a foto passa de 180 para 240 px de altura, centralizada.
- Capa nova: jantar no quintal com chef apresentando o prato e convidados, gerada no Adobe Firefly (conta da Fer/Carlos) e ampliada 4x; servida do próprio site em assets/capa (webp 1800 px e jpg 1200 px para compartilhamento). app-core.safeUrl aceita /assets/capa/*.webp e o /admin aceita esse endereço padrão. Imagem criada com IA: trocar por foto real quando houver evento.
- Capa trocada pela versão do Gemini (a do Firefly saiu com rostos deformados): assets/capa/jantar-no-quintal-2.webp (1376 px) e jantar-no-quintal-2-share.jpg (1200x630). Nome novo para não ficar a antiga no cache. Imagem criada com IA.
## Entrega — 23/11/2026 · Identidade da página inicial
- Nova abertura e busca integrada, estilos da sequência de atendimento e da seleção de serviços. Fotos e ações existentes reaproveitadas.
- Check, 63 testes e build passaram.

## 23/11/2026 · Tema global e menus especiais (PR 17)
- Paleta escolhida por Carlos: oliva/marfim/vinho discreto em todas as telas do app e na vitrine compartilhável. Fotos dos serviços em cartões maiores; cabeçalho e abas ajustados para celular.
- Nova criação de menus por ocasião no painel do chef, vitrine filtrável, detalhe, pedido registrado no painel e link público com metadados. Download PNG quadrado/feed/story, cópia de mensagem e compartilhamento nativo quando suportado. Sem serviços pagos ou créditos de IA para gerar cada arte.
- Persistência por sessão e versão, filtros públicos para rascunhos/vencidos, preservação de menus/fotos nas edições do perfil. Sem migração de banco. API modificada para implementar este recurso explicitamente solicitado.
- Testado com SQLite real local e navegação com personagem de demonstração. PNGs dos três formatos foram baixados; mensagem copiada; pedido local apareceu no painel. Busca e navegação por serviço preservadas; nenhum envio por WhatsApp/Instagram. Ver `docs/MENUS-ESPECIAIS.md` para limites.
- `npm run check`, `npm test` (70 testes) e `npm run build` passaram nesta entrega.

## Entrega — 23/11/2026 · Correções da Auditoria da Jornada do Chef e SEO
- SEO técnico: adicionados robots.txt e sitemap.xml reais (copiados para dist/ no build); adicionadas tags canonical e og:url em index.html.
- Mobile UX: adicionado padding-bottom de respiro em #view > .wrap para telas menores de 1200px, impedindo que a barra de navegação inferior (.nav) sobreponha botões, textos e o link de recuperação de senha.
- UX de Cadastro: reordenados os campos do formulário de cadastro (os Termos de Uso agora ficam no final, logo antes do botão de envio); texto de login com Google condicionado ao recurso estar de fato habilitado.
- Recuperação de senha: ação "Esqueci minha senha" passa a oferecer botão direto para o WhatsApp da equipe (ou e-mail de contato configurado).
- Busca: botão "Limpar busca" quando nenhum chef é encontrado agora aciona a ação clearsearch, limpando os filtros e ocasiões selecionados de forma confiável.
- Título dinâmico: rota #/termos, #/marmitas e #/como-funciona passam a ter títulos específicos no navegador.
- Arquivos: robots.txt, sitemap.xml, scripts/build.cjs, index.html, assets/app.js, assets/improvements.css.
- Validação: npm run check, npm test e npm run build.

## Entrega — 24/11/2026 · Mercado Corporativo, FAQ e Cidades na Home
- Mercado Corporativo: adicionadas opções de atendimento `corporativo` ("Atendo eventos corporativos e empresas") e `nota_fiscal` ("Emito Nota Fiscal (PJ / MEI)") em OPCOES do app-core.js; novos filtros na busca; tags no perfil do chef; campos opcionais de Empresa e Nota Fiscal no formulário de pedido e na mensagem formatada do WhatsApp.
- Página Inicial:
  - Adicionado bloco de atalhos rápidos das Cidades atendidas logo abaixo da busca.
  - Adicionada seção de destaque "Mercado Corporativo" com botão direto para filtrar chefs empresariais.
  - Adicionada seção de FAQ direto com as 4 dúvidas essenciais (ingredientes, limpeza, emissão de NF e pagamento).
- Arquivos: assets/app-core.js, assets/app.js, assets/improvements.css, index.html.

## Entrega — 24/11/2026 · Visual Instagram dos Chefs e Bio Recolhível
- Prévia dos perfis (`card(c)`) com header de avatar, badge PJ, localização e cover edge-to-edge.
- Perfil do chef (`profile(id)`) com anel de história, estatísticas e bio recolhível com "ver mais" / "ver menos".
- Validação: npm run check, npm test e npm run build.

- 25/11/2026: PR 16 juntado ao main: cartão estilo Instagram + fonte Rethink Sans, capa nova, efeitos e prévia de 3 pratos no cartão.

- 25/11/2026: Sentry ligado no site (aviso de erros dos visitantes). Conta pelo GitHub, organização seu-chef-em-casa, projeto JavaScript do navegador. CSP liberada para sentry-cdn e ingest.us.sentry.io.
- 25/11/2026: "Esqueci minha senha" mostra botão do Instagram quando não há WhatsApp nem e-mail de suporte. robots.txt, sitemap e Limpar busca conferidos no ar (já corrigidos).
- 25/11/2026: SEO, branch seo-indexavel (PR, sem merge): perfil do chef em /chef/<nome>-<6 hex do id> montado no servidor (title, description, canonical, Open Graph, JSON-LD Person + Menu + Breadcrumb); /c/<id> redireciona 301; páginas /personal-chef/<cidade> (21 cidades de SC) e /servicos/<experiência> (51), com noindex enquanto não houver chef real; sitemap.xml gerado do banco; robots.txt bloqueia /api e /acesso; 404 de verdade (404.html); capa da home sem lazy e com preload (LCP no celular). Botão Compartilhar do app usa o endereço novo. Verificado: npm run check, npm test (82, 5 novos em tests/seo.test.cjs), npm run build e rotas no wrangler pages dev (sem banco).


## Entrega em revisão — 25/11/2026: correções da jornada
- Origem: `origin/main` em `91f551c`. Itens 3–7 e 12–15 do relatório em `teste-jornada`.
- Foto de perfil com recorte quadrado, guia circular, arraste, setas e zoom. O pedido sugere nome e WhatsApp da conta de cliente e mantém os campos editáveis.
- Aceite da cliente menciona o chef. O cadastro do chef só adiciona cidades de SC escolhidas nas sugestões, sem gravar texto incompleto.
- Cadastro e redefinição mostram as regras conforme a pessoa digita e barram senhas com menos de 10 caracteres ou padrões óbvios no formulário. A API conserva a regra anterior.
- Painéis têm saída visível. O perfil tem confirmação própria, o aviso de recursos futuros saiu e a tela de conexão só mostra mensagem se falhar.
- Verificação local: `npm run check`, `npm test` (83 testes), `npm run build` e `git diff --check`. Fluxos completos em navegador ainda não foram verificados.
- Prévia: https://correcoes-jornada.seu-chef-em-casa.pages.dev. A prévia roda em demonstração, pois o banco não está configurado no branch. Produção aguarda aprovação do Carlos.

## Entrega em revisão — 26/11/2026: perfil público compartilhável

- A página `/chef/<slug>` abre com apresentação, contagens de publicações, seguidores e seguindo, grade de três colunas, cardápio e pedido de orçamento. A galeria abre fotos com legenda e navegação. Curtir e comentar abrem a publicação no app.
- O HTML inclui canonical, Open Graph e JSON-LD. Mantidos os links de cidades, redirecionamentos e o noindex nas prévias e no exemplo. Os contadores usam relações existentes e exibem totais.
- Verificação local: `npm run check`, checagem sintática do visualizador, 84 testes, build e `git diff --check`. O teste de SEO cobre a presença da publicação no HTML, o escape de legendas e os contadores com e sem tabela social.
- Cada publicação pode ser enviada pelo WhatsApp ou ter o link copiado. O link abre a foto escolhida e usa essa imagem no Open Graph. O endereço canônico continua sendo o perfil do chef.
- O perfil e o painel do chef oferecem “Portfólio em PDF”, com apresentação, até nove fotos na ordem do perfil, cardápio por categoria e contato. A página de impressão usa o recurso de salvar como PDF do navegador.
