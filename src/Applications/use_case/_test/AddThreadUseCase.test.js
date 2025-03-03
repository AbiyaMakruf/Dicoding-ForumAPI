const AddThreadUseCase = require('../AddThreadUseCase');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const NewThread = require('../../../Domains/threads/entities/NewThread');

describe('AddThreadUseCase', () => {
  it('should orchestrate the add thread action correctly', async () => {
    const useCasePayload = { title: 'Thread Title', body: 'Thread Body' };
    const owner = 'user-123';
    
    const mockThreadRepository = new ThreadRepository();
    mockThreadRepository.addThread = jest.fn().mockResolvedValue({
      id: 'thread-abc',
      title: 'Thread Title',
      owner: 'user-123',
    });

    const addThreadUseCase = new AddThreadUseCase({ threadRepository: mockThreadRepository });
    const addedThread = await addThreadUseCase.execute(useCasePayload, owner);
    
    expect(mockThreadRepository.addThread).toBeCalledWith(new NewThread({ ...useCasePayload, owner }));
    expect(addedThread).toEqual({
      id: expect.any(String), // Menggunakan matcher untuk menghindari expected value
      title: useCasePayload.title,
      owner,
    });
  });
});
