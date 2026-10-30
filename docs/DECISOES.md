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
