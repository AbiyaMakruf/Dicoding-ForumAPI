class ThreadsHandler {
    constructor({ addThreadUseCase }) {
      this._addThreadUseCase = addThreadUseCase;
      this.postThreadHandler = this.postThreadHandler.bind(this);
    }
  
    async postThreadHandler(request, h) {
      const { id: owner } = request.auth.credentials;
      const addedThread = await this._addThreadUseCase.execute(request.payload, owner);
      
      const response = h.response({
        status: 'success',
        data: { addedThread },
      });
      response.code(201);
      return response;
    }

    async getThreadHandler(request, h) {
      const { threadId } = request.params;
      const thread = await this._getThreadDetailsUseCase.execute(threadId);
      
      return h.response({
        status: 'success',
        data: { thread },
      }).code(200);
    }
  }
  
  module.exports = ThreadsHandler;