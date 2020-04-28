postgres=# CREATE ROLE adminairqua WITH LOGIN PASSWORD 'myairqua';
CREATE ROLE
postgres=# ALTER ROLE adminairqua CREATEDB;
ALTER ROLE
postgres=# \q

$ psql -d postgres -U adminairqua
Password for user adminairqua:
psql (10.8, server 12.0)
WARNING: psql major version 10, server major version 12.
         Some psql features might not work.
WARNING: Console code page (437) differs from Windows code page (1252)
         8-bit characters might not work correctly. See psql reference
         page "Notes for Windows users" for details.
Type "help" for help.

postgres=> CREATE DATABASE airquapg;
CREATE DATABASE
postgres=> \c airquapg
psql (10.8, server 12.0)
WARNING: psql major version 10, server major version 12.
         Some psql features might not work.
WARNING: Console code page (437) differs from Windows code page (1252)
         8-bit characters might not work correctly. See psql reference
         page "Notes for Windows users" for details.
You are now connected to database "airquapg" as user "adminairqua".

airquapg=>

Ahora voy a importar tablas de Madrid ayto a través de postgres dbf loader. Puede que los campos de lon y lat que utilizaré no sean adecuados como data type “charácter varying” y haya que pasarlos a real o double precisión. Pero de momento se quedan así. Otra opción sería pasarlos a postgis: insert into your_table (geog) values ('SRID=4326;POINT(longitude latitude)');


Como estaban feos los campos:
CREATE TABLE airstations AS

SELECT gid, codigo, codigo_cor, estacion, direccion, longitud_e as lon_geogra, latitud_et as lat_geogra, altitud, no2, so2, co, pm10, pm2_5, o3, btx, hc, cod_via, via_clase, via_par, via_nombre, coordenada as coor_x, coordenad2 as coor_y, longitud, latitud
FROM informacion_estaciones_red_calidad_aire;



CREATE TABLE meteostations AS

SELECT gid, c_digo as codigo, c_digo_cor as codigo_cor, estaci_n as estacion, direcci_n as direccion, longitud_e as lon_geogra, latitud_et as lat_geogra, altitud, vv__81_ as v_viento, dv__82_ as dir_viento, t__83_ as temperatura, hr__86_ as hum_rel, pb__87_ as presion, rs__88_ as rad_solar, p__89_ as precipitacion, cod_via, via_clase, via_par, via_nombre, coordenada as coor_x, coordenad2 as coor_y, longitud, latitud
FROM estaciones_control_datos_meteorologicos;


He cambiado el tipo de campo de char var a decimal esperando que luego al hacer: airquapg=# insert into airstations (the_geom) values ('SRID=4326;POINT(longitud latitud)') me crease el campo postgis con las coordenadas de los puntos pero no sale. 

airquapg=# alter table airstations alter column latitud type dec using latitud::decimal(10,6);

airquapg=# alter table airstations alter column longitud type dec using longitud::decimal(10,6);


airquapg=> ALTER TABLE airstations ADD COLUMN longitud_char varchar(12);
ALTER TABLE
airquapg=> ALTER TABLE airstations ADD COLUMN latitud_char varchar(12);
ALTER TABLE
