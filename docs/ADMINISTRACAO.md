# Administração sem depender da IA

## Dashboard e relatórios

A entrada do administrador abre **Visão geral**. Use os atalhos de 7 dias, 30 dias ou mês atual, ou preencha **De** e **Até** e toque em **Aplicar período**. Até 366 dias, incluindo as duas datas, no horário de Brasília.

Indicadores: pedidos registrados, novos cadastros, chefs com pedidos, média diária, evolução diária, situação e modalidade dos pedidos, cinco chefs com mais pedidos e situação atual da vitrine. A comparação considera o intervalo anterior com a mesma duração. Sem registros, os valores são zero; sem base anterior, não há percentual inventado. **Consultar os dados diários** mostra os valores do gráfico.

Para uma apresentação, selecione o período e toque em **Salvar PDF**. Na impressão do navegador, escolha **Salvar como PDF**. O relatório usa A4 horizontal, gráficos, período e metodologia; menus, filtros e botões ficam de fora. Desative cabeçalhos e rodapés do navegador se quiser remover URL e numeração automática.

Pedidos não são vendas: não há medição de visitas, faturamento, contratação ou pagamento. O estado dos pedidos é o atual, mesmo em um período passado. Contas e pedidos excluídos deixam de entrar no histórico. A situação da vitrine é sempre atual e as categorias podem se sobrepor.

A navegação separa Visão geral, Chefs e contas, Conteúdo do site e Ajuda. As ações de acesso, visibilidade e exclusão ficam em **Gerenciar conta**, em cada chef; a edição de conteúdo continua disponível diretamente.

Depois que o pull request desta entrega for aprovado e publicado, abra **https://seuchefemcasa.com.br/admin**. O endereço leva à área da equipe. Use uma conta com e-mail autorizado em `ADMIN_EMAILS`; a senha é a mesma da conta. Um chef comum não ganha acesso por conhecer o endereço.

## Conteúdo do site

1. Abra **Conteúdo do site**.
2. Em **Apresentação e capa**, altere o título, apresentação, legenda, imagem e convite aos chefs. A imagem de capa usa um endereço `https://images.unsplash.com/...`, permitido pela política atual do site. Confira a prévia antes de salvar.
3. Em **Contatos e redes sociais**, preencha e-mail, WhatsApp com DDD e links completos das redes. Deixe um campo opcional vazio para esconder seu link. O e-mail também aparece na seção de privacidade dos termos.
4. Toque em **Salvar alterações no site** e espere a mensagem de confirmação. A alteração fica no banco e vale para quem abrir ou recarregar o site, sem nova publicação de código.
5. Para desistir de uma edição ainda não salva, use **Recarregar campos**.

Se aparecer um aviso de que outra pessoa salvou primeiro, copie suas alterações para não perdê-las e recarregue os campos antes de editar novamente.

## Chefs e contas

- Busque por nome, cidade ou e-mail e use os filtros de situação.
- **Editar conteúdo** permite corrigir nome, cidades, especialidade, telefones, Instagram e apresentação; adicionar, corrigir ou remover pratos; trocar a foto do perfil; adicionar ou remover fotos do portfólio e editar legendas.
- Abra os blocos **Perfil profissional**, **Cardápio** e **Fotos e portfólio** conforme precisar. As mudanças só são aplicadas ao tocar em **Salvar conteúdo do chef** e receber a confirmação.
- Fotos: JPG, PNG ou WebP, até 10 MB de entrada. O painel reduz a imagem para JPEG antes de enviar.
- A edição de conteúdo preserva o e-mail de acesso, credenciais, permissão administrativa, pausa, atendimento, marmitas e agenda. Essas últimas escolhas continuam no painel do próprio chef.
- **Esconder** retira o perfil da busca e do link público sem excluir a conta. **Mostrar de novo** desfaz a ação se o chef estiver ativo e com foto, prato e cidade.
- **Link de nova senha** gera um endereço válido por 48 horas e uma única utilização. Entregue somente ao dono da conta. Não compartilhe o link em grupos.
- **Excluir conta** é permanente e remove perfil, fotos, pedidos e sessões. Para uma retirada temporária, prefira esconder.

## Configurações da própria conta

No **Meu painel → Configurações**, o chef encontra e-mail de acesso, pausa ou reativação, **Excluir minha conta**, saída e ajuda. A exclusão pede que a pessoa digite `EXCLUIR` antes de confirmar.

Clientes não criam conta nesta versão. Em **Configurações e privacidade**, no rodapé da página inicial, podem limpar os dados deste navegador. Isso não apaga pedidos do servidor nem mensagens do WhatsApp; solicitações sobre esses dados devem ser encaminhadas à equipe.

## Limites desta entrega

O painel edita os campos e conteúdos descritos acima. Mudanças de estrutura, cores, programação, textos de outras seções, domínio, infraestrutura e autorização de novos administradores continuam pelo processo técnico. Não é um editor livre de qualquer elemento do site.

As prévias de branch da Cloudflare não têm banco vinculado. Por isso não permitem conferir o administrador funcional com os dados reais. A verificação desta entrega foi feita com banco SQLite e contas fictícias locais; veja `TAREFAS.md`.

## Painel completo (28/11/2026)

- **Pedidos:** todos os pedidos, com busca, filtro por situação (Novos, Respondidos, Fechados), troca de situação na própria lista, Ver pedido e Excluir. O número vermelho no menu mostra os pedidos novos.
- **Clientes:** contas de quem contrata, com contato, forma de entrada, atividade (segue, curtidas, comentários), Link de nova senha e Excluir conta (pede para digitar EXCLUIR).
- **Comentários:** comentários das fotos dos chefs, com a foto, o autor e Apagar.
- **Registro de atividades:** cada ação da equipe no painel (salvar site, editar, esconder, link de senha, excluir, mudar pedido, apagar comentário), com data e nome. Começa a contar a partir desta versão.
- **Exportar planilha:** em Pedidos, Chefs, Clientes, Comentários e Registro. Baixa um arquivo .csv que abre no Excel ou no Google Planilhas, respeitando a busca e o filtro da tela.
