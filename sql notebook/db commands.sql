
--https://x-team.com/blog/automatic-timestamps-with-postgresql/

--creacion dela funcion que actuara en el trigger para que cada vez que se registre una modificacion se registre la hora
CREATE OR REPLACE FUNCTION trigger_set_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

--primary key
CREATE TABLE users (
id SERIAL NOT NULL PRIMARY KEY,
email VARCHAR(100) UNIQUE NOT NULL, 
username VARCHAR(100) NOT NULL, 
initials VARCHAR(100),
password VARCHAR(100) NOT NULL,
created_at TIMESTAMP NOT NULL DEFAULT NOW(),
updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
completed_at TIMESTAMP
);
--creada con su primary key y su foreign key as usernameid 
--DELETE CASCADE dice que si no existe ese usuario en users, en datacollected no entra
--de igual modo si en users se borra uno, todos sus puntos collectados tbn se borran
CREATE TABLE datacollected (
id SERIAL NOT NULL PRIMARY KEY, 
usernameid integer REFERENCES users(id) ON DELETE CASCADE,
name VARCHAR(100) UNIQUE NOT NULL, 
ppm integer, 
description text, 
lon real,
lat real,
created_at TIMESTAMP NOT NULL DEFAULT NOW(),
updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
completed_at TIMESTAMP
);


--meter columna geom
ALTER TABLE datacollected ADD COLUMN geom geometry(Point,4326);

--editar columna geom
UPDATE datacollected SET geom = ST_SetSRID(ST_MakePoint(lon, lat), 4326);

--asociacion del triger a la tabla users
CREATE TRIGGER set_timestamp
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE PROCEDURE trigger_set_timestamp();

--asociacion del triger a la tabla datacollected
CREATE TRIGGER set_timestamp
BEFORE UPDATE ON datacollected
FOR EACH ROW
EXECUTE PROCEDURE trigger_set_timestamp();

--nose muy bien esto. mirar enlace de arriba
UPDATE users 
   SET completed_at = NOW() 
 WHERE username = 'hugo' RETURNING *;

--poblar users
INSERT INTO users (email, username, initials, password) 
VALUES ('natalia.gordillo@gmail.com', 'natalia', 'ng', 'purple') RETURNING *;

--poblar datacollected
INSERT INTO datacollected (usernameid, name, ppm, description, lon, lat)
VALUES (3, 'cv-4', 35, 'buenas condiciones. protegido', -3.689128, 40.4666069) RETURNING *;
INSERT INTO datacollected (usernameid, name, ppm, description, lon, lat)
VALUES (14, 'cv-10', 142, 'desprotegido', -3.711412, 40.457549) RETURNING *




Tal vez haya que hacer que por cada usuario que haya en la tabla usuario, se cree una tabla "data_to_colect".
AL final her tirado por un modelo de una tabla con todos los datos recogidos por todos los users.

-----------------------------------
--MADRID air / meteo
----------------------------------

--creacion de primary key
ALTER TABLE airstations
  ADD CONSTRAINT codigo_cor_id 
    PRIMARY KEY (codigo_cor);

ALTER TABLE meteostations
  ADD CONSTRAINT codigo_cor_pk 
    PRIMARY KEY (codigo_cor);

--drop primary key and set a new one for air_magnitudes and meteo_magnitudes
ALTER TABLE meteo_magnitudes
  DROP CONSTRAINT meteo_magnitudes_pkey;

ALTER TABLE meteo_magnitudes
  ADD CONSTRAINT magnitud_id 
    PRIMARY KEY (magnitud);

ALTER TABLE meteo_magnitudes
  DROP CONSTRAINT air_magnitudes_pkey;

ALTER TABLE air_magnitudes
  ADD CONSTRAINT airmagnitud_id 
    PRIMARY KEY (magnitud);

--addding foreign keys
ALTER TABLE air
ADD CONSTRAINT magnitud_fk FOREIGN KEY (magnitud) REFERENCES air_magnitudes (magnitud)

ALTER TABLE air
ADD CONSTRAINT estacion_fk FOREIGN KEY (estacion) REFERENCES airstations (codigo_cor)

ALTER TABLE meteo
ADD CONSTRAINT magnitud_fk FOREIGN KEY (magnitud) REFERENCES meteo_magnitudes (magnitud)

ALTER TABLE meteo
ADD CONSTRAINT estacion_fk FOREIGN KEY (estacion) REFERENCES meteostations (codigo_cor)



--borro primary key y clave foraneas de air y meteo con CASCADE:
ALTER TABLE airstations DROP CONSTRAINT codigo_cor_id CASCADE;
ALTER TABLE air_magnitudes DROP CONSTRAINT airmagnitud_id CASCADE; 
ALTER TABLE meteostations DROP CONSTRAINT codigo_cor_pk CASCADE;
ALTER TABLE meteo_magnitudes DROP CONSTRAINT magnitud_id CASCADE; 
--ahora cambio el double precision de codigo_cor a integer. 
--No me dejaba siendo PK, por eso las borre.
ALTER TABLE airstations
  ALTER COLUMN codigo_cor TYPE INT USING codigo_cor::integer,
  ALTER COLUMN altitud TYPE INT USING altitud::integer
  
ALTER TABLE air_magnitudes
  ALTER COLUMN magnitud TYPE INT USING magnitud::integer

ALTER TABLE air
  ALTER COLUMN estacion TYPE INT USING estacion::integer,
  ALTER COLUMN magnitud TYPE INT USING magnitud::integer

ALTER TABLE meteostations
  ALTER COLUMN codigo_cor TYPE INT USING codigo_cor::integer,
  ALTER COLUMN altitud TYPE INT USING altitud::integer

ALTER TABLE meteo_magnitudes
  ALTER COLUMN magnitud TYPE INT USING magnitud::integer

ALTER TABLE meteo
  ALTER COLUMN estacion TYPE INT USING estacion::integer,
  ALTER COLUMN magnitud TYPE INT USING magnitud::integer

--nueva pk´s en ambas tablas padre:
ALTER TABLE airstations 
  ADD CONSTRAINT estacion_pk 
  PRIMARY KEY (codigo_cor);

ALTER TABLE air_magnitudes
  ADD CONSTRAINT magnitud_pk 
  PRIMARY KEY (magnitud);

ALTER TABLE meteostations 
  ADD CONSTRAINT meteoestacion_pk 
  PRIMARY KEY (codigo_cor);

ALTER TABLE meteo_magnitudes
  ADD CONSTRAINT meteomagnitud_pk 
  PRIMARY KEY (magnitud);

--nueva definición de foreign keys en tabla hija air y meteo
ALTER TABLE air
ADD CONSTRAINT magnitud_id FOREIGN KEY (magnitud) REFERENCES air_magnitudes (magnitud)

ALTER TABLE air
ADD CONSTRAINT estacion_id FOREIGN KEY (estacion) REFERENCES airstations (codigo_cor)

ALTER TABLE meteo
ADD CONSTRAINT magnitud_id FOREIGN KEY (magnitud) REFERENCES meteo_magnitudes (magnitud)

ALTER TABLE meteo
ADD CONSTRAINT estacion_id FOREIGN KEY (estacion) REFERENCES meteostations (codigo_cor)


--query para obtener todas los valores de un dia
SELECT h01, h02, h03, h04, h05, h06, h07, h08, h09, h10, h11, h12, h13, h14, h15, h16, h17, h18, h19, h20, h21, h22, h23, h24 FROM air
WHERE estacion = {} AND magnitud = {} AND ano = {} AND mes = {} AND dia = {}


--add unique constraints
ALTER TABLE users ADD CONSTRAINT unique_constraint UNIQUE (email, username);

--drop not null constraint
alter table datacollected alter column name drop not null;