const { Sequelize } = require('sequelize');
const config = require('./config');

const sequelize = new Sequelize(config.db.database, config.db.username, config.db.password, {
    host: config.db.host,
    dialect: config.db.dialect,
    logging: config.db.logging,
    pool: {
        ...config.db.pool,
    },
    schema: config.db.schema,
});

Sequelize.postgres.DECIMAL.parse = value => parseFloat(value);

module.exports = sequelize;