class Comment {
  constructor(payload) {
    this._verifyPayload(payload);
    let { id, username, date, content, is_deleted } = payload;

    if (date instanceof Date) {
      date = date.toISOString();
    }

    this.id = id;
    this.username = username;
    this.date = date;
    this.content = is_deleted ? '**komentar telah dihapus**' : content;
  }

  _verifyPayload({ id, username, date, content, is_deleted }) {          
    if (!id || !username || !date || content === undefined || is_deleted === undefined) {
      throw new Error('COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
    }
  
    if (
      typeof id !== 'string' ||
      typeof username !== 'string' ||
      !(typeof date === 'string' || date instanceof Date) ||
      typeof content !== 'string' ||
      typeof is_deleted !== 'boolean'
    ) {
      throw new Error('COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = Comment;
