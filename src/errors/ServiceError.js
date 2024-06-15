class ServiceError extends Error {
    constructor (error, isOperational = true) {
        super(error);
        this.date = new Date();
        this.details = [];
        this.isOperational = error.isOperational ?? isOperational;

        this.message = error.type || error.message || 'Unexpected error';
        this.code = Number(error.code) || 1500;
        if (error.details) {
            this.details = error.details;
        }
    }
}

module.exports = ServiceError;