const AddCommentUseCase = require('../AddCommentUseCase');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const NewComment = require('../../../Domains/comments/entities/NewComment');

describe('AddCommentUseCase', () => {
  it('should orchestrate the add comment action correctly', async () => {
    const useCasePayload = { content: 'A comment', threadId: 'thread-123' };
    const owner = 'user-123';
    const expectedComment = { id: 'comment-123', content: useCasePayload.content, owner };
    
    const mockCommentRepository = new CommentRepository();
    mockCommentRepository.addComment = jest.fn().mockResolvedValue(expectedComment);
    
    const addCommentUseCase = new AddCommentUseCase({ commentRepository: mockCommentRepository });
    const addedComment = await addCommentUseCase.execute(useCasePayload, owner);
    
    expect(mockCommentRepository.addComment).toBeCalledWith(new NewComment({ ...useCasePayload, owner }));
    expect(addedComment).toEqual(expectedComment);
  });
});