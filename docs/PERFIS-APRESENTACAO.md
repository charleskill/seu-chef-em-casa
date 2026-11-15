# Perfis para a apresentação aos sócios

Carlos autorizou em 15/11/2026 a inclusão na vitrine pública de três personagens, sem rótulo na interface; ele explicará na apresentação que são fictícios. Estes não representam profissionais reais.

| Personagem | Proposta | ID |
|---|---|---|
| Chef Helena Duarte | Italiana, massas e jantares | chef-a671dc49f32b8e10 |
| Chef Rafael Monteiro | Frutos do mar e litoral | chef-b982ef73a14c605d |
| Chef André Valença | Brasa e preparo lento | chef-c453a0e1967fb82d |

Cada um tem 25 pratos, nove fotos de portfólio e um retrato próprio. Retratos gerados com IA para personagens inventados; prompts em RETRATOS-APRESENTACAO.md. Fotografias de pratos, eventos e preparo do Unsplash/Pexels, com fontes em FOTOS-APRESENTACAO.json. Não foram criados pedidos, avaliações, diplomas ou premiações.

Todos os contatos usam o número de teste do projeto: (48) 99110-6355. E-mails internos usam o domínio reservado .invalid e a credencial tem algoritmo sem-acesso, recusado pelo login; não há senha, sessão ou nova permissão administrativa.

## Inclusão e manutenção

scripts/perfis-apresentacao.cjs exporta os dados e, se chamado com um caminho, prepara SQL com INSERT OR IGNORE. Não acessa o banco nem roda no build. A inserção é manual no D1 chefemcasa depois da publicação das fotos; não sobrescreve cadastros existentes e não recria perfis excluídos automaticamente.

Na administração, os perfis usam os mesmos controles de edição, ocultação e exclusão dos demais. Para retirar a apresentação sem apagar o conteúdo, abra Chefs e contas → Gerenciar conta → Esconder em cada personagem. A exclusão permanente continua exigindo confirmação.

As fotos em /assets/apresentacao são públicas e não dependem de um domínio específico. O editor só preserva arquivos estáticos que já pertenciam ao perfil; novos uploads seguem o armazenamento normal no banco. As páginas /c/ também reconhecem esse caminho local.
