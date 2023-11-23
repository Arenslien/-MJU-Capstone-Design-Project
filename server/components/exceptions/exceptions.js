class BadRequestError extends Error {
    constructor(message) {
      super(message);
      this.message = message;
    }
}

BadRequestError.prototype.name = 'BadRequestError';
module.exports = BadRequestError;