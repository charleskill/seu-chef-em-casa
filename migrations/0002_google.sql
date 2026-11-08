-- Login com Google. Aplicar uma vez, depois da 0001.
ALTER TABLE chefs ADD COLUMN google_sub TEXT;   -- identificador da conta Google ligada ao chef
CREATE UNIQUE INDEX IF NOT EXISTS chefs_google ON chefs(google_sub) WHERE google_sub IS NOT NULL;

-- Pedidos de login em andamento (10 minutos). Guarda o código PKCE e, no cadastro, os dados do formulário.
CREATE TABLE IF NOT EXISTS oauth_pendente (
  estado TEXT PRIMARY KEY,
  verificador TEXT NOT NULL,
  nonce TEXT NOT NULL,
  modo TEXT NOT NULL,                -- entrar | cadastro
  dados TEXT NOT NULL,               -- JSON (cadastro: nome, whatsapp, cidades; convite já conferido)
  expira_em INTEGER NOT NULL
);
