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
