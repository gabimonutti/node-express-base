const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const init = (cls, fields, options = {}) => {
    fields = {
        ...fields,
        createdBy: {
            type: options.userRefDataType ?? DataTypes.STRING,
        },
        updatedBy: {
            type: options.userRefDataType ?? DataTypes.STRING,
        },
    };

    cls.init(fields, { sequelize, underscored: true, ...options });
    cls.prototype.hasOwner = () => false;
    cls.prototype.getOwnerId = () => null;
};

module.exports = {
    init,
};
