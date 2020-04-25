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
