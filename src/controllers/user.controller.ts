import { Router, Request, Response } from 'express';
import User from '../models/user';
import { AsyncController, throwIf, throwError } from '../util/error-handling';
import Boom from 'boom';
import { UserDocument } from '../types/user';


export default class UserController {

    @AsyncController
    async loadUser(req: Request, res: Response, next, value): Promise<any> {
        const user: UserDocument = await User.findById(value)
            .then(
                throwIf(r => !r, Boom.notFound("No user with the specified ID could be found")), // Throw an error if the user document doesn't exist
                throwError() // Throw an error if mongoose throws an error
            );
        req.user = user; // Attach the user document to the Request object
        next();
    }

    @AsyncController
    async createNewUser(req: Request, res: Response) {
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

    }

    @AsyncController
    async updateUser(req: Request, res: Response) {
        await User.update(req.params.userId, req.body).exec(); // Errors are handled by HandleAsyncFn
        res.status(200).end();
        // TODO: Should this send anything back?
    }

    @AsyncController
    async deleteUser(req: Request, res: Response) {
        User.findByIdAndRemove()
    }
}