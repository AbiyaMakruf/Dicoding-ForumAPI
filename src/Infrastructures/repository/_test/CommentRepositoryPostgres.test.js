const CommentRepositoryPostgres = require('../CommentRepositoryPostgres');
const pool = require('../../../Infrastructures/database/postgres/pool');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');

describe('CommentRepositoryPostgres', () => {
  beforeEach(async () => {
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();

    await UsersTableTestHelper.addUser({ id: 'user-123', username: 'dicoding', password: 'secret' });
    await ThreadsTableTestHelper.addThread({ id: 'thread-123', title: 'Thread Title', body: 'Thread Body', owner: 'user-123' });
    await CommentsTableTestHelper.addComment({ id: 'comment-123', content: 'A comment', owner: 'user-123', threadId: 'thread-123' });
  });

  afterEach(async () => {
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  it('should persist comment and return it correctly', async () => {
    const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, () => `123-${Date.now()}`);
    const newComment = {
      threadId: 'thread-123',
      content: 'New comment',
      owner: 'user-123',
    };

    const addedComment = await commentRepositoryPostgres.addComment(newComment);
    const comments = await CommentsTableTestHelper.findCommentById(addedComment.id);

    expect(addedComment).toBeDefined();
    expect(addedComment).toEqual({
      id: expect.any(String),
      content: newComment.content,
      owner: newComment.owner,
    });
    expect(comments).toHaveLength(1);
    expect(comments[0].content).toBe(newComment.content);
  });

  it('should delete a comment correctly', async () => {
    const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, () => `123-${Date.now()}`);
    await expect(commentRepositoryPostgres.deleteComment('comment-123')).resolves.not.toThrow();
    const comments = await CommentsTableTestHelper.findCommentById('comment-123');
    expect(comments[0].is_deleted).toBe(true);
  });

  it('should verify if comment exists', async () => {
    const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, () => `123-${Date.now()}`);
    await expect(commentRepositoryPostgres.verifyCommentExists('comment-123')).resolves.not.toThrowError();
    await expect(commentRepositoryPostgres.verifyCommentExists('comment-not-exist'))
      .rejects.toThrowError(new Error('COMMENT_REPOSITORY.COMMENT_NOT_FOUND'));
  });

  it('should verify comment owner correctly', async () => {
    const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, () => `123-${Date.now()}`);
    await expect(commentRepositoryPostgres.verifyCommentOwner('comment-123', 'user-123')).resolves.not.toThrow();
    await expect(commentRepositoryPostgres.verifyCommentOwner('comment-123', 'wrong-user'))
      .rejects.toThrowError(new Error('COMMENT_REPOSITORY.NOT_COMMENT_OWNER'));
  });

  it('should get comments by thread id correctly', async () => {
    const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, () => `123-${Date.now()}`);
    const comments = await commentRepositoryPostgres.getCommentsByThreadId('thread-123');

    expect(comments).toHaveLength(1);
    expect(comments[0].id).toEqual('comment-123');
    expect(comments[0].username).toEqual('dicoding');
    expect(comments[0].content).toEqual('A comment');
    expect(new Date(comments[0].date)).toBeInstanceOf(Date);
});


  it('should return "**komentar telah dihapus**" if comment is deleted', async () => {
    const uniqueCommentId = `comment-${Date.now()}`;
    await CommentsTableTestHelper.addComment({
      id: uniqueCommentId,
      content: 'This comment will be deleted',
      owner: 'user-123',
      threadId: 'thread-123',
    });

    const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, () => `123-${Date.now()}`);
    await commentRepositoryPostgres.deleteComment(uniqueCommentId);
    const comments = await commentRepositoryPostgres.getCommentsByThreadId('thread-123');

    expect(comments.find(c => c.id === uniqueCommentId).content).toEqual('**komentar telah dihapus**');
  });
});
