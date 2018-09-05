import { createLogger, transports, format, Logger } from 'winston';
const { combine, timestamp, colorize, printf } = format;
import { StreamOptions } from 'morgan';
// import { ENVIRONMENT } from "./secrets";

/**
 * The system's logger object. This replaces console.log()
 */
const logger = createLogger({
    format: combine(
        timestamp(),
        colorize(),
        printf(info => `${info.timestamp} ${info.level}: ${info.message}`)
    ),
    transports: [
        new (transports.Console)({ level: process.env.NODE_ENV === 'production' ? 'error' : 'debug' }),
        new (transports.File)({ filename: 'debug.log', level: 'debug' }),
    ]
});

if (process.env.NODE_ENV !== 'production') {
    logger.debug('Logging initialized at debug level');
}

const stream: StreamOptions = {
    write: function (message) {
        logger.info(message);
    }
};

export { stream };
export default logger;


