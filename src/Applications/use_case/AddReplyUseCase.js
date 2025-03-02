const NewReply = require('../../Domains/replies/entities/NewReply');

class AddReplyUseCase {
  constructor({ replyRepository }) {
    this._replyRepository = replyRepository;
  }

  async execute(useCasePayload, owner) {
    const newReply = new NewReply({ ...useCasePayload, owner });
    return this._replyRepository.addReply(newReply);
  }
}

module.exports = AddReplyUseCase;
