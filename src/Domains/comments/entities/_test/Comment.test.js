const Comment = require('../Comment');

describe('Comment Entity', () => {
  it('should throw error when payload does not contain needed property', () => {
    expect(() => new Comment({ id: 'comment-123', username: 'dicoding' }))
      .toThrowError('COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload does not meet data type specification', () => {
    expect(() => new Comment({ id: 123, username: 'dicoding', date: '2025-03-03', content: 'Hello', is_deleted: 'false' }))
      .toThrowError('COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create comment object correctly when comment is not deleted', () => {
    const payload = {
      id: 'comment-123',
      username: 'dicoding',
      date: '2025-03-03T16:47:33.136Z',
      content: 'Hello world!',
      is_deleted: false,
    };

    const comment = new Comment(payload);

    expect(comment).toEqual({
      id: 'comment-123',
      username: 'dicoding',
      date: '2025-03-03T16:47:33.136Z',
      content: 'Hello world!',
    });
  });

  it('should return "**komentar telah dihapus**" when comment is deleted', () => {
    const payload = {
      id: 'comment-123',
      username: 'dicoding',
      date: '2025-03-03T16:47:33.136Z',
      content: 'Hello world!',
      is_deleted: true,
    };

    const comment = new Comment(payload);

    expect(comment).toEqual({
      id: 'comment-123',
      username: 'dicoding',
      date: '2025-03-03T16:47:33.136Z',
      content: '**komentar telah dihapus**',
    });
  });

  it('should convert date to ISO string if given as a Date object', () => {
    const payload = {
      id: 'comment-123',
      username: 'dicoding',
      date: new Date('2025-03-03T16:47:33.136Z'),
      content: 'Hello world!',
      is_deleted: false,
    };
  
    const comment = new Comment(payload);
  
    expect(comment).toEqual({
      id: 'comment-123',
      username: 'dicoding',
      date: '2025-03-03T16:47:33.136Z',
      content: 'Hello world!',
    });
  });
  
});
