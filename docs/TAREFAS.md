# Tarefas
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
