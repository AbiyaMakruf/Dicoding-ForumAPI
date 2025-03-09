const GetThreadDetailsUseCase = require('../GetThreadDetailsUseCase');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const Comment = require('../../../Domains/comments/entities/Comment'); // ✅ Import Comment Entity

describe('GetThreadDetailsUseCase', () => {
  it('should orchestrate the get thread details action correctly', async () => {
    const threadId = 'thread-123';

    const mockThreadData = {
      id: threadId,
      title: 'Thread Title',
      body: 'Thread Body',
      date: '2025-03-02T07:00:00.000Z',
      username: 'dicoding',
    };

    const mockCommentsData = [
      new Comment({
        id: 'comment-123',
        username: 'user1',
        date: '2025-03-02T07:10:00.000Z',
        content: 'A comment',
        is_deleted: false,
      }),
    ];

    const expectedThreadDetails = {
      ...mockThreadData,
      comments: mockCommentsData,
    };

    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    
    mockThreadRepository.getThreadById = jest.fn().mockResolvedValue(mockThreadData);

    mockCommentRepository.getCommentsByThreadId = jest.fn().mockResolvedValue(mockCommentsData);
    
    const getThreadDetailsUseCase = new GetThreadDetailsUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });
    
    const threadDetails = await getThreadDetailsUseCase.execute(threadId);
    
    expect(mockThreadRepository.getThreadById).toBeCalledWith(threadId);
    expect(mockCommentRepository.getCommentsByThreadId).toBeCalledWith(threadId);

    expect(threadDetails).toEqual(expectedThreadDetails);
  });
});
