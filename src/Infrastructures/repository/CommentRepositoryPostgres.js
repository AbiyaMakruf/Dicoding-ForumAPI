const CommentRepository = require('../../Domains/comments/CommentRepository');

class CommentRepositoryPostgres extends CommentRepository {
  constructor(pool) {
    super();
    this._pool = pool;
  }

  async verifyCommentOwner(commentId, owner) {
    const query = {
      text: 'SELECT owner FROM comments WHERE id = $1',
      values: [commentId],
    };
    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new Error('COMMENT_REPOSITORY.COMMENT_NOT_FOUND');
    }
    if (result.rows[0].owner !== owner) {
      throw new Error('COMMENT_REPOSITORY.NOT_COMMENT_OWNER');
    }
  }

  async deleteComment(commentId) {
    const query = {
      text: 'UPDATE comments SET is_deleted = true WHERE id = $1',
      values: [commentId],
    };
    await this._pool.query(query);
  }

  async getCommentsByThreadId(threadId) {
    const query = {
      text: `SELECT comments.id, comments.content, comments.created_at AS date, users.username, comments.is_deleted
             FROM comments
             JOIN users ON users.id = comments.owner
             WHERE comments.thread_id = $1
             ORDER BY comments.created_at ASC`,
      values: [threadId],
    };
    
    const result = await this._pool.query(query);
    return result.rows.map((comment) => ({
      id: comment.id,
      username: comment.username,
      date: comment.date,
      content: comment.is_deleted ? '**komentar telah dihapus**' : comment.content,
    }));
  }
}

module.exports = CommentRepositoryPostgres;