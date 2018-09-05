import { Router, Request, Response } from 'express';
import User from '../../models/user';
import { asyncHandler, throwIf, throwError } from '../../util/error-handling';
import Boom from 'boom';
import { UserDocument } from '../../types/user';

const routes = Router();

routes.param('userId', asyncHandler(async function (req: Request, res: Response, next, value) {
    const user: UserDocument = await User.findById(value)
        .then(
            throwIf(r => !r, Boom.notFound("No user with the specified ID could be found")), // Throw an error if the user document doesn't exist
            throwError() // Throw an error if mongoose throws an error
        );
    req.user = user; // Attach the user document to the Request object
    next();
}));

routes.get('/:userId', asyncHandler(async function (req, res) {
    throwIf(() => !req.accepts('application/json'), Boom.notAcceptable('Client must be able to accept json'));
    // TODO: Add authorization logic
    res.status(200).json(req.user);
}));

/*
 * req.body:
 *  - email: string: The User's email
 *  - password: string: The User's password in plaintext.
 */
routes.post('/', asyncHandler(async function (req: Request, res: Response) {
    // Check to see if the client accepts json responses
    throwIf(() => !req.accepts('application/json'), Boom.notAcceptable('Client must be able to accept json'));
    // Check to see if the request body is json
    throwIf(() => !req.is('json'), Boom.badRequest('Request body must be json'));
    await User.find({ email: req.body.email.toLowerCase() }) // TODO: type validation on email property
        .then(
            throwIf(r => r.length > 0, Boom.conflict("A user with this email already exists")),
            throwError() // Returns a function that takes an error as a parameter
        );
    // No problems, create the new user account
    await User.create(req.body); // TODO: handle this error
    res.status(201).end();
   
}));

routes.put('/:userId', asyncHandler(async function (req, res) {

}));

routes.patch('/:userId', asyncHandler(async function (req, res) {

}));

routes.delete('/:userId', async function (req, res) {

});

routes.use(function handleError(err, req, res, next) {

});
export default routes;