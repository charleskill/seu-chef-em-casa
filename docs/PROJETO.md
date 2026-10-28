# Seu Chef em Casa
Responsável pelo produto: Carlos.
Objetivo: clientes encontram personal chefs e solicitam orçamento.
Base inicial: index.html enviado por Carlos, preservado sem alterações.
Estado em 28/10/2026: protótipo HTML/CSS/JavaScript com dados em localStorage. Ainda não é uma plataforma multiusuário publicada.

## Piloto acordado
Busca por nome/cidade, perfil, cardápio, fotos e pedido de orçamento pelo WhatsApp.
Adicionar persistência compartilhada e autenticação real para profissionais.
Chat interno, stories e interações sociais ficam fora do primeiro lançamento público.
Meta: piloto nesta semana, condicionado à implementação e validação; não é garantia de prazo.

## Diagnóstico por leitura do código
Cadastros, sessão, mensagens e interações ficam no navegador.
Orçamento abre WhatsApp com texto pronto; o usuário deve concluir o envio.
Não há confirmação de entrega nem registro central de pedidos.
Login e recuperação locais não devem ser usados como segurança de produção.
Dados iniciais e fotos precisam ser confirmados antes de publicação.
As telas ainda não foram testadas em execução nesta etapa.

## Decisões técnicas pendentes
Escolher banco, autenticação, armazenamento de fotos e hospedagem.
Definir registro e acesso aos pedidos, profissionais piloto e região inicial.
Preservar o trabalho existente; escolher infraestrutura após avaliação técnica.
