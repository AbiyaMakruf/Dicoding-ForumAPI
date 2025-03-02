const NewComment = require('../../Domains/comments/entities/NewComment');

class AddCommentUseCase {
  constructor({ threadRepository, commentRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
  }

  async execute(useCasePayload, owner) {
    const { threadId } = useCasePayload;
    const newComment = new NewComment({ ...useCasePayload, owner });
  
    await this._threadRepository.verifyThreadExists(threadId);
    return this._commentRepository.addComment(newComment);
  }
}

module.exports = AddCommentUseCase;
