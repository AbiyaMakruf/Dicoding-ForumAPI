const CommentRepositoryPostgres = require('../CommentRepositoryPostgres');
const pool = require('../../../Infrastructures/database/postgres/pool');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');

describe('CommentRepositoryPostgres', () => {
  beforeEach(async () => {
    await UsersTableTestHelper.addUser({ id: 'user-123', username: 'dicoding', password: 'secret' });
    await ThreadsTableTestHelper.addThread({ id: 'thread-123', title: 'Thread Title', body: 'Thread Body', owner: 'user-123' });
  });

  afterEach(async () => {
    await pool.query('TRUNCATE TABLE comments CASCADE');
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  it('should persist new comment and return comment correctly', async () => {
    const commentRepositoryPostgres = new CommentRepositoryPostgres(pool);
    const newComment = { content: 'A comment', owner: 'user-123', threadId: 'thread-123' };
    
    const addedComment = await commentRepositoryPostgres.addComment(newComment);
    expect(addedComment).toHaveProperty('id');
    expect(addedComment).toHaveProperty('content', newComment.content);
    expect(addedComment).toHaveProperty('owner', newComment.owner);
  });
});