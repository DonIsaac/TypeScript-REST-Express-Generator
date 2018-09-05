import dotenv from 'dotenv';
import fs from 'fs';
import logger from '../util/logger';

/**
 * Allows for easy logging while assigning a default value.
 * @param msg The message to display when the default value is used
 * @param val The default value
 */
function defaultVal(msg: string, val: any) {
    logger.warn(msg);
    return val;
}

// Load in the environment variables into the application.

if (fs.existsSync('.env')) {
    logger.debug('Using .env file to supply config environment variables');
    dotenv.config({ path: '.env' });
} else if (fs.existsSync('.env.example')) {
    logger.debug('Using .env.example file to supply config environment variables');
    dotenv.config({ path: '.env.example' });  // you can delete this after you create your own .env file!
} else {
    logger.error('No .env OR .env.example exists, aborting.');
    process.exit(1);
}

const doesCertExist = fs.existsSync('ssl/server.key') && fs.existsSync('ssl/server.crt');
let privateKey, certificate;

if (doesCertExist) {
    privateKey = fs.readFileSync('ssl/server.key', 'utf8');
    certificate = fs.readFileSync('ssl/server.crt', 'utf8');
    logger.log('info', certificate);
} else {
    privateKey = null;
    certificate = null;
}

// ==========================
// == SERVER CONFIGURATION ==
// ==========================

/**
 * Port to listen on for HTTP traffic.
 */
export const HTTP_PORT = 3000;

/**
 * Port to listen on for HTTPS traffic.
 */
export const HTTPS_PORT = 8443;

/**
 * Session expiration time, in seconds.
 */
export const EXP_TIME = 3600; // 1 hour

/**
 * The protocols to enable. Can be 'http', 'https', or 'both'.
 */
export const PROTOCOL = 'http';

/**
 * The environment the server is running in. Either 'production' or 'development'.
 */
export const ENVIRONMENT = process.env.NODE_ENV || 'development';
const prod = ENVIRONMENT === 'production'; // Anything else is treated as 'dev'

/**
 * Secret key used to encrypt session data.
 */
export const SESSION_SECRET = process.env['SESSION_SECRET'];

/**
 * The URI of the MongoDB database to connect to.
 */
export const MONGODB_URI = prod ? process.env['MONGODB_URI'] : process.env['MONGODB_URI_LOCAL'];

/**
 * SSL credentials for enabling HTTPS. If this is not set, then HTTPS cannot be used.
 */
export const SSL_CREDENTIALS = { key: privateKey, cert: certificate };

if (!SESSION_SECRET) {
    logger.error('No client secret. The SESSION_SECRET environment variable must be set. Aborting.');
    process.exit(1);
}

if (!MONGODB_URI) {
    logger.error('No mongo connection string. The MONGODB_URI environment variable must be set. Aborting.');
    process.exit(1);
}


