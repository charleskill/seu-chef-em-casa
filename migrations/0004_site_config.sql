CREATE TABLE IF NOT EXISTS site_config (
  id INTEGER PRIMARY KEY CHECK (id = 1),
  dados TEXT NOT NULL,
  atualizado_em TEXT NOT NULL,
  atualizado_por TEXT NOT NULL
);
