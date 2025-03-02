const CommentsHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'comments',
  register: async (server, { container }) => {
    const commentsHandler = new CommentsHandler({
      addCommentUseCase: container.getInstance(require('../../../Applications/use_case/AddCommentUseCase')),
    });
    server.route(routes(commentsHandler));
  },
};