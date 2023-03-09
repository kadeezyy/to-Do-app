create table IF NOT EXISTS api_note (
    id serial PRIMARY KEY NOT NULL,
    title VARCHAR(50) UNIQUE  NOT NULL,
    description VARCHAR(200) NOT NULL,
    done BOOLEAN NOT NULL DEFAULT FALSE);