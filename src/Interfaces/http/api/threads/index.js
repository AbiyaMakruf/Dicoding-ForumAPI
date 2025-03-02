const ThreadsHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'threads',
  register: async (server, { container }) => {
    const threadsHandler = new ThreadsHandler({
      addThreadUseCase: container.getInstance(require('../../../Applications/use_case/AddThreadUseCase')),
    });
    server.route(routes(threadsHandler));
  },
};