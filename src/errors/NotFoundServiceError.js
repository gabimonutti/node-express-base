const ServiceError = require('./ServiceError');

class NotFoundServiceError extends ServiceError {
    constructor (message) {
        super({ type: message, code: 1404 });
    }
}

module.exports = NotFoundServiceError;
