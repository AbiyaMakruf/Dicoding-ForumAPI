const DeleteCommentUseCase = require('../DeleteCommentUseCase');
const CommentRepository = require('../../../Domains/comments/CommentRepository');

describe('DeleteCommentUseCase', () => {
  it('should orchestrate the delete comment action correctly', async () => {
    const useCasePayload = { commentId: 'comment-123', owner: 'user-123' };
    
    const mockCommentRepository = new CommentRepository();
    mockCommentRepository.verifyCommentOwner = jest.fn().mockResolvedValue();
    mockCommentRepository.deleteComment = jest.fn().mockResolvedValue();
    
    const deleteCommentUseCase = new DeleteCommentUseCase({ commentRepository: mockCommentRepository });
    await deleteCommentUseCase.execute(useCasePayload);
    
    expect(mockCommentRepository.verifyCommentOwner).toBeCalledWith(useCasePayload.commentId, useCasePayload.owner);
    expect(mockCommentRepository.deleteComment).toBeCalledWith(useCasePayload.commentId);
  });
});