const httpStatus = require('http-status');
const ApiError = require('../errors/ApiError');
const ServiceError = require('../errors/ServiceError');
const { LogError } = require('../utils/logger');
const config = require('../config/config');

const serviceCodeToHttpCode = (serviceCode) => {
    return serviceCode.toString().substr(1);
};

const errorConverter = (err, req, res, next) => {
    let error = err;
    if (error instanceof ServiceError) {
        error.statusCode = serviceCodeToHttpCode(error.code);
    }
    if (!(error instanceof ApiError)) {
        const statusCode = error.statusCode || httpStatus.INTERNAL_SERVER_ERROR;
        const message = error.message || httpStatus[statusCode];
        const details = error.details || '';
        error = new ApiError(statusCode, message, details, false, err.stack);
    }
    next(error);
};

const errorHandler = (err, req, res, next) => {
    let { statusCode, message } = err;
    if (config.env === 'production' && !err.isOperational) {
        statusCode = httpStatus.INTERNAL_SERVER_ERROR;
        message = httpStatus[httpStatus.INTERNAL_SERVER_ERROR];
    }

    res.locals.errorMessage = err.message;

    const response = {
        code: statusCode,
        message: message,
        ...(err.details && {
            details: err.details.map(e => ({
                code: e.code,
                name: e.name,
                message: e.message
            }))
        }),
        ...(config.env === 'development' && { stack: err.stack }),
    };

    if (config.env === 'development') {
        LogError(err);
    }

    res.status(statusCode).send(response);
};

module.exports = {
    errorConverter,
    errorHandler,
};