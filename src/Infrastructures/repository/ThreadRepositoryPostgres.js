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

  async getThreadById(threadId) {
    const query = {
      text: `SELECT threads.id, threads.title, threads.body, threads.created_at AS date, users.username
             FROM threads
             JOIN users ON users.id = threads.owner
             WHERE threads.id = $1`,
      values: [threadId],
    };
    
    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new Error('THREAD_REPOSITORY.THREAD_NOT_FOUND');
    }
    return result.rows[0];
  }

  async verifyThreadExists(threadId) {
    const query = {
      text: 'SELECT id FROM threads WHERE id = $1',
      values: [threadId],
    };
    const result = await this._pool.query(query);
  
    if (!result.rowCount) {
      throw new Error('THREAD_REPOSITORY.THREAD_NOT_FOUND');
    }
  }
}

module.exports = ThreadRepositoryPostgres;