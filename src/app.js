const express = require("express");
const cors = require('cors');
const helmet = require("helmet");
const { errorConverter, errorHandler } = require("./middlewares/error");
const ApiError = require("./errors/ApiError");
const httpStatus = require("http-status");
const rootRouter = require('./routes')


const app = express();

app.use(helmet());
app.use(cors());
app.options('*', cors());

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use('/api', rootRouter);

// send back a 404 error for any unknown api request
app.use((req, res, next) => {
    next(new ApiError(httpStatus.NOT_FOUND, 'Not found'));
});

app.use(errorConverter);
app.use(errorHandler);

module.exports = app;