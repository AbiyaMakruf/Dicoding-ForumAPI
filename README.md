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

<!-- Cara Membuat Struktur Proyek -->
tree /F /A > struktur_proyek.txt


<!-- Temporary -->
// src/Interfaces/http/api/threads/_test/threads.test.js
const pool = require('../../../../Infrastructures/database/postgres/pool');
const createServer = require('../../../../Infrastructures/http/createServer');
const container = require('../../../../Infrastructures/container');
const AuthenticationTestHelper = require('../../../../tests/AuthenticationsTableTestHelper');
const UsersTestHelper = require('../../../../tests/UsersTableTestHelper');
const bcrypt = require('bcrypt');
const Jwt = require('@hapi/jwt');

describe('/threads endpoint', () => {
  let server;
  beforeAll(async () => {
    server = await createServer(container);
  });

  afterEach(async () => {
    await pool.query('TRUNCATE TABLE threads CASCADE');
    await AuthenticationTestHelper.cleanTable();
    await UsersTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  it('should response 201 and persist thread', async () => {
    // Arrange: Add a user and get access token
    const password = await bcrypt.hash('secret', 10);
    await UsersTestHelper.addUser({ id: 'user-123', username: 'dicoding', password });
    const accessToken = Jwt.token.generate(
      { id: 'user-123', username: 'dicoding' },
      process.env.ACCESS_TOKEN_KEY
    );
    await AuthenticationTestHelper.addToken(accessToken);
    
    const requestPayload = { title: 'Thread Title', body: 'Thread Body' };
    
    const response = await server.inject({
      method: 'POST',
      url: '/threads',
      payload: requestPayload,
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    
    const responseJson = JSON.parse(response.payload);
    expect(response.statusCode).toEqual(201);
    expect(responseJson.status).toEqual('success');
    expect(responseJson.data.addedThread).toHaveProperty('id');
    expect(responseJson.data.addedThread.title).toEqual(requestPayload.title);
  });
});

<!-- Temporary -->
// src/Interfaces/http/api/comments/_test/comments.test.js
const pool = require('../../../../Infrastructures/database/postgres/pool');
const createServer = require('../../../../Infrastructures/http/createServer');
const container = require('../../../../Infrastructures/container');
const AuthenticationTestHelper = require('../../../../tests/AuthenticationsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const bcrypt = require('bcrypt');
const Jwt = require('@hapi/jwt');

describe('/threads/{threadId}/comments endpoint', () => {
  let server;
  beforeAll(async () => {
    server = await createServer(container);
  });

  afterEach(async () => {
    await pool.query('TRUNCATE TABLE comments CASCADE');
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
    await AuthenticationTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  it('should response 201 and persist comment', async () => {
    const password = await bcrypt.hash('secret', 10);
    await UsersTableTestHelper.addUser({ id: 'user-123', username: 'dicoding', password });
    const accessToken = Jwt.token.generate(
      { id: 'user-123', username: 'dicoding' },
      process.env.ACCESS_TOKEN_KEY
    );
    await AuthenticationTestHelper.addToken(accessToken);
    await ThreadsTableTestHelper.addThread({ id: 'thread-123', title: 'Thread Title', body: 'Thread Body', owner: 'user-123' });
    
    const requestPayload = { content: 'A comment' };
    
    const response = await server.inject({
      method: 'POST',
      url: '/threads/thread-123/comments',
      payload: requestPayload,
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    
    const responseJson = JSON.parse(response.payload);
    expect(response.statusCode).toEqual(201);
    expect(responseJson.status).toEqual('success');
    expect(responseJson.data.addedComment).toHaveProperty('id');
    expect(responseJson.data.addedComment.content).toEqual(requestPayload.content);
  });
});