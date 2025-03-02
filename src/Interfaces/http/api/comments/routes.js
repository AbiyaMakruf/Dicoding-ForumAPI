// migrations/20240302130000_create-table-comments.js
exports.up = (pgm) => {
    pgm.createTable('comments', {
      id: {
        type: 'VARCHAR(50)',
        primaryKey: true,
      },
      content: {
        type: 'TEXT',
        notNull: true,
      },
      owner: {
        type: 'VARCHAR(50)',
        notNull: true,
        references: 'users(id)',
        onDelete: 'CASCADE',
      },
      thread_id: {
        type: 'VARCHAR(50)',
        notNull: true,
        references: 'threads(id)',
        onDelete: 'CASCADE',
      },
      created_at: {
        type: 'TIMESTAMP',
        notNull: true,
        default: pgm.func('CURRENT_TIMESTAMP'),
      },
    });
  };
  
  exports.down = (pgm) => {
    pgm.dropTable('comments');
  };
  
  // src/Interfaces/http/api/comments/handler.js
  class CommentsHandler {
    constructor({ addCommentUseCase }) {
      this._addCommentUseCase = addCommentUseCase;
      this.postCommentHandler = this.postCommentHandler.bind(this);
    }
  
    async postCommentHandler(request, h) {
      const { id: owner } = request.auth.credentials;
      const { threadId } = request.params;
      const addedComment = await this._addCommentUseCase.execute({ ...request.payload, threadId }, owner);
      
      const response = h.response({
        status: 'success',
        data: { addedComment },
      });
      response.code(201);
      return response;
    }
  }
  
  module.exports = CommentsHandler;
  
  // src/Interfaces/http/api/comments/routes.js
  const routes = (handler) => [
    {
      method: 'POST',
      path: '/threads/{threadId}/comments',
      handler: handler.postCommentHandler,
      options: {
        auth: 'forumapi_jwt',
      },
    },
  ];
  
  module.exports = routes;
  
  // src/Interfaces/http/api/comments/index.js
  const CommentsHandler = require('./handler');
  const routes = require('./routes');
  
  module.exports = {
    name: 'comments',
    register: async (server, { container }) => {
      const commentsHandler = new CommentsHandler({
        addCommentUseCase: container.getInstance(require('../../../Applications/use_case/AddCommentUseCase')),
      });
      server.route(routes(commentsHandler));
    },
  };
  
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
  