# Decisões
## 28/10/2026 — Carlos e ChatGPT
- Repositório privado charleskill/seu-chef-em-casa é a fonte oficial do projeto.
- Aproveitar o protótipo existente.
- Primeiro piloto focado em encontrar chefs e pedir orçamento pelo WhatsApp.
- Adicionar banco compartilhado e autenticação real.
- Adiar chat interno, stories e interações sociais para depois do piloto.
- Carlos decide prioridades e aprova decisões de produto.
- Claude e Gemini ainda precisam ser conectados/importar este repositório pelo usuário.
- Conexão ao repositório não implica comunicação automática entre IAs.
- Envio inicial preserva o HTML; não implementa backend nem publica o aplicativo.


## Proposta técnica anterior preservada
A branch feat/preparacao-piloto já continha validação de orçamento e fundação SQL para Supabase. A escolha do Supabase continua sendo uma proposta técnica: não há conta/projeto conectado nem migração aplicada. Ver PREPARACAO-PILOTO.md.

## 29/10/2026 — Revisão solicitada pelo usuário
- Partir do main 8922addac6322d2ec916dbec577ab681f505bd1a e incorporar a revisão ao PR #1 existente, preservando seus testes e SQL.
- Separar interface, estilos, dados de exemplo e regras puras para manutenção e testes. Gerar também HTML único para revisão.
- Manter conversas locais com coluna lateral, conforme solicitação de interface. Identificar explicitamente que são rascunhos: isto não antecipa o lançamento do chat multiusuário.
- Remover recuperação de senha por informações públicas. Credenciais novas locais usam PBKDF2; hashes antigos são aceitos somente após verificação da senha e migrados. Isso não é autenticação de produção.
- Identificar os perfis fictícios e impedir contato com números fictícios. Remover notícias e depoimentos sem verificação.
- Gravar dados locais de forma atômica, preservar chaves antigas e mostrar erros de quota/leitura. Não migrar dados automaticamente para serviços externos.
- Não publicar nem aplicar a migração SQL nesta revisão.


## 30/10/2026 — Perfis de teste e marmitas, a pedido de Carlos
- Os 50 perfis de teste ficam no código, não no armazenamento do navegador, para aparecerem em qualquer navegador e serem removidos com uma chave ou apagando dois arquivos. Continuam sem contato real e identificados como exemplo.
- Marmitas entram como um segundo tipo de pedido ("Plano de marmitas") dentro do mesmo orçamento, com o mesmo envio por WhatsApp. Cada chef informa um preço de referência por marmita, o mínimo por entrega, as frequências e as formas de atendimento; os pratos de marmita são marcados no cardápio.
- Proposta, ainda sem validação com chefs: estimativa = preço por marmita × marmitas por entrega × entregas por mês (semanal 4, quinzenal 2, mensal 1) × meses. Sem desconto por prazo, sem taxa de entrega e sem cobrança recorrente; tudo é combinado com o chef. Não há pagamento nem contrato no app.
- Imagens dos perfis de teste são ilustrações geradas, não fotos de pratos reais, para não depender de serviços externos nem usar fotos de terceiros sem controle.

## 30/10/2026 — Publicação autorizada
- Carlos autorizou publicar o site e pediu que as atualizações sejam enviadas direto ao `main`, sem pull request.
- Hospedagem: GitHub Pages por workflow (`.github/workflows/publicar.yml`), publicando só `dist/` (index.html e assets/) depois de `check` e `test`. Docs, testes, scripts e SQL não são publicados. Ativação: Settings → Pages → Source: GitHub Actions.
- Isso publica o protótipo local (dados no navegador de cada pessoa, sem banco compartilhado nem login real) com perfis de exemplo identificados. Não substitui o piloto com dados compartilhados. A migração SQL continua sem aplicação.

## 30/10 · Mapa e opções de atendimento do chef
- Google Maps: links "Ver/Conferir no Google Maps" (sem chave de API) no perfil, no campo de local do pedido, no painel do chef e uma linha "Mapa:" no texto do WhatsApp. Autocomplete de endereço exige chave da Places API (faturamento + restrição por domínio) e fica para quando houver chave.
- Painel > Atendimento: o chef liga/desliga 13 opções (crianças, compras, limpeza, utensílios, garçom, grupos grandes, fins de semana, outras cidades, glúten, lactose, vegetariano, vegano, frutos do mar). Sem escolha, valem os padrões (a maioria ligada). Efeito: aparece no perfil, esconde campos no pedido e filtra a busca.

## 30/10 · Busca por data e agenda do chef
- Home e busca: Onde? / Quando? / Quantas pessoas? filtram os chefs livres na data. Mais de 20 pessoas só mostra quem ativou "grupos grandes".
- Painel do chef > Agenda: calendário em que o chef marca os dias ocupados (estilo Airbnb). Dia ocupado tira o chef da busca daquela data e o pedido nessa data é recusado.
- Perfis de teste ganham datas ocupadas aleatórias (não salvas) para o filtro ser visível.
- Referência: ChefMaison / Take a Chef (busca com data + convidados antes de ver chefs).

## 30/10 · Termos de uso e privacidade
- Página #/termos (assets/termos.js): o app é vitrine; contratação, pagamento e serviço são diretos entre cliente e chef; sem verificação de chefs ou clientes; responsabilidade "nos limites da lei"; LGPD resumida.
- Chef precisa aceitar os termos ao criar conta; o resumo do pedido lembra que é vitrine.
- PENDENTE: revisão por advogado(a) antes do lançamento; preencher CONTATO em assets/termos.js (e-mail); trocar o nome quando virar Mesa Posta.

## 30/10 · Aba Marmitas, sugestões do chef e montagem
- Nova aba "Marmitas" (#/marmitas): lista chefs que fazem marmita (filtro por cidade) e leva ao plano do chef.
- No plano: "Sugestões do chef" (kits criados por ele no painel > Marmitas) com um toque, ou "monte a sua" com quantidade por prato, agrupado por categoria. O total vira a quantidade por entrega e precisa atingir o mínimo do chef.
- A mensagem do WhatsApp lista "5x Frango..." por entrega. Máximo de 6 sugestões por chef; cada uma deve ter ao menos o mínimo do chef.
- Hipótese a validar com os chefs: preço por marmita e mínimos (pesquisa mostra R$ 21–30 em SP; ver docs/pesquisa).


## 07/11 · Banco e login na Cloudflare (D1)
- Carlos escolheu "deixar real para os 2 chefs" na mesma base da plataforma Seu Restaurante Online: Cloudflare Pages + Pages Functions + D1, plano gratuito. Substitui a proposta do Supabase (o gratuito pausa após 7 dias sem uso); a migração SQL do Supabase fica só como histórico.
- Conta de chef só com código de convite (variável secreta `CONVITE`), para o piloto ficar fechado aos chefs convidados.
- Fotos no próprio D1 (JPEG até 1,5 MB), sem R2, para não exigir cartão.
- GitHub Pages continua publicando a demonstração local; o app detecta a API e só liga o modo real na Cloudflare.


## 08/11 · Número de teste em todo dado fictício
- Pedido de Carlos: todo dado fictício do app usa o telefone (48) 99110-6355 — os 50 perfis de exemplo (WhatsApp e telefone, via `scripts/gerar-demo.cjs`) e os números dos testes automáticos.
- Consequência: perfis de exemplo passam a mostrar "Abrir WhatsApp" no resumo do pedido, que abre o WhatsApp nesse número. O aviso do resumo diz que é perfil de exemplo e que abrir o aplicativo não confirma o envio. Como a demonstração é pública, qualquer visitante que conclua um pedido de teste manda mensagem para esse número.
- Os textos de exemplo dos campos (placeholders, ex.: "(48) 99999-0000") continuam genéricos, para não parecer que o campo já vem preenchido.

## 08/11 · Sugestões de endereço enquanto digita
- Pedido de Carlos: ao digitar "flori", sugerir "Florianópolis, Santa Catarina", como no Google.
- Feito com o Photon (photon.komoot.io, dados do OpenStreetMap): gratuito, sem chave nem cartão, e funciona no GitHub Pages. Fica em `assets/endereco.js`.
- Campos: endereço do pedido (endereço completo; mantém o número digitado), "Onde?" da página inicial (cidades) e "Cidades onde atende" no cadastro e no perfil do chef (troca só a última cidade da lista).
- Google Places (o padrão do Google): precisa de projeto no Google Cloud com faturamento (cartão) e chave restrita ao domínio. Há cota gratuita mensal, mas a conta fica sujeita a cobrança acima dela. Se Carlos quiser, troca-se só a função `buscar()` de `endereco.js`.
- Limite: o Photon público é um serviço comunitário sem garantia de disponibilidade; se falhar, o campo continua funcionando como texto normal.

## 08/11 · Login com Google
- Carlos escolheu o login com Google (Microsoft fica para depois).
- Só para chefs; clientes continuam sem login. Criar conta com Google ainda exige o código de convite, WhatsApp e aceite dos termos (dados pedidos antes de ir ao Google).
- Fluxo OpenID Connect com código + PKCE no servidor (Pages Functions): estado de uso único guardado no D1 (10 min) e preso ao navegador por cookie; id_token obtido direto do Google com o segredo; conferidos aud, iss, validade, nonce e e-mail verificado.
- Mesmo e-mail de conta existente: o Google é ligado a essa conta (não duplica). Conta criada pelo Google não tem senha; login por senha nela orienta a usar o Google.
- Liga só com GOOGLE_CLIENT_ID e GOOGLE_CLIENT_SECRET; sem elas, nada muda. Banco: `migrations/0002_google.sql`.


## 09/11 · Pausar e excluir conta
- Pausar usa a coluna `publicado` já existente: o chef pausado sai da lista e não recebe pedidos, sem perder dados. Excluir apaga de vez perfil, fotos, pedidos e sessões.
- Versão real reconhecida pelo domínio e pela resposta da API; a demonstração do GitHub Pages continua com os 50 perfis de exemplo.