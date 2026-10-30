# Seu Chef em Casa

Protótipo de busca de personal chefs, portfólio e orçamento. A versão atual é uma demonstração local: não possui backend conectado, autenticação de produção nem chat entre aparelhos.

## Executar e conferir

Requer Node.js 18 ou superior. Não há dependências de instalação.

```sh
npm run check
npm test
npm run build
```

Sirva a pasta `dist/` com um servidor estático. O build também gera `dist/seu-chef-revisado.html`, uma cópia com CSS e JavaScript incorporados que pode ser aberta diretamente para revisão. A criação de credenciais locais depende de Web Crypto em contexto seguro; use HTTPS ou localhost. As imagens de exemplo dependem de conexão externa.

## Organização

- `index.html`: estrutura da página.
- `assets/app.js`: telas, navegação e eventos.
- `assets/styles.css`: identidade visual e layouts responsivos.
- `assets/demo-data.js`: perfis ilustrativos, sem contatos de contratação.
- `assets/app-core.js`: migração local, validações e credenciais locais.
- `assets/order-validation.js`: validação do orçamento, preservada da revisão anterior.
- `tests/`: testes Node.
- `supabase/migrations/`: proposta de banco da revisão anterior; não aplicada.

Dados `scf3_*` são lidos e preservados; novas gravações usam o registro `scf4_store`. O armazenamento do navegador não é um banco compartilhado nem uma barreira de acesso. Não use dados sensíveis neste protótipo.

Leia `AGENTS.md` e `docs/REVISAO-2026-10-29.md` antes de continuar o desenvolvimento. Publicação e escolha de infraestrutura continuam sujeitas às orientações do projeto.
