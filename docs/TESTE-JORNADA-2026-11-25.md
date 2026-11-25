# Teste da jornada no site no ar · 25/11/2026

Claude e Carlos testaram em seuchefemcasa.com.br, do zero, a jornada de um chef (Rafael Teste, conta `+chefteste`) e de uma cliente (Ana Cliente Teste, conta `+clienteteste`), até o pedido ir para o WhatsApp. Telefone de teste: (48) 99110-6355. Fotos: as de apresentação (`assets/apresentacao/rafael-*`).

## O que funcionou
- Cadastro de chef e de cliente; depois de criar a conta, a cliente volta direto para o pedido.
- Foto, 6 fotos com legenda, 9 pratos (um feito a partir de sugestão e editado), atendimento e menu de Natal publicados.
- Perfil aparece na busca assim que fica completo; a página do Google `/chef/rafael-teste-be5cd2` e o sitemap (com cidades e serviços dele) se atualizaram sozinhos; `/c/<id>` redireciona.
- Editar e excluir prato funcionam.
- Resumo do pedido claro; tela "Falta só enviar no WhatsApp" com os próximos passos.

## Correções, em ordem de prioridade

### Alta
1. **Vitrine da cliente estilo feed** (pedido do Carlos). Ver proposta abaixo. Hoje o painel da cliente tem só "Encontrar um chef" e "Configurações".
2. **Meus orçamentos** para a cliente: lista dos pedidos (chef, data, pratos, "preparado para o WhatsApp"), com "abrir conversa de novo" e "pedir de novo".
3. **Foto de perfil:** recorte quadrado com arrastar e aproximar, mostrando o círculo final. Hoje a foto vertical fica retangular no recorte e o círculo corta a cabeça. Paliativo rápido: no círculo, mostrar a parte de cima da foto.
4. **Pedido não puxa nome e telefone da conta**: a cliente digita de novo o que acabou de cadastrar.
5. **Texto errado no aceite da cliente**: "o combinado é direto entre mim e o cliente" → "entre mim e o chef".

### Média
6. **Cidade no cadastro:** se a pessoa sai do campo antes das sugestões aparecerem, fica uma cidade cortada ("Florian"). As sugestões trazem cidades de outros estados (São José dos Pinhais/PR): priorizar ou limitar a SC.
7. **Senha:** mostrar as regras na tela, com lista que fica verde; mínimo 10 caracteres e bloqueio de senhas óbvias (sem obrigar símbolo). Depois: Cloudflare Turnstile em cadastro, entrada, "Esqueci minha senha" e pedido.
8. **Sugestão de prato** traz só nome e categoria; deveria trazer ingredientes básicos para o chef ajustar à receita dele.
9. **Cardápios do chef** (Francês, Italiano, Café da manhã...), com as etapas (entrada, principal, sobremesa) dentro de cada um.
10. **Pedido:** tipo de encontro lista mais de 60 opções; mostrar primeiro as que o chef oferece. Data aparece como "opcional". Mostrar um total de referência (ex.: 6 pessoas × pratos ≈ R$ 1.140), deixando claro que o valor final é combinado com o chef.

### Baixa
11. Aba Atendimento: 66 caixas numa lista só; agrupar (serviço, restrições, experiências) e recolher.
12. Ao salvar o perfil, o aviso diz "Configurações salvas"; trocar por "Perfil salvo".
13. "Sair da conta" só existe em Configurações.
14. Painel da cliente diz "Em breve: seguir chefs, curtir e comentar", mas isso já funciona.
15. Ao abrir o site aparece por um instante "Conectando à sua conta… Estamos tentando conectar ao servidor".

## Proposta: início da cliente como feed
Para quem entra como cliente (e, com menos itens, para quem não entrou):
- **Topo:** "Chefs perto de você" em carrossel de retratos (cidade da conta), como os stories.
- **Feed:** fotos que os chefs publicam no portfólio (já têm curtir e comentar), dos chefs que ela segue e da cidade dela primeiro. Cada post com "Ver cardápio" e "Pedir orçamento".
- **Entre os posts:** menus especiais da época (Natal, Réveillon) em destaque; experiências ("Noite da Tainha em Florianópolis"); chef novo na cidade.
- **Como funciona:** cartão de 3 passos na primeira visita (escolha o chef, monte o pedido, combine no WhatsApp), que a cliente pode fechar.
- **Menu de baixo:** Início · Buscar · Meus orçamentos · Conta.
- **Sem chefs reais ainda:** o feed não inventa posts; mostra o "Como funciona", as experiências e um convite. Os primeiros posts chegam com a turma do Senac (05/12).

## Pendente do teste
- Chef de teste continua visível na vitrine e no sitemap: esconder (Chefs e contas > Esconder, ou entrar como chef > Pausar perfil) ou excluir a conta. As duas contas de teste podem ser excluídas depois.
- Conferir o e-mail de pedido novo em `+chefteste` e o pedido no painel do chef.
