import { Router } from 'express';
import accountRouter from './account';
import sessionRouter from './session';
const routes = Router();

routes.use('/account', accountRouter);
routes.use('/session', sessionRouter);

export default routes;