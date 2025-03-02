const GetThreadDetailsUseCase = require('../GetThreadDetailsUseCase');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const CommentRepository = require('../../../Domains/comments/CommentRepository');

describe('GetThreadDetailsUseCase', () => {
  it('should orchestrate the get thread details action correctly', async () => {
    const threadId = 'thread-123';
    const expectedThread = {
      id: 'thread-123',
      title: 'Thread Title',
      body: 'Thread Body',
      date: '2025-03-02T07:00:00.000Z',
      username: 'dicoding',
      comments: [
        {
          id: 'comment-123',
          username: 'user1',
          date: '2025-03-02T07:10:00.000Z',
          content: 'A comment',
        },
      ],
    };

    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    
    mockThreadRepository.getThreadById = jest.fn().mockResolvedValue(expectedThread);
    mockCommentRepository.getCommentsByThreadId = jest.fn().mockResolvedValue(expectedThread.comments);
    
    const getThreadDetailsUseCase = new GetThreadDetailsUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });
    
    const threadDetails = await getThreadDetailsUseCase.execute(threadId);
    
    expect(mockThreadRepository.getThreadById).toBeCalledWith(threadId);
    expect(mockCommentRepository.getCommentsByThreadId).toBeCalledWith(threadId);
    expect(threadDetails).toEqual(expectedThread);
  });
});