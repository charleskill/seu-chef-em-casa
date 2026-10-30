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
