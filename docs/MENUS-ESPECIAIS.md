# Menus especiais e divulgação

Implementação em revisão no PR #17, sem publicação oficial.

## Usar como chef

Em **Meu painel → Menus especiais**, crie o cardápio, escolha ocasião e foto, informe atendimento (na casa do cliente, entrega ou retirada), preço por pessoa ou pelo menu completo, quantidade mínima/servida, inclusões e prazos. O preço pode aparecer como “a partir de”.

Salve como rascunho ou marque a publicação. Um menu publicado aparece em Serviços → Menus especiais e no perfil do chef enquanto os prazos estiverem vigentes e o perfil estiver público e completo. Tire a marca de publicação para pausar a oferta. Não é necessário excluir para interromper a divulgação.

Em **Gerar arte**, escolha quadrado (1080 × 1080), feed (1080 × 1350) ou story/status (1080 × 1920). A arte é gerada no navegador, sem créditos de IA e sem enviar fotos a um serviço externo. Usa foto, título, chef, preço e quantidade, prévia do cardápio e marca do app. O story reserva espaço inferior para a interface da rede social.

Baixe o PNG e copie a mensagem. O compartilhamento nativo com arquivo depende do navegador e do sistema. Quando indisponível, baixe a imagem e envie junto do texto. No Instagram, acrescente o link no adesivo do story ou na bio: uma imagem PNG não contém um link clicável.

## Links e pedidos

Cada menu publicado tem `/m/<chef>/<menu>` com metadados e imagem para a prévia dos mensageiros. O link apresenta o cardápio e leva ao formulário no aplicativo. Rascunhos, menus vencidos e chefs pausados/escondidos não são apresentados publicamente. O mensageiro pode manter sua própria prévia em cache; abrir o link consulta a disponibilidade atual.

O cliente prepara o pedido, que é registrado no painel, e só então continua ao WhatsApp para concluir o envio. Não há pagamento, reserva automática ou confirmação de mensagem enviada. O pedido guarda a oferta vigente do servidor; datas ocupadas e quantidade abaixo do mínimo são recusadas.

## Persistência e permissões

- Até 12 menus por chef, em JSON no próprio perfil; não há migração de banco nem nova tabela.
- `PUT /api/eu/menus` usa a sessão existente, versão independente e atualização atômica. O ID enviado pelo cliente não muda o dono.
- O salvamento normal de perfil e a edição administrativa preservam os menus mais recentes. Fotos referenciadas por menus são mantidas mesmo que saiam da galeria.
- Imagens do próprio perfil ou da coleção local. Nada de URL arbitrária para contaminar o canvas ou referenciar fotos privadas de outra conta.
- Acesso administrativo continua exclusivo da conta autorizada por Carlos. Nenhuma alteração em credenciais, segredos, política de segurança ou produção.

## Validação desta entrega

Testes automatizados com SQLite exercitam autorização, concorrência, preservação do perfil/fotos, preços, datas, rascunhos, links públicos e pedidos com oferta vigente. O teste no navegador usa banco SQLite em memória e personagens de demonstração, sem conexão com o D1 de produção.

Conferido no navegador: criar/salvar oferta, reabrir após recarga, vitrine e detalhe, pedido no painel, link preparado do WhatsApp (sem enviar), download PNG nos três tamanhos e cópia da mensagem. Compartilhamento nativo e postagem em aplicativos físicos não foram executados. Os metadados foram verificados, mas não se enviou link para forçar cache de prévia no WhatsApp/Instagram.

A prévia Cloudflare deste projeto não tem D1: a interface pública pode ser revista nela, mas testar cadastro, menus persistidos e compartilhamento de uma oferta real requer um ambiente com banco. Não conectar a prévia ao banco de produção para preencher esse vazio.
