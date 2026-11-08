-- Banco do piloto (Cloudflare D1). Aplicar uma vez no banco novo.
-- Cada chef tem um registro com o perfil em JSON; fotos ficam numa tabela própria.

CREATE TABLE IF NOT EXISTS chefs (
  id TEXT PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  credencial TEXT NOT NULL,          -- JSON: PBKDF2-SHA256, iterações, sal, hash
  perfil TEXT NOT NULL,              -- JSON do perfil público (sem e-mail nem credencial)
  publicado INTEGER NOT NULL DEFAULT 1,
  criado_em TEXT NOT NULL,
  atualizado_em TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS sessoes (
  token_hash TEXT PRIMARY KEY,       -- só o hash do token fica no banco
  chef_id TEXT NOT NULL REFERENCES chefs(id) ON DELETE CASCADE,
  expira_em TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS sessoes_chef ON sessoes(chef_id);

CREATE TABLE IF NOT EXISTS fotos (
  id TEXT PRIMARY KEY,
  chef_id TEXT NOT NULL REFERENCES chefs(id) ON DELETE CASCADE,
  tipo TEXT NOT NULL,                -- image/jpeg
  dados BLOB NOT NULL,
  criado_em TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS fotos_chef ON fotos(chef_id);

CREATE TABLE IF NOT EXISTS pedidos (
  id TEXT PRIMARY KEY,
  chef_id TEXT NOT NULL REFERENCES chefs(id) ON DELETE CASCADE,
  texto TEXT NOT NULL,
  dados TEXT NOT NULL,               -- JSON do pedido
  criado_em TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS pedidos_chef ON pedidos(chef_id, criado_em);

-- Limite de tentativas (login, cadastro e pedidos) por origem e janela de tempo.
CREATE TABLE IF NOT EXISTS limites (
  chave TEXT PRIMARY KEY,
  n INTEGER NOT NULL,
  expira_em INTEGER NOT NULL
);
