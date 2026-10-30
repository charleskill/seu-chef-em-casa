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
