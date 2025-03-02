const AddCommentUseCase = require('../AddCommentUseCase');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');

describe('AddCommentUseCase', () => {
  it('should orchestrate the add comment action correctly', async () => {
    const useCasePayload = { threadId: 'thread-123', content: 'A comment' };
    const owner = 'user-123';

    // Mock dependencies
    const mockThreadRepository = new ThreadRepository();
    mockThreadRepository.verifyThreadExists = jest.fn().mockResolvedValue();

    const mockCommentRepository = new CommentRepository();
    mockCommentRepository.addComment = jest.fn().mockResolvedValue({
      id: 'comment-123',
      content: 'A comment',
      owner,
    });

    const addCommentUseCase = new AddCommentUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });

    const addedComment = await addCommentUseCase.execute(useCasePayload, owner);

    expect(mockThreadRepository.verifyThreadExists).toBeCalledWith(useCasePayload.threadId);
    expect(mockCommentRepository.addComment).toBeCalledWith(expect.objectContaining({
      content: useCasePayload.content,
      owner,
    }));
    expect(addedComment).toEqual({
      id: 'comment-123',
      content: 'A comment',
      owner,
    });
  });
});
