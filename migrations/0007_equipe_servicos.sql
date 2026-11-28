-- Equipe do painel (além do dono) e ajustes dos serviços. A API também cria estas tabelas sozinha.
CREATE TABLE IF NOT EXISTS admins (email TEXT PRIMARY KEY, criado_em TEXT NOT NULL, criado_por TEXT NOT NULL);
CREATE TABLE IF NOT EXISTS servicos_config (id INTEGER PRIMARY KEY CHECK (id = 1), dados TEXT NOT NULL, atualizado_em TEXT NOT NULL, atualizado_por TEXT NOT NULL);
