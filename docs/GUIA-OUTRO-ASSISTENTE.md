# Guia para outro assistente (Jules, Gemini ou outra IA)

Para quando o assistente principal estiver indisponível e o Carlos precisar de uma mudança simples no site.
Escrito em 10/11/2026. Leia também `CONTEXTO.md` (estado atual) e `AGENTS.md` (regras).

## 1. O projeto em um minuto

- **Seu Chef em Casa**: vitrine para o cliente achar um personal chef, ver cardápio e fotos e pedir orçamento pelo WhatsApp. Sem pagamento e sem comissão.
- **No ar em** https://seuchefemcasa.com.br (Cloudflare Pages + Pages Functions + banco D1).
- **Sem framework e sem dependências**: HTML, CSS e JavaScript puros. Node só para checagem, testes e build.
- **Dono do produto**: Carlos. Ele aprova decisões; não invente requisitos.

## 2. Como entregar uma mudança

1. Crie um branch a partir da `main` e faça a mudança **mínima** pedida.
2. Rode, nesta ordem, e só siga se os três passarem:
   ```sh
   npm run check
   npm test
   npm run build
   ```
   O build carimba a versão dos arquivos (`?v=...`) no `index.html` da raiz. Inclua esse `index.html` alterado no commit.
3. Registre a entrega no fim de `docs/TAREFAS.md`: o que mudou, quais arquivos e **o que foi realmente verificado** (e o que não foi). Decisão de produto vai em `docs/DECISOES.md`.
4. Abra um pull request para a `main`, com a descrição em português simples. **Não faça merge**: o Carlos lê e aprova.
5. A Cloudflare publica uma prévia de cada branch em `https://<nome-do-branch>.seu-chef-em-casa.pages.dev`. Ponha esse endereço no pull request para o Carlos conferir antes de aprovar. A prévia não tem banco: o app abre em modo de demonstração e `/c/exemplo` mostra uma vitrine fictícia.

**O merge na `main` publica no site de verdade em cerca de um minuto.** Não existe etapa de homologação depois disso.

## 3. Onde fica cada coisa simples

| Pedido | Onde mexer |
|---|---|
| Foto da capa da página inicial | `assets/app.js`, constante `HERO` (perto da linha 45). Só fotos de `images.unsplash.com`: outra origem é bloqueada pela política de segurança em `_headers` |
| Textos e ordem das seções da página inicial | `assets/app.js`, função `home()`. A ordem é a ordem em que os blocos são somados na string |
| Seção "Como funciona" | `assets/app.js`, função `how()` |
| Cores da marca | `assets/styles.css`, bloco `:root` (`--ol` verde, `--cu` terracota, `--gold`, `--bg`, `--ink`). O verde `#1c2520` também aparece escrito em `assets/improvements.css`, `assets/app.js`, `index.html` e `functions/c/[id].js` |
| Estilos e ajustes visuais | `assets/improvements.css` (prefira acrescentar aqui a mexer em `styles.css`) |
| Termos de uso e privacidade | `assets/termos.js` |
| Lista de pratos sugeridos ao chef | `assets/pratos.js` (nomes separados por `\|`, por categoria e cozinha) |
| Vitrine do chef (`/c/<id>`) | `functions/c/[id].js` |
| Tela de senha do site (hoje desligada) | `functions/_middleware.js`, constante `LIGADA` |
| Link do Instagram e rodapé | `assets/app.js`, procure por `instagram.com` |
| Imagem e texto de compartilhamento do site | `index.html`, metas `og:` |

`assets/app.js` tem linhas muito longas. Edite só o trecho necessário, sem reformatar o arquivo: reformatar gera um diff enorme e esconde a mudança real.

Conteúdo de um chef (fotos, pratos, bio, cidades) **não está no código**: muda pelo painel do chef no site. Contas de chef (esconder, nova senha, excluir) mudam pela área da equipe, em `/#/admin`.

## 4. O que não tocar sem pedido explícito do Carlos

- `functions/api/[[rota]].js` (login, sessões, pedidos, área da equipe) e `migrations/`.
- Variáveis e segredos da Cloudflare (`ADMIN_EMAILS`, `SENHA_SITE`, as do Google). Nunca escreva senha, token ou chave em arquivo: o repositório é exposto pelo GitHub Pages.
- A política de segurança em `_headers`.
- `.github/workflows/`.
- Os dados de exemplo (`assets/demo-data.js`, `assets/demo-images.js`): são gerados por `scripts/gerar-demo.cjs`.

## 5. Regras que valem sempre

- Todo dado fictício (exemplos, testes) usa o telefone de teste **(48) 99110-6355**.
- Nunca afirme, em texto do site, que abrir o WhatsApp confirma o envio do pedido.
- O site é vitrine: não prometa pagamento, garantia ou verificação de chefs.
- Não copie texto de livros ou de outros sites.
- Texto do site em português do Brasil, direto e sem jargão.

## 6. Se algo quebrar depois de publicar

Na Cloudflare: **Workers & Pages → seu-chef-em-casa → Deployments**, escolha a versão anterior e use **Rollback to this deployment**. O site volta em segundos. Depois, reverta o commit na `main` para o código acompanhar.

## 7. Texto pronto para colar no início da conversa

> Você vai me ajudar com uma mudança pequena no repositório `charleskill/seu-chef-em-casa`. Antes de qualquer coisa, leia `AGENTS.md`, `CONTEXTO.md` e `docs/GUIA-OUTRO-ASSISTENTE.md` e siga o que está lá. Faça só o que eu pedir, no menor número de arquivos possível. Trabalhe num branch, rode `npm run check`, `npm test` e `npm run build`, registre a entrega em `docs/TAREFAS.md` dizendo o que você realmente verificou, e abra um pull request sem fazer merge. Não mexa em `functions/api`, em `migrations`, em `_headers` nem em segredos. Se o pedido exigir mexer nisso, pare e me avise. Meu pedido é: …

## 8. Se você trabalha na pasta do computador do Carlos (Antigravity ou outro IDE)

A pasta local é a mesma que o assistente principal usa. Por isso:

- **Um assistente por vez.** Não trabalhe ao mesmo tempo que outro assistente nesta pasta.
- **Comece sempre com `git pull`** na `main` e confira com `git status` que não há alterações pendentes de outra pessoa. Se houver, pare e avise o Carlos; não descarte nada.
- **Trabalhe num branch** e envie o branch (`git push -u origin <branch>`). A prévia aparece em `https://<branch>.seu-chef-em-casa.pages.dev`. Só junte na `main` depois de o Carlos ver a prévia e dizer sim: o envio para a `main` publica no site de verdade.
- A máquina tem Node 26 (instalado em 10/11/2026) e o Git do projeto está configurado com o nome e o e-mail do Carlos. Se `node` ou `npm` não forem reconhecidos, feche e abra o terminal.
- A pasta fica dentro do OneDrive. Se aparecer arquivo duplicado com o nome do computador no final, é conflito de sincronização: avise o Carlos, não apague por conta própria.
