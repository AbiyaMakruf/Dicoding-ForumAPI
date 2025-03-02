const NewThread = require('../NewThread');

describe('NewThread entity', () => {
  it('should throw error when payload does not contain needed property', () => {
    expect(() => new NewThread({ title: 'Thread title' })).toThrowError('NEW_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload does not meet data type specification', () => {
    expect(() => new NewThread({ title: 123, body: [], owner: {} })).toThrowError('NEW_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create NewThread object correctly', () => {
    const payload = { title: 'Thread title', body: 'Thread body', owner: 'user-123' };
    const newThread = new NewThread(payload);

    expect(newThread.title).toEqual(payload.title);
    expect(newThread.body).toEqual(payload.body);
    expect(newThread.owner).toEqual(payload.owner);
  });
});