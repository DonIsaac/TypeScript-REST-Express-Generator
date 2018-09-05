import express from 'express';
import bodyParser from 'body-parser';
import session from "express-session";
import compression from 'compression';
import bluebird from 'bluebird';
import mongoose from 'mongoose';
import morgan from 'morgan';
import { stream } from './util/logger';
import router from './routes';

// import { PORT, PROTOCOL } from './config/sys-config/app.config';
// import { MONGODB_URI } from './config/sys-config/secrets.config';
import { HTTP_PORT, HTTPS_PORT, PROTOCOL, MONGODB_URI, SESSION_SECRET } from './config/config';

const app = express();

mongoose.Promise = global.Promise = bluebird;

mongoose.connect(MONGODB_URI, { useNewUrlParser: true }).then(
    () => { console.log('Connected to MongoDB'); },
  ).catch(err => {
    console.log('MongoDB connection error. Please make sure MongoDB is running. ' + err);
    process.exit(1);
  });

app.use(morgan('combined', {'stream': stream}));
app.use(compression());
app.use(session({
  resave: true,
  saveUninitialized: true,
  secret: SESSION_SECRET
}));
app.use(bodyParser.json());
app.use('/', router);
app.disable('x-powered-by');
app.set('http-port', HTTP_PORT);
app.set('https-port', HTTPS_PORT);
app.set('protocol', PROTOCOL);

export default app;