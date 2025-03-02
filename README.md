<!-- Cara Membuat User Postgres -->
1. Masuk ke PostgreSQL
Buka terminal dan masuk ke PostgreSQL sebagai user postgres:
sudo -u postgres psql

2. Buat User Baru
Gunakan perintah berikut untuk membuat user baru:
CREATE USER developer WITH PASSWORD 'supersecretpassword';

3. Beri Hak Akses ke User
ALTER USER nama_user WITH SUPERUSER;

4. Buat Database untuk User
CREATE DATABASE developer OWNER developer;

<!-- Cara Membuat Databases -->
1. Masuk ke PostgreSQL
psql -U developer

2. Buat Database Baru
CREATE DATABASE forumapi;
CREATE DATABASE forumapi_test;

<!-- Cara Migrate Databases -->
1. Create Migrate
npm run migrate create "create table users"
npm run migrate create "create table authentications"

2. Run Migrate
npm run migrate up
npm run migrate:test up