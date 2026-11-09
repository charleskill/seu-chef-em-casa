-- Painel do administrador: perfil escondido pela equipe (o chef não consegue desfazer). Aplicar uma vez, depois da 0002.
ALTER TABLE chefs ADD COLUMN oculto INTEGER NOT NULL DEFAULT 0;
