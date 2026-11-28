-- Registro de atividades da equipe (quem fez o quê no painel). A API também cria esta tabela sozinha.
CREATE TABLE IF NOT EXISTS atividades (id TEXT PRIMARY KEY, criado_em TEXT NOT NULL, conta_id TEXT NOT NULL, conta_nome TEXT NOT NULL, acao TEXT NOT NULL, alvo TEXT NOT NULL, detalhe TEXT NOT NULL);
CREATE INDEX IF NOT EXISTS atividades_data ON atividades(criado_em);
