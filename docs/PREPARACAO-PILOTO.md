# Preparação do piloto — 28/10/2026
Responsável desta etapa: ChatGPT. Branch: feat/preparacao-piloto.
## Verificado no navegador
- Home abre; busca sem resultados apresenta mensagem.
- Busca por "sao jose" encontra São José.
- Perfil e formulário de orçamento abrem.
- Reproduzido defeito: telefone "abc" liberava envio após selecionar prato.
- Após correção: telefone inválido mantém botão desabilitado e mostra erro.
- Dados fictícios válidos liberam o botão; nenhum pedido foi enviado.
## Implementado
Validação compartilhada de nome, telefone, e-mail opcional, data opcional e seleção de pratos.
Botão com disabled nativo e explicação de que o envio deve ser concluído no WhatsApp.
Quatro testes Node passaram (node --test tests/order-validation.test.cjs).
## Fundação do backend
Escolha técnica proposta: Supabase para PostgreSQL, Auth e Storage.
A migração inclui chefs, pratos e pedidos com RLS. Perfis começam não publicados.
Somente o proprietário pode editar chef/pratos; pedidos só podem ser lidos pelo chef destinatário.
Nenhuma inserção pública de pedido foi liberada. É necessário implementar endpoint com validação e controle de abuso.
## Ainda NÃO concluído
Migração SQL não aplicada nem executada em PostgreSQL; regras RLS ainda precisam de testes com duas identidades.
Frontend permanece localStorage. Login real, fotos remotas, envio persistente, testes móveis e publicação pendentes.
Não importar senhas locais. Profissionais precisarão criar contas verificadas.
## Próxima dependência
Carlos precisa adicionar/conectar Supabase. A conexão permite verificar projetos existentes antes de criar qualquer recurso.
Não foi criado projeto, contratado plano ou configurado cobrança.
Fontes técnicas: https://supabase.com/docs/guides/database/secure-data e https://supabase.com/docs/guides/getting-started/api-keys
