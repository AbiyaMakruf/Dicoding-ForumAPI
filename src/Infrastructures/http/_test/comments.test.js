const pool = require('../../../Infrastructures/database/postgres/pool');
const createServer = require('../../../Infrastructures/http/createServer');
const container = require('../../../Infrastructures/container');
const AuthenticationTestHelper = require('../../../../tests/AuthenticationsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const bcrypt = require('bcrypt');
const Jwt = require('@hapi/jwt');

describe('/threads/{threadId}/comments/{commentId} endpoint', () => {
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

  it('should response 200 and delete comment', async () => {
    const password = await bcrypt.hash('secret', 10);
    await UsersTableTestHelper.addUser({ id: 'user-123', username: 'dicoding', password });
    const accessToken = Jwt.token.generate(
      { id: 'user-123', username: 'dicoding' },
      process.env.ACCESS_TOKEN_KEY
    );
    await AuthenticationTestHelper.addToken(accessToken);
    await ThreadsTableTestHelper.addThread({ id: 'thread-123', title: 'Thread Title', body: 'Thread Body', owner: 'user-123' });
    await CommentsTableTestHelper.addComment({ id: 'comment-123', content: 'A comment', owner: 'user-123', threadId: 'thread-123' });

    const response = await server.inject({
      method: 'DELETE',
      url: '/threads/thread-123/comments/comment-123',
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    
    expect(response.statusCode).toEqual(200);
    expect(JSON.parse(response.payload).status).toEqual('success');
  });

  it('should response 400 when request payload is invalid', async () => {
    const password = await bcrypt.hash('secret', 10);
    await UsersTableTestHelper.addUser({ id: 'user-123', username: 'dicoding', password });
    const accessToken = Jwt.token.generate(
      { id: 'user-123', username: 'dicoding' },
      process.env.ACCESS_TOKEN_KEY
    );
    await AuthenticationTestHelper.addToken(accessToken);
    await ThreadsTableTestHelper.addThread({ id: 'thread-123', title: 'Thread Title', body: 'Thread Body', owner: 'user-123' });
  
    const response = await server.inject({
      method: 'POST',
      url: '/threads/thread-123/comments',
      headers: { Authorization: `Bearer ${accessToken}` },
      payload: {}, // Payload kosong yang seharusnya gagal
    });
  
    expect(response.statusCode).toEqual(400);
    expect(JSON.parse(response.payload).status).toEqual('fail');
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
  
    const requestPayload = { content: 'This is a comment' };
  
    const response = await server.inject({
      method: 'POST',
      url: '/threads/thread-123/comments',
      headers: { Authorization: `Bearer ${accessToken}` },
      payload: requestPayload,
    });
  
    const responseJson = JSON.parse(response.payload);
  
    expect(response.statusCode).toEqual(201);
    expect(responseJson.status).toEqual('success');
    expect(responseJson.data.addedComment).toBeDefined();
    expect(responseJson.data.addedComment.id).toBeDefined();
    expect(responseJson.data.addedComment.content).toEqual(requestPayload.content);
  });

  it('should response 201 and persist reply to a comment', async () => {
    const password = await bcrypt.hash('secret', 10);
    await UsersTableTestHelper.addUser({ id: 'user-123', username: 'dicoding', password });
    const accessToken = Jwt.token.generate(
      { id: 'user-123', username: 'dicoding' },
      process.env.ACCESS_TOKEN_KEY
    );
    await AuthenticationTestHelper.addToken(accessToken);
    await ThreadsTableTestHelper.addThread({ id: 'thread-123', title: 'Thread Title', body: 'Thread Body', owner: 'user-123' });
    await CommentsTableTestHelper.addComment({ id: 'comment-123', content: 'A comment', owner: 'user-123', threadId: 'thread-123' });
  
    const requestPayload = { content: 'This is a reply' };
  
    const response = await server.inject({
      method: 'POST',
      url: '/threads/thread-123/comments/comment-123/replies',
      headers: { Authorization: `Bearer ${accessToken}` },
      payload: requestPayload,
    });
  
    const responseJson = JSON.parse(response.payload);
    expect(response.statusCode).toEqual(201);
    expect(responseJson.status).toEqual('success');
    expect(responseJson.data.addedReply).toBeDefined();
    expect(responseJson.data.addedReply.id).toBeDefined();
    expect(responseJson.data.addedReply.content).toEqual(requestPayload.content);
  });
  
  
});