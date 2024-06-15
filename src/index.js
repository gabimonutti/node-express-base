const { LogError, LogInfo, LogSuccess } = require('./utils/logger');
try {
    const config = require('./config/config');
    const sequelize = require('./config/db.js');
    const app = require('./app');

    let server;

    sequelize.sync({ force: config.db.force })
        .then(() => sequelize.authenticate())
        .then(() => {
            server = app.listen(config.port, () => {
                LogSuccess(`[SERVER ON]: Running in ${config.url}:${config.port}/api`);
            });
        }).catch(err => LogError(err));

        const exitHandler = () => {
            if (server) {
                server.close(() => {
                    LogInfo('Server closed');
                    process.exit(1);
                });
            } else {
                process.exit(1);
            }
        };

        const unexpectedErrorHandler = (error) => {
            LogError(error);
            exitHandler();
        };

        process.on('uncaughtException', unexpectedErrorHandler);
        process.on('unhandledRejection', unexpectedErrorHandler);

        process.on('SIGTERM', () => {
            LogInfo('SIGTERM received');
            if (server) {
                server.close();
            }
        });
} catch (err) {
    LogError(err);
}