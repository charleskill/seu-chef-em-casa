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
- Troca de senha por e-mail (por enquanto, a equipe ajuda pelo WhatsApp).
- Tela para o chef ver os pedidos registrados (a API `/api/meus-pedidos` já existe).
- Domínio próprio (pode ser ligado depois em Custom domains).
