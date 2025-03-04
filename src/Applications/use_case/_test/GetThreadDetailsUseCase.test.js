const GetThreadDetailsUseCase = require('../GetThreadDetailsUseCase');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const CommentRepository = require('../../../Domains/comments/CommentRepository');

describe('GetThreadDetailsUseCase', () => {
  it('should orchestrate the get thread details action correctly', async () => {
    const threadId = 'thread-123';

    // 🔹 Data Netral yang Dikembalikan oleh Mock (Bukan Expected Value)
    const mockThreadData = {
      id: threadId,
      title: 'Thread Title',
      body: 'Thread Body',
      date: '2025-03-02T07:00:00.000Z',
      username: 'dicoding',
    };

    const mockCommentsData = [
      {
        id: 'comment-123',
        username: 'user1',
        date: '2025-03-02T07:10:00.000Z',
        content: 'A comment',
      },
    ];

    // 🔹 Expected Value Setelah Proses Use Case (Hasil Akhir yang Diharapkan)
    const expectedThreadDetails = {
      ...mockThreadData,
      comments: mockCommentsData,
    };

    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    
    mockThreadRepository.getThreadById = jest.fn().mockResolvedValue({
      id: threadId,
      title: 'Thread Title',
      body: 'Thread Body',
      date: '2025-03-02T07:00:00.000Z',
      username: 'dicoding',
    });

    mockCommentRepository.getCommentsByThreadId = jest.fn().mockResolvedValue([
      {
        id: 'comment-123',
        username: 'user1',
        date: '2025-03-02T07:10:00.000Z',
        content: 'A comment',
      },
    ]);
    
    const getThreadDetailsUseCase = new GetThreadDetailsUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });
    
    const threadDetails = await getThreadDetailsUseCase.execute(threadId);
    
    expect(mockThreadRepository.getThreadById).toBeCalledWith(threadId);
    expect(mockCommentRepository.getCommentsByThreadId).toBeCalledWith(threadId);

    // 🔹 Pastikan nilai hasil akhir sesuai dengan yang diharapkan
    expect(threadDetails).toEqual(expectedThreadDetails);
  });
});
