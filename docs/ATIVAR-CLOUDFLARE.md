# Ativar o banco e o login dos chefs (Cloudflare)

O app já tem o código do banco compartilhado e do login real. Ele só liga quando roda na Cloudflare.
No GitHub Pages continua como demonstração local. Tudo abaixo é gratuito e dá para fazer pelo celular, no navegador.

## 1. Criar a conta
1. Entre em dash.cloudflare.com e crie a conta (de preferência com o e-mail da empresa).

## 2. Criar o banco
1. No menu, abra **Storage & Databases → D1** e toque em **Create**.
2. Nome: `chefemcasa`. Crie.
3. Abra o banco, vá em **Console**, cole todo o conteúdo de `migrations/0001_piloto.sql` e execute.

## 3. Publicar o app ligado ao GitHub
1. Menu **Workers & Pages → Create → Pages → Connect to Git**.
2. Escolha o repositório `charleskill/seu-chef-em-casa`, branch `main`.
3. Configuração do build:
   - Build command: `npm run build`
   - Build output directory: `dist`
4. Salve e publique. O endereço fica parecido com `seu-chef-em-casa.pages.dev`.

## 4. Ligar o banco e o código de convite
No projeto do Pages, abra **Settings**:
1. **Bindings → Add → D1 database**. Variable name: `DB`. Banco: `chefemcasa`.
2. **Variables and Secrets → Add**. Nome: `CONVITE`. Tipo: Secret. Valor: um código que só vocês sabem (ex.: `chef-floripa-2026`).
3. Volte em **Deployments** e toque em **Retry deployment** para valer.

## 5. Conferir
1. Abra o endereço do app e vá em **Sou chef → Criar conta**. Deve aparecer o campo **Código de convite**.
2. Crie a conta com o código, mude a bio e publique uma foto.
3. Abra o app em outro celular: a chef aparece na busca com a foto.

## 6. Login com Google (opcional, gratuito, sem cartão)
Faça depois dos passos acima, quando o endereço do app (ex.: `seu-chef-em-casa.pages.dev`) já existir.

**No Google** (console.cloud.google.com, com a conta Google da empresa):
1. No topo, **Selecionar projeto → Novo projeto**. Nome: `Seu Chef em Casa`. Crie e selecione o projeto.
2. Menu ☰ → **Google Auth Platform** (ou **APIs e serviços → Tela de permissão OAuth**) → **Começar**.
   - Nome do app: `Seu Chef em Casa`; e-mail de suporte: o da empresa.
   - Público: **Externo**. Contato: o mesmo e-mail. Aceite e crie.
3. Em **Clientes** (ou **Credenciais**) → **Criar cliente** (ID do cliente OAuth):
   - Tipo: **Aplicativo da Web**. Nome: `Seu Chef em Casa`.
   - **Origens JavaScript autorizadas**: `https://seu-chef-em-casa.pages.dev`
   - **URIs de redirecionamento autorizados**: `https://seu-chef-em-casa.pages.dev/api/google/retorno`
   - (Quando tiver domínio próprio, adicione também `https://SEUDOMINIO` e `https://SEUDOMINIO/api/google/retorno`.)
   - Crie e copie o **ID do cliente** e a **Chave secreta do cliente**.
4. Em **Público**, toque em **Publicar app** (status "Em produção"). O app só pede nome e e-mail, então o Google não exige verificação.

**No banco (D1)**: abra o banco `chefemcasa` → **Console**, cole todo o conteúdo de `migrations/0002_google.sql` e execute.

**Na Cloudflare** (projeto do Pages → **Settings → Variables and Secrets**):
1. `GOOGLE_CLIENT_ID` (tipo Text): o ID do cliente.
2. `GOOGLE_CLIENT_SECRET` (tipo **Secret**): a chave secreta.
3. **Deployments → Retry deployment**.

**Conferir**: em **Sou chef**, deve aparecer **Entrar com Google**. Em **Criar conta**, o chef preenche nome, WhatsApp, cidades, código de convite, aceita os termos e toca em **Criar conta com Google**.
- Se o chef já tem conta com o mesmo e-mail, o Google entra nessa conta.
- Sem as duas variáveis, os botões do Google simplesmente não aparecem.

## 7. Área da equipe (painel do administrador)
1. Crie uma conta de chef com o e-mail da equipe (pode ser com o Google). Ela não aparece para os clientes enquanto não tiver foto e prato.
2. Na Cloudflare → projeto → **Settings → Variables and Secrets** → **Add**: tipo **Text**, nome `ADMIN_EMAILS`, valor `carlosmendes.ricci@gmail.com` (mais de um: separe por vírgula). Salve e publique de novo.
3. Entre no app com esse e-mail: no painel aparece o botão **Equipe** (endereço `/#/admin`), com todos os chefs, situação, pedidos e o botão **Esconder** / **Mostrar de novo**.
- O banco cria sozinho a coluna nova (`oculto`) no primeiro acesso; `migrations/0003_admin.sql` fica como registro.

## 8. Aviso de pedido por e-mail ao chef (precisa de domínio próprio)
O servidor manda um e-mail ao chef a cada pedido registrado, pelo Cloudflare Email Service. Precisa:
1. Domínio próprio na Cloudflare (ex.: seuchefemcasa.com.br) com o envio de e-mail ativado: **Email Service / Email Sending** → adicionar o domínio e seguir os registros de DNS que a Cloudflare pedir.
2. Um token de API com permissão de envio de e-mail: **Manage account → Account API tokens → Create token**.
3. Variáveis no projeto do Pages: `EMAIL_REMETENTE` (Text, ex.: `pedidos@seuchefemcasa.com.br`), `CF_ACCOUNT_ID` (Text, o ID da conta, que aparece no endereço do painel) e `CF_EMAIL_TOKEN` (**Secret**, o token). Publique de novo.
- Sem essas variáveis, nada é enviado e os pedidos funcionam normalmente. Uma falha de e-mail nunca impede o pedido.
- Confira na documentação da Cloudflare (Email Service) se o plano gratuito permite enviar a qualquer destinatário; se exigir o plano pago dos Workers, decida antes de ativar.

## Como funciona
- Só cria conta de chef quem tem o código de convite. Cliente não precisa de conta.
- Cada chef só altera o próprio perfil. A sessão fica num cookie seguro por 30 dias.
- Senhas guardadas com PBKDF2 (nunca em texto). Limite de tentativas no login, no cadastro e nos pedidos.
- Fotos ficam no próprio banco (até 1,5 MB cada, já reduzidas pelo app).
- Todo pedido de orçamento é registrado no banco antes de abrir o WhatsApp do chef.
- Os 50 perfis de exemplo continuam aparecendo, marcados como exemplo, até serem desligados.

## Limites do plano grátis (D1)
5 GB de armazenamento, 5 milhões de leituras e 100 mil gravações por dia. Sobra para o piloto.

## Ainda não tem
- Troca de senha por e-mail (por enquanto, a equipe ajuda pelo WhatsApp; quem entra com Google não precisa de senha).
- Domínio próprio (pode ser ligado depois em Custom domains).
