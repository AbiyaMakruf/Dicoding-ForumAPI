const pool = require('../../../Infrastructures/database/postgres/pool');
const createServer = require('../../../Infrastructures/http/createServer');
const container = require('../../../Infrastructures/container');
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