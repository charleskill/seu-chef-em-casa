-- Mural de pedidos (modelo GetNinjas). O servidor também cria estas tabelas sozinho (functions/_lib/mural.js).
CREATE TABLE IF NOT EXISTS mural_pedidos (id TEXT PRIMARY KEY, conta_id TEXT NOT NULL, cidade_slug TEXT NOT NULL, dados TEXT NOT NULL, status TEXT NOT NULL DEFAULT 'aberto', criado_em TEXT NOT NULL, expira_em TEXT NOT NULL);
CREATE INDEX IF NOT EXISTS mural_pedidos_cidade ON mural_pedidos(cidade_slug, status, expira_em);
CREATE INDEX IF NOT EXISTS mural_pedidos_conta ON mural_pedidos(conta_id, criado_em);
CREATE TABLE IF NOT EXISTS mural_liberacoes (pedido_id TEXT NOT NULL, chef_id TEXT NOT NULL, ordem INTEGER NOT NULL, criado_em TEXT NOT NULL, PRIMARY KEY (pedido_id, chef_id));
CREATE INDEX IF NOT EXISTS mural_liberacoes_chef ON mural_liberacoes(chef_id, criado_em);
CREATE TABLE IF NOT EXISTS mural_denuncias (pedido_id TEXT NOT NULL, chef_id TEXT NOT NULL, criado_em TEXT NOT NULL, PRIMARY KEY (pedido_id, chef_id));
