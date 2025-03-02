const NewComment = require('../../Domains/comments/entities/NewComment');

class AddCommentUseCase {
  constructor({ commentRepository }) {
    this._commentRepository = commentRepository;
  }

  async execute(useCasePayload, owner) {
    const newComment = new NewComment({ ...useCasePayload, owner });
    return this._commentRepository.addComment(newComment);
  }
}

module.exports = AddCommentUseCase;