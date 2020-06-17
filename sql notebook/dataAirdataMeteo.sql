--medao cuenta que no habia decimales en tablas
--motivo: la importacion desde dbf.
--solucion: creo las tblas e copio los csv´s.
CREATE TABLE airdata (
id SERIAL NOT NULL PRIMARY KEY,
estacion integer,
estacion_desc VARCHAR(100),
magnitud integer,
magnitud_desc VARCHAR(100),
punto_mues VARCHAR(100),
ano integer,
mes integer,
dia integer,
h01 real,
h02 real,
h03 real,
h04 real,
h05 real,
h06 real,
h07 real,
h08 real,
h09 real,
h10 real,
h11 real,
h12 real,
h13 real,
h14 real,
h15 real,
h16 real,
h17 real,
h18 real,
h19 real,
h20 real,
h21 real,
h22 real,
h23 real,
h24 real
);

COPY airdata(estacion, estacion_desc, magnitud, magnitud_desc, punto_mues, ano, mes, dia, h01, h02, h03, h04, h05, h06, h07, h08, h09, h10, h11, h12, h13, h14, h15, h16, h17, h18, h19, h20, h21, h22, h23, h24)
FROM 'C:\Users\hugoh\Documents\boream\my_idea\datos.madrid\calidad aire\horario\merged\air.csv' DELIMITER ';' CSV HEADER;

CREATE TABLE meteodata (
id SERIAL NOT NULL PRIMARY KEY,
estacion integer,
estacion_desc VARCHAR(100),
magnitud integer,
magnitud_desc VARCHAR(100),
punto_mues VARCHAR(100),
ano integer,
mes integer,
dia integer,
h01 real,
h02 real,
h03 real,
h04 real,
h05 real,
h06 real,
h07 real,
h08 real,
h09 real,
h10 real,
h11 real,
h12 real,
h13 real,
h14 real,
h15 real,
h16 real,
h17 real,
h18 real,
h19 real,
h20 real,
h21 real,
h22 real,
h23 real,
h24 real
);

COPY meteodata(estacion, estacion_desc, magnitud, magnitud_desc, punto_mues, ano, mes, dia, h01, h02, h03, h04, h05, h06, h07, h08, h09, h10, h11, h12, h13, h14, h15, h16, h17, h18, h19, h20, h21, h22, h23, h24)
FROM 'C:\Users\hugoh\Documents\boream\my_idea\datos.madrid\meteo\horario\merged\meteo.csv' DELIMITER ';' CSV HEADER;


CREATE TABLE airmagnitudes (
id SERIAL NOT NULL,
magnitud integer PRIMARY KEY,
magnitud_desc VARCHAR(100),
formula VARCHAR(100),
u_medida VARCHAR(100)
)

COPY airmagnitudes(magnitud, magnitud_desc, formula,u_medida)
FROM 'C:\Users\hugoh\Documents\boream\my_idea\datos.madrid\calidad aire\horario\merged\airmagnitudes.csv' DELIMITER ';' CSV HEADER;

CREATE TABLE meteomagnitudes (
id SERIAL NOT NULL,
magnitud integer PRIMARY KEY,
magnitud_desc VARCHAR(100),
u_medida VARCHAR(100)
)

COPY meteomagnitudes(magnitud, magnitud_desc, u_medida)
FROM 'C:\Users\hugoh\Documents\boream\my_idea\datos.madrid\meteo\horario\merged\meteomagnitudes.csv' DELIMITER ';' CSV HEADER;


--nueva definición de foreign keys en tabla hija airdata y meteodata
ALTER TABLE airdata
ADD CONSTRAINT magnitud_id FOREIGN KEY (magnitud) REFERENCES airmagnitudes (magnitud)

ALTER TABLE airdata
ADD CONSTRAINT estacion_id FOREIGN KEY (estacion) REFERENCES airstations (codigo_cor)

ALTER TABLE meteodata
ADD CONSTRAINT magnitud_id FOREIGN KEY (magnitud) REFERENCES meteomagnitudes (magnitud)

ALTER TABLE meteodata
ADD CONSTRAINT estacion_id FOREIGN KEY (estacion) REFERENCES meteostations (codigo_cor)


select h01, h02, h03, h02, h03, h04, h05, h06, h07, h08, h09, h10, h11, h12, h13, h14, h15, h16, h17, h18, h19, h20, h21, h22, h23, h24 from meteodata where (estacion = 39 AND magnitud = 86 AND ano = 2019 and dia = 4 and mes = 12);

UPDATE meteostations_2
SET temperatura = ''
WHERE temperatura IS NULL;