const CommentRepository = require('../CommentRepository');

describe('CommentRepository interface', () => {
  it('should throw error when invoking unimplemented methods', async () => {
    const commentRepository = new CommentRepository();
    
    await expect(commentRepository.addComment({})).rejects.toThrowError('COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    await expect(commentRepository.verifyCommentOwner('comment-123', 'user-123')).rejects.toThrowError('COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    await expect(commentRepository.deleteComment('comment-123')).rejects.toThrowError('COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  });
});

describe('CommentRepository interface', () => {
  it('should throw error when invoking unimplemented methods', async () => {
    const commentRepository = new CommentRepository();
    await expect(commentRepository.getCommentsByThreadId('thread-123')).rejects.toThrowError('COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  });
});