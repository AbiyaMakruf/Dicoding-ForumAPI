const ThreadRepository = require('../../Domains/threads/ThreadRepository');
const { nanoid } = require('nanoid');

class ThreadRepositoryPostgres extends ThreadRepository {
  constructor(pool) {
    super();
    this._pool = pool;
  }

  async addThread(newThread) {
    const { title, body, owner } = newThread;
    const id = `thread-${nanoid(16)}`;
    const created_at = new Date().toISOString();
    const query = {
      text: 'INSERT INTO threads (id, title, body, owner, created_at) VALUES($1, $2, $3, $4, $5) RETURNING id, title, owner',
      values: [id, title, body, owner, created_at],
    };
    
    const result = await this._pool.query(query);
    return result.rows[0];
  }
}

module.exports = ThreadRepositoryPostgres;