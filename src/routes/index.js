const express = require('express');
const { LogInfo } = require('../utils/logger');

const rootRouter = express.Router();

rootRouter.get('/', (req, res) => {
    LogInfo(`GET: ${config.url}:${config.port}/api`)

    res.send('Welcome to API: Restful Express');
});

rootRouter.use('/', rootRouter);
// add your router redirections
// for example
// server.use('/users', userRouter);

module.exports = rootRouter;