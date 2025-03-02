class CommentsHandler {
    constructor({ addCommentUseCase }) {
      this._addCommentUseCase = addCommentUseCase;
      this.postCommentHandler = this.postCommentHandler.bind(this);
    }
  
    async postCommentHandler(request, h) {
      const { id: owner } = request.auth.credentials;
      const { threadId } = request.params;
      const addedComment = await this._addCommentUseCase.execute({ ...request.payload, threadId }, owner);
      
      const response = h.response({
        status: 'success',
        data: { addedComment },
      });
      response.code(201);
      return response;
    }
  }
  
  module.exports = CommentsHandler;