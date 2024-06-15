const dotenv = require ('dotenv');
const path = require ('path');
const Joi = require('joi');

dotenv.config({ path: path.join(__dirname, '../../.env') });

const envVarsSchema = Joi.object()
    .keys({
        // add the proper schema for each env var
        // for example
        NODE_ENV: Joi.string().valid('production', 'development', 'test').required(),
        URL: Joi.string().required(),
        PORT: Joi.number().default(3000),
        
        DB_USERNAME: Joi.string().required(),
        DB_PASSWORD: Joi.string().required(),
        DB_DATABASE: Joi.string().required(),
        DB_SCHEMA: Joi.string().default('public'),
        DB_HOST: Joi.string().default('127.0.0.1'),
        DB_FORCE: Joi.boolean().default(false),
        DB_DIALECT: Joi.string().required(),
        DB_LOGGING: Joi.boolean().default(false),
    })
    .unknown();

const { value: envVars, error } = envVarsSchema.prefs({ errors: { label: 'key' } }).validate(process.env);

if (error) {
    throw new Error(`Config validation error: ${error.message}`);
}

const isProd = envVars.NODE_ENV === 'production';

const config = {
    isProd,
    // add your variables here
    // for example
    env: envVars.NODE_ENV,
    url: envVars.URL,
    port: envVars.PORT || 3000,
    db: {
        username: envVars.DB_USERNAME,
        password: envVars.DB_PASSWORD,
        database: envVars.DB_DATABASE,
        schema: envVars.DB_SCHEMA,
        host: envVars.DB_HOST,
        force: !isProd && envVars.DB_FORCE,
        dialect: envVars.DB_DIALECT,
        logging: envVars.DB_LOGGING && console.log,
        pool: {
            maxConnectionPool: envVars.DB_MAX_CONNECTION_POOL,
            minConnectionPool: envVars.DB_MIN_CONNECTION_POOL,
            poolIdle: envVars.DB_POOL_IDLE,
            poolAcquire: envVars.DB_POOL_ACQUIRE,
        },
    },
}

module.exports = config;
