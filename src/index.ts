import app from './app';
import http from 'http';
import https from 'https';
import logger from './util/logger';
import { SSL_CREDENTIALS } from './config/config';

// Invalid protocol value handling
if (app.get('protocol') !== 'http' && app.get('protocol') !== 'https' && app.get('protocol') !== 'both') {
    logger.log('error', 'Invalid value for PROTOCOL environment variable. Must be http, https or both.');
    process.exit(1);
}

// HTTP server setup
if (app.get('protocol') === 'http' || app.get('protocol') === 'both') {
    if (app.get('port') == 443) {
        logger.log('error', 'Cannot listen on port 443 when using the HTTP protocol. Either switch to a different port or use HTTPS.');
        process.exit(1);
    }

    const server = http.createServer(app);
    server.listen(app.get('http-port'), () => {
        logger.log('info', 'Express HTTP server is listening at port ' + app.get('http-port'));
    });

    server.on('error', function (err) {
        logger.error(err);
      });

}

// HTTPS server setup
if (app.get('protocol') === 'https' || app.get('protocol') === 'both') {
    if (app.get('port') == 80) {
        logger.log('error', 'Cannot listen on port 80 when using the HTTPS protocol. Either switch to a different port or use HTTP.');
        process.exit(1);
    }

    const server = https.createServer(SSL_CREDENTIALS, app);
    server.listen(app.get('https-port'), () => {
        logger.log('info', 'Express HTTPS server is listening at port ' + app.get('https-port'));
    });

    server.on('error', function (err) {
        logger.error(err);
      });

}
