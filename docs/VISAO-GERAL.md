# Seu Chef em Casa — documento do projeto

Retrato do projeto em 09/11/2026, montado a partir do repositório (código, `docs/`, histórico do Git) e de consultas feitas no mesmo dia aos endereços publicados e ao registro do domínio. Onde algo foi conferido de fato, o texto diz; o resto vem da documentação existente.

## 1. Resumo

| | |
|---|---|
| **O que é** | Vitrine (marketplace) para encontrar personal chefs, ver cardápio e fotos e pedir orçamento pelo WhatsApp |
| **Região inicial** | Santa Catarina |
| **Responsável pelo produto** | Carlos |
| **Estágio** | Versão real no ar desde 09/11/2026, ainda sem chefs cadastrados; piloto com 3 chefs profissionais é a meta imediata |
| **Modelo** | Sem pagamento, sem comissão e sem mediação: cliente e chef combinam direto |
| **Versão real** | https://seuchefemcasa.com.br (Cloudflare Pages + D1); também em https://seu-chef-em-casa.pages.dev |
| **Demonstração** | https://charleskill.github.io/seu-chef-em-casa/ (50 perfis de exemplo, dados só no aparelho) |
| **Domínio próprio** | `seuchefemcasa.com.br` — registrado e ligado ao site em 09/11/2026 (seção 7) |
| **Repositório** | `charleskill/seu-chef-em-casa`, branch `main`, 72 commits desde 28/10/2026 |
| **Versão do pacote** | 0.4.0 |

## 2. O produto

### Para o cliente (sem conta)
- Busca por nome, cidade, especialidade, prato ou texto da bio; filtros opcionais de data, número de pessoas e opções de atendimento.
- Perfil do chef com cardápio, fotos (modal com legenda e teclado), cidades atendidas e link para o Google Maps.
- Pedido de orçamento de dois tipos: **evento** e **plano de marmitas** (frequência semanal, quinzenal ou mensal; duração de 1, 2, 3 ou 6 meses; entrega ou preparo na casa do cliente; kits sugeridos pelo chef ou montagem própria).
- Estimativa de valor com aviso de que não é preço final.
- O pedido é registrado no banco e depois abre o WhatsApp do chef com o texto pronto. A tela seguinte explica que o pedido só chega depois de enviado e deixa reabrir o WhatsApp ou copiar o texto.
- Aba **Serviços**: experiências que o chef escolhe oferecer (Noite da Pizza, Noite do Boteco, Churrasco em casa, Sequência de frutos do mar, Noite da Tainha, Fondue, Aula com o chef, jantar a dois, marmitas, entre outras).
- Sugestões de endereço ao digitar (Photon/OpenStreetMap, gratuito e sem chave).

### Para o chef
- Cadastro por e-mail e senha ou pelo Google (o Google ainda não está ativado), com aceite dos termos. O código de convite virou opcional em 09/11: só é pedido se a variável `CONVITE` existir na Cloudflare, e ela foi apagada na noite de 09/11.
- Link próprio para compartilhar, `/c/<id>`, com prévia de foto, nome, especialidade e cidades.
- Aviso por e-mail a cada pedido (no código; depende de configurar o envio de e-mail no domínio).
- Painel com as abas Perfil, cardápio, Marmitas, Atendimento (13 opções liga/desliga mais as experiências), Agenda (dias ocupados) e Pedidos.
- Pedidos recebidos com situação Novo, Respondido ou Fechado, "Responder no WhatsApp" e "Copiar pedido".
- Pausar o perfil (some da busca sem perder dados) e excluir a conta (apaga perfil, fotos, pedidos e sessões).
- O perfil só aparece aos clientes quando tem foto, ao menos um prato e cidade; o painel mostra o que falta.

### Para a equipe
- Área da equipe em `/#/admin`, só para os e-mails listados em `ADMIN_EMAILS`: números gerais, situação de cada chef e o botão de esconder ou mostrar um perfil.

### Fora do escopo por decisão
- Chat interno, stories e interações sociais (adiados para depois do piloto; a aba Mensagens fica escondida na versão real).
- Pagamento pelo app e comissão (ideia cancelada por enquanto em 09/11).
- Conta de cliente.

## 3. Arquitetura

O mesmo código roda em dois modos. O app pergunta à `/api`; se ela responde, usa o banco compartilhado, e se não responde continua como demonstração local.

| Camada | Versão real | Demonstração |
|---|---|---|
| Hospedagem | Cloudflare Pages, publica a cada push na `main` | GitHub Pages |
| Dados | Banco D1 `chefemcasa` (binding `DB`) | `localStorage` do navegador |
| Login | Sessão em cookie seguro por 30 dias, senha com PBKDF2 | Conta local, sem valor de segurança |
| Perfis de exemplo | Não são baixados (economiza cerca de 520 KB) | 50 perfis fictícios |

A versão real é reconhecida pelo endereço: `assets/real.js` aceita `seu-chef-em-casa.pages.dev` e `seuchefemcasa.com.br`, por isso o domínio próprio funcionou sem mudança no código.

Não há dependências de instalação nem framework: HTML, CSS e JavaScript puros, Node 18 ou superior só para testes e build.

### Arquivos principais

| Arquivo | Papel |
|---|---|
| `index.html` | Estrutura da página |
| `assets/app.js` | Telas, navegação e eventos |
| `assets/app-core.js` | Validações, migração de dados locais e credenciais locais |
| `assets/cloud.js` | Ligação com a API e detecção do modo real |
| `assets/real.js` | Reconhece a versão real pelo endereço |
| `assets/endereco.js` | Sugestões de endereço e cidades em etiquetas |
| `assets/order-validation.js` | Validação do pedido de orçamento |
| `assets/termos.js` | Termos de uso e privacidade |
| `assets/tela.js` | Corrige celular aberto em "site para computador" |
| `assets/demo-data.js`, `demo-images.js` | Os 50 perfis de exemplo |
| `functions/api/[[rota]].js` | API (Cloudflare Pages Functions), 316 linhas |
| `migrations/0001_piloto.sql`, `0002_google.sql` | Banco D1, as duas já aplicadas em produção |
| `_headers` | Política de segurança de conteúdo e demais cabeçalhos |
| `scripts/build.cjs` | Gera `dist/` e carimba a versão dos arquivos |
| `supabase/` | Proposta antiga de banco, não aplicada; só histórico |

### Banco de dados (D1)

| Tabela | Conteúdo |
|---|---|
| `chefs` | E-mail, credencial (PBKDF2), perfil em JSON, `publicado`, `google_sub` |
| `sessoes` | Só o hash do token, com validade |
| `fotos` | JPEG de até 1,5 MB guardado no próprio banco |
| `pedidos` | Texto e dados do pedido, com a situação dentro do JSON |
| `limites` | Limite de tentativas de login, cadastro e pedido |
| `oauth_pendente` | Logins com Google em andamento (10 minutos) |

### Rotas da API

| Rota | Função |
|---|---|
| `GET /api/saude` | Diz se a API está viva e se o Google está ativo |
| `GET /api/chefs` | Lista pública de chefs (sem e-mail) |
| `GET /api/foto/:id` | Foto |
| `POST /api/cadastro`, `/api/entrar`, `/api/sair` | Conta e sessão |
| `GET`, `PUT`, `DELETE /api/eu` | Ler, alterar (inclusive pausar) e excluir a própria conta |
| `POST /api/pedidos` | Registrar pedido de orçamento |
| `GET /api/meus-pedidos`, `PATCH /api/meus-pedidos/:id` | Pedidos do chef e situação |
| `POST /api/google/iniciar`, `GET /api/google/retorno` | Login com Google (OpenID Connect com PKCE) |
| `GET /api/admin/chefs`, `POST /api/admin/chefs/:id` | Área da equipe: listar chefs e esconder ou mostrar um perfil |
| `GET /c/:id` (`functions/c/[id].js`) | Link de compartilhamento do chef, com prévia |

### Segurança
- Código de convite opcional (segredo `CONVITE`): com ele, só cria conta quem tem o código; sem ele, o cadastro é aberto. Contra abuso ficam o limite de tentativas, a regra do perfil pronto e o botão de esconder perfil na área da equipe.
- Cada chef só altera o próprio perfil; o servidor aceita apenas campos conhecidos.
- Cabeçalhos em produção, conferidos em 09/11: CSP restrita a `'self'`, Unsplash para imagens e Photon para endereços; `X-Frame-Options: DENY`; `nosniff`; `Referrer-Policy`; `Permissions-Policy`.

## 4. Como trabalhar no projeto

```sh
npm run check   # sintaxe de todos os arquivos
npm test        # testes Node
npm run build   # gera dist/ e carimba as versões no index.html
```

Regras fixas de Carlos (de `CONTEXTO.md` e `AGENTS.md`):
- Commit e push direto na `main`, sem pull request.
- Rodar `npm run build` antes de cada commit.
- Todo dado fictício usa o telefone de teste **(48) 99110-6355**.
- Registrar entregas em `docs/TAREFAS.md`, só com o que foi realmente verificado, e decisões em `docs/DECISOES.md`.
- Nunca afirmar que abrir o WhatsApp confirma envio.
- Não publicar credenciais nem ampliar acesso a dados sem autorização.

Teste local da versão real: `wrangler pages dev dist` com `wrangler.toml` temporário (não versionar), D1 local e as migrações.

## 5. Linha do tempo

| Data | Marco |
|---|---|
| 28/10/2026 | Repositório criado; protótipo original de Carlos preservado; piloto definido |
| 29/10 | Revisão geral: navegação, fotos, orçamento, validações; código separado em arquivos |
| 30/10 | 50 perfis de teste, marmitas, agenda, opções de atendimento, termos; publicação da demonstração autorizada; pesquisa de mercado |
| 07/11 | Banco compartilhado e login real na Cloudflare (substitui a proposta do Supabase) |
| 08/11 | Testes completos de chef e cliente, tela de pedidos, sugestões de endereço, busca simplificada, login com Google no código |
| 09/11 | Versão real no ar; pausar e excluir conta; cabeçalhos de segurança; novo símbolo; perfil só aparece quando pronto; situação dos pedidos; aba Serviços; domínio registrado e ligado ao site; convite opcional; área da equipe; link do chef; aviso de pedido por e-mail; Instagram @seuchefemcasaoficial; brandbook |

## 6. Decisões que moldam o projeto

- **Vitrine, não intermediário.** Contratação, pagamento e serviço são diretos entre cliente e chef.
- **WhatsApp como canal.** O app registra o pedido e abre a conversa; não confirma entrega.
- **Cloudflare gratuita** (Pages, Functions, D1), mesma base do Seu Restaurante Online, que é marca e repositório separados.
- **Cadastro aberto** (pedido de Carlos em 09/11): o convite deixou de ser obrigatório; recriar a variável `CONVITE` fecha o cadastro de novo.
- **Fotos no banco**, sem R2, para não exigir cartão.
- **Nome definitivo:** Seu Chef em Casa. "Mesa Posta" foi descartado em 09/11.
- **Marmita é complemento:** a aba Marmitas virou Serviços.

O histórico completo, com datas e motivos, está em `docs/DECISOES.md`.

## 7. Verificação do domínio (09/11/2026)

Consulta ao registro.br (RDAP), ao DNS público e aos endereços publicados.

### `seuchefemcasa.com.br`

| Item | Resultado |
|---|---|
| Registro | **Registrado** em 09/11/2026 às 14:17 (horário de Brasília), em nome de Carlos |
| Validade | Até 09/11/2027 |
| Servidores de nome | `meadow.ns.cloudflare.com` e `steven.ns.cloudflare.com` |
| Delegação | Conferida pelo registro.br às 16:44, correta |
| Zona na Cloudflare | Ativa (responde, com SPF `v=spf1 -all` e MX nulo: o domínio declara que não envia nem recebe e-mail) |
| Ligação ao Pages | **Feita em 09/11**: `seuchefemcasa.com.br` e `www.seuchefemcasa.com.br` adicionados em Custom domains do projeto `seu-chef-em-casa` (CNAME com proxy para `seu-chef-em-casa.pages.dev`) |
| `https://seuchefemcasa.com.br` | Abre (200), com certificado |
| `https://www.seuchefemcasa.com.br` | Abre (200); mostra o mesmo site, sem redirecionar para a raiz |
| `https://seuchefemcasa.com.br/api/saude` | `{"ok":true,"google":false}` — versão real, com o banco |
| DNSSEC | Desligado |
| `seuchefemcasa.com` | Livre (sem registro) |

**Conclusão:** o domínio está comprado, na Cloudflare e ligado ao site. Na primeira consulta do dia ele ainda não abria (não havia registro na raiz nem no `www`); passou a abrir logo depois da ligação ao Pages. No painel da Cloudflare os dois domínios ainda apareciam como "Verifying" no momento da conferência.

### O que ainda falta no domínio
1. No login com Google, quando a credencial for criada, incluir também `https://seuchefemcasa.com.br` nas origens e `https://seuchefemcasa.com.br/api/google/retorno` nos redirecionamentos (o servidor monta o retorno a partir do endereço em que foi acessado).
2. Opcional: redirecionar o `www` para a raiz, para o site ter um endereço só.
3. Opcional: ligar o DNSSEC e avaliar registrar o `.com`.
4. Lembrar que o SPF e o MX atuais bloqueiam e-mail no domínio. Para ter um e-mail de contato `@seuchefemcasa.com.br` (pendência dos termos) ou a troca de senha por e-mail, esses registros terão de mudar.
5. Não conferido: abertura em celular físico.

### Endereços publicados

| Endereço | Resultado |
|---|---|
| `seu-chef-em-casa.pages.dev` | No ar (200), cabeçalhos de segurança presentes |
| `…pages.dev/api/saude` | `{"ok":true,"google":false}` — API viva, Google desligado |
| `…pages.dev/api/chefs` | `{"chefs":[]}` — nenhum chef visível ainda |
| `charleskill.github.io/seu-chef-em-casa/` | No ar (200) |
| `…github.io/…/docs/PROJETO.md` | **Público** (200) |
| `…github.io/…/migrations/0001_piloto.sql` | **Público** (200) |

O último ponto confirma a pendência 4: o GitHub Pages continua publicando a raiz do repositório, e não só `dist/`. Isso expõe `docs/`, `migrations/` e também o `CONTEXTO.md`, que cita o e-mail da conta Cloudflare. Qualquer arquivo novo em `docs/`, este inclusive, fica público ao ser enviado à `main` enquanto a fonte do Pages não for trocada para **GitHub Actions**.

## 8. Pendências

| # | Pendência | De quem | Situação |
|---|---|---|---|
| 1 | Primeiro chef de teste na versão real e conferência em outro aparelho | Carlos | Aberta (lista de chefs vazia em 09/11) |
| 2 | Login com Google: criar a credencial e pôr `GOOGLE_CLIENT_ID` e `GOOGLE_CLIENT_SECRET` na Cloudflare | Carlos | Aberta (`google: false`) |
| 3 | GitHub → Settings → Pages → Source: GitHub Actions | Carlos | Aberta (docs e SQL públicos) |
| 4 | Domínio: comprar e pôr na Cloudflare | Carlos | **Feito em 09/11** |
| 5 | Domínio: ligar ao Pages | Carlos | **Feito em 09/11** |
| 5b | Domínio: acrescentar no Google | Carlos | Aberta (depende da pendência 2) |
| 5c | Apagar a variável `CONVITE` na Cloudflare para o cadastro ficar aberto | Carlos | **Feito em 09/11** |
| 5d | `ADMIN_EMAILS` na Cloudflare, para ligar a área da equipe | Carlos | Aberta |
| 5e | Envio de e-mail no domínio (`EMAIL_REMETENTE`, `CF_ACCOUNT_ID`, `CF_EMAIL_TOKEN`) | Carlos | Aberta |
| 6 | Termos: e-mail de contato e revisão por advogado(a) | Carlos | Aberta |
| 7 | Validar com os chefs do piloto: modelo de marmitas, preços e lista de experiências | Carlos | Aberta |
| 8 | Login Microsoft e troca de senha por e-mail | Depois do piloto | Adiada |

### Nunca verificado até aqui
Segundo `docs/TAREFAS.md`, os testes foram feitos com banco local e navegador simulado ou de computador. Seguem sem verificação: conta de chef na Cloudflare real, celular físico, envio de fato pelo WhatsApp e login com o Google de verdade.

### Documentação a atualizar
- `docs/ATIVAR-CLOUDFLARE.md` ainda lista o domínio próprio em "Ainda não tem".
- `docs/PROJETO.md` descreve o estado de 28/10 (protótipo local, infraestrutura a escolher).
- A parte de cima de `docs/TAREFAS.md` lista como abertas tarefas já entregues.
- `README.md` cita `docs/REVISAO-2026-10-29.md` como leitura principal e a descrição do `package.json` ainda diz "protótipo local".
- `docs/pesquisa/` ainda fala em "Mesa Posta".

## 9. Mercado e posicionamento

Resumo de `docs/pesquisa/` (30/10/2026). Os números vêm de páginas públicas e imprensa, alguns divergem entre fontes; rever antes de usar.

- **Concorrência em SC existe.** A Take a Chef lista 85 chefs em Florianópolis; ChefMaison, GetNinjas e Cronoshare também atuam.
- **Padrão do setor:** comissão perto de 20% sobre a reserva, pagamento retido pela plataforma e avaliações. O Seu Chef em Casa optou por não seguir esse modelo agora.
- **Espaço aberto:** nenhuma das fontes mostra um concorrente local, centrado no WhatsApp e com marmita recorrente. É um nicho aparentemente livre, não uma demanda comprovada.
- **Preços de referência:** jantar de R$ 150 a R$ 450 por pessoa no Brasil; em Florianópolis, de R$ 196 a R$ 331 por pessoa conforme o grupo; marmita de R$ 21 a R$ 30 (dado de São Paulo).
- **Alerta dos casos que fecharam** (Kitchit, Munchery, SpoonRocket): cadastrar chefs é fácil; o difícil é manter demanda quando a compra é ocasional. Recorrência, como planos de marmita, é a resposta mais citada.
- **Lacunas da pesquisa:** comissões no Brasil, tamanho do mercado brasileiro, regras sanitárias e fiscais.

## 10. Onde está cada coisa

| Documento | Para quê |
|---|---|
| `CONTEXTO.md` | Ponto de partida de cada conversa nova |
| `AGENTS.md` | Regras para colaboradores e assistentes |
| `docs/TAREFAS.md` | Entregas, com o que foi verificado em cada uma |
| `docs/DECISOES.md` | Decisões com data e motivo |
| `docs/ATIVAR-CLOUDFLARE.md` | Passo a passo de banco, publicação e login com Google |
| `docs/PERFIS-DE-TESTE.md` | Como esconder, remover e regenerar os 50 perfis |
| `docs/pesquisa/` | Relatório de mercado e notas com fontes |
| `docs/PREPARACAO-PILOTO.md`, `docs/REVISAO-2026-10-29.md` | Histórico das primeiras etapas |
