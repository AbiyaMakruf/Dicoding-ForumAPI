const CommentsHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'comments',
  register: async (server, { container }) => {
    const commentsHandler = new CommentsHandler({
      deleteCommentUseCase: container.getInstance(require('../../../Applications/use_case/DeleteCommentUseCase')),
    });
    server.route(routes(commentsHandler));
  },
};