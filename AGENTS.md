# Orientações para colaboradores e assistentes
Leia docs/PROJETO.md, docs/TAREFAS.md e docs/DECISOES.md antes de trabalhar.
Carlos é o responsável pelo produto. Não invente requisitos ou decisões dele.
Consulte a versão atual da branch main; informe quando estiver trabalhando com uma cópia desatualizada.
Preserve o trabalho existente. Faça mudanças focadas e use branches para alterações funcionais.
Não deixe duas implementações concorrentes da mesma tarefa sem coordenação.
Não publique credenciais, tokens ou arquivos .env.
Não trate localStorage como banco multiusuário nem como controle de acesso.
Não afirme que abrir WhatsApp confirma envio ou recebimento.
Registre o que mudou e quais verificações foram realmente executadas.
Atualize tarefas e decisões após mudanças relevantes.
Não publique o site ou amplie acesso a dados sem autorização do responsável.

## Para assistentes que abrem pull request (Jules e outros)
Leia também CONTEXTO.md e docs/GUIA-OUTRO-ASSISTENTE.md: lá está onde fica cada coisa e o que não tocar.
Faça a mudança mínima pedida, num branch, e abra pull request para a main. Não faça merge: o merge publica no site de verdade.
Antes do pull request rode `npm run check`, `npm test` e `npm run build` (Node 18+, sem dependências) e inclua o index.html que o build atualiza.
Não mexa em functions/api, migrations, _headers nem em segredos sem pedido explícito de Carlos.
Não reformate assets/app.js: edite só o trecho necessário.
Ponha no pull request o endereço da prévia: https://<nome-do-branch>.seu-chef-em-casa.pages.dev
