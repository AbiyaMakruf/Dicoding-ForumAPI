const ThreadRepository = require('../ThreadRepository');

describe('ThreadRepository interface', () => {
  it('should throw error when invoke unimplemented method', async () => {
    const threadRepository = new ThreadRepository();
    await expect(threadRepository.addThread({})).rejects.toThrowError('THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  });
});

describe('ThreadRepository interface', () => {
  it('should throw error when invoking unimplemented methods', async () => {
    const threadRepository = new ThreadRepository();
    await expect(threadRepository.getThreadById('thread-123')).rejects.toThrowError('THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  });
});