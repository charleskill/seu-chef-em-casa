-- Seguir chefs, curtir e comentar fotos da galeria. O servidor também cria estas tabelas sozinho se faltarem.
CREATE TABLE IF NOT EXISTS seguidores (chef_id TEXT NOT NULL, conta_id TEXT NOT NULL, criado_em TEXT NOT NULL, PRIMARY KEY (chef_id, conta_id));
CREATE INDEX IF NOT EXISTS seguidores_conta ON seguidores(conta_id);
CREATE TABLE IF NOT EXISTS curtidas (chef_id TEXT NOT NULL, foto_id TEXT NOT NULL, conta_id TEXT NOT NULL, criado_em TEXT NOT NULL, PRIMARY KEY (chef_id, foto_id, conta_id));
CREATE INDEX IF NOT EXISTS curtidas_conta ON curtidas(conta_id);
CREATE TABLE IF NOT EXISTS comentarios (id TEXT PRIMARY KEY, chef_id TEXT NOT NULL, foto_id TEXT NOT NULL, conta_id TEXT NOT NULL, texto TEXT NOT NULL, criado_em TEXT NOT NULL);
CREATE INDEX IF NOT EXISTS comentarios_foto ON comentarios(chef_id, foto_id, criado_em);
CREATE INDEX IF NOT EXISTS comentarios_conta ON comentarios(conta_id);
