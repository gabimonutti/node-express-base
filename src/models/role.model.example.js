const { Model, DataTypes, literal } = require('sequelize');
const modelFactory = require('./model.factory');

class Role extends Model { }

const fields = {
    id: {
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: literal('uuid_generate_v4()'),
    },
    code: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true,
        },
        unique: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true,
        },
        unique: true,
    },
};

const options = {};

modelFactory.init(Role, fields, options);

module.exports = Role;