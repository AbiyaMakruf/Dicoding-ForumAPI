const CommentRepository = require('../../Domains/comments/CommentRepository');
const { nanoid } = require('nanoid');

class CommentRepositoryPostgres extends CommentRepository {
  constructor(pool) {
    super();
    this._pool = pool;
  }

  async addComment(newComment) {
    const { content, owner, threadId } = newComment;
    const id = `comment-${nanoid(16)}`;
    const created_at = new Date().toISOString();
    const query = {
      text: 'INSERT INTO comments (id, content, owner, thread_id, created_at) VALUES($1, $2, $3, $4, $5) RETURNING id, content, owner',
      values: [id, content, owner, threadId, created_at],
    };
    
    const result = await this._pool.query(query);
    return result.rows[0];
  }
}

module.exports = CommentRepositoryPostgres;