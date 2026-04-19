CREATE TABLE IF NOT EXISTS folders (
    id SERIAL PRIMARY KEY,
    name text NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS files (
    id SERIAL PRIMARY KEY,
    name text NOT NULL,
    size INT NOT NULL,
    folder_id INT NOT NULL
);

CREATE UNIQUE INDEX ON files (name, folder_id);

ALTER TABLE "files"
    ADD CONSTRAINT fk_folder
    FOREIGN KEY (folder_id)
    REFERENCES folders (id)
    ON DELETE CASCADE;