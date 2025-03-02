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

  it('should delete a comment correctly', async () => {
    const commentRepositoryPostgres = new CommentRepositoryPostgres(pool);
    await commentRepositoryPostgres.deleteComment('comment-123');
    const comments = await CommentsTableTestHelper.findCommentById('comment-123');
    expect(comments[0].is_deleted).toBe(true);
  });

  it('should get comments by thread id correctly', async () => {
    const commentRepositoryPostgres = new CommentRepositoryPostgres(pool);
    const comments = await commentRepositoryPostgres.getCommentsByThreadId('thread-123');
    expect(comments).toHaveLength(1);
    expect(comments[0].id).toEqual('comment-123');
    expect(comments[0].username).toEqual('dicoding');
    expect(comments[0].content).toEqual('A comment');
  });

  it('should throw error when comment owner is not valid', async () => {
    // Arrange
    const commentRepositoryPostgres = new CommentRepositoryPostgres(pool);
    await expect(commentRepositoryPostgres.verifyCommentOwner('comment-123', 'wrong-user'))
      .rejects.toThrowError('COMMENT_REPOSITORY.NOT_COMMENT_OWNER');
  });

  it('should return empty array if thread has no comments', async () => {
    // Arrange
    const commentRepositoryPostgres = new CommentRepositoryPostgres(pool);
    // Act
    const comments = await commentRepositoryPostgres.getCommentsByThreadId('thread-not-exist');
    // Assert
    expect(comments).toEqual([]);
  });

  it('should throw error when comment is not found', async () => {
    // Arrange
    const commentRepositoryPostgres = new CommentRepositoryPostgres(pool);
    
    // Act & Assert
    await expect(commentRepositoryPostgres.verifyCommentOwner('comment-not-exist', 'user-123'))
      .rejects.toThrowError('COMMENT_REPOSITORY.COMMENT_NOT_FOUND');
  });

  it('should throw error when owner is not valid', async () => {
    // Arrange: Gunakan ID unik
    const uniqueCommentId = `comment-${new Date().getTime()}`;
    await CommentsTableTestHelper.addComment({
      id: uniqueCommentId,
      content: 'Another comment',
      owner: 'user-123',
      threadId: 'thread-123',
    });

    const commentRepositoryPostgres = new CommentRepositoryPostgres(pool);
    
    // Act & Assert
    await expect(commentRepositoryPostgres.verifyCommentOwner(uniqueCommentId, 'wrong-user'))
      .rejects.toThrowError('COMMENT_REPOSITORY.NOT_COMMENT_OWNER');
  });

  it('should return "**komentar telah dihapus**" if comment is deleted', async () => {
    // Arrange: Tambah komentar baru
    const uniqueCommentId = `comment-${new Date().getTime()}`;
    await CommentsTableTestHelper.addComment({
      id: uniqueCommentId,
      content: 'This comment will be deleted',
      owner: 'user-123',
      threadId: 'thread-123',
    });
  
    const commentRepositoryPostgres = new CommentRepositoryPostgres(pool);
    
    // Act: Hapus komentar
    await commentRepositoryPostgres.deleteComment(uniqueCommentId);
    const comments = await commentRepositoryPostgres.getCommentsByThreadId('thread-123');
  
    // Assert
    expect(comments).toHaveLength(2); // 1 komentar lama + 1 komentar yang baru dihapus
    expect(comments.find(c => c.id === uniqueCommentId).content).toEqual('**komentar telah dihapus**');
  });

  it('should not throw error when owner is valid', async () => {
    // Arrange: Gunakan komentar yang sudah ada
    const commentRepositoryPostgres = new CommentRepositoryPostgres(pool);
  
    // Act & Assert: Tidak boleh melempar error
    await expect(commentRepositoryPostgres.verifyCommentOwner('comment-123', 'user-123'))
      .resolves.not.toThrow();
  });
  

});
