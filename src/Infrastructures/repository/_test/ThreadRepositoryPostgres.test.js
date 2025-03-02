const ThreadRepositoryPostgres = require('../ThreadRepositoryPostgres');
const pool = require('../../../Infrastructures/database/postgres/pool');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');

describe('ThreadRepositoryPostgres', () => {
  beforeEach(async () => {
    await UsersTableTestHelper.addUser({ id: 'user-123', username: 'dicoding', password: 'secret' });
  });

  afterEach(async () => {
    await pool.query('TRUNCATE TABLE threads CASCADE');
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  it('should persist new thread and return thread correctly', async () => {
    const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool);
    const newThread = { title: 'Thread Title', body: 'Thread Body', owner: 'user-123' };
    
    const addedThread = await threadRepositoryPostgres.addThread(newThread);
    expect(addedThread).toHaveProperty('id');
    expect(addedThread).toHaveProperty('title', newThread.title);
    expect(addedThread).toHaveProperty('owner', newThread.owner);
  });
});