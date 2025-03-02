class CommentsHandler {
  constructor({ deleteCommentUseCase }) {
    this._deleteCommentUseCase = deleteCommentUseCase;
    this.deleteCommentHandler = this.deleteCommentHandler.bind(this);
  }

  async deleteCommentHandler(request, h) {
    const { id: owner } = request.auth.credentials;
    const { threadId, commentId } = request.params;
    
    await this._deleteCommentUseCase.execute({ commentId, owner });
    
    return h.response({ status: 'success' }).code(200);
  }
}

module.exports = CommentsHandler;