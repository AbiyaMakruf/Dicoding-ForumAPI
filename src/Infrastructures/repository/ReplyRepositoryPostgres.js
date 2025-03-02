const ReplyRepository = require('../../Domains/replies/ReplyRepository');

class ReplyRepositoryPostgres extends ReplyRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addReply({ commentId, content, owner }) {
    const id = `reply-${this._idGenerator()}`;
    const createdAt = new Date().toISOString();

    const query = {
      text: `INSERT INTO replies (id, comment_id, content, owner, created_at)
             VALUES ($1, $2, $3, $4, $5) RETURNING id, content, owner`,
      values: [id, commentId, content, owner, createdAt],
    };

    const result = await this._pool.query(query);
    return result.rows[0];
  }
}

module.exports = ReplyRepositoryPostgres;
