// import { MongoError } from 'mongodb';
import { Request, Response } from 'express';
import { validationResult } from 'express-validator/check';
import Boom from 'Boom';

/**
 * Handles error throwing in async functions, allowing Express to deal with them correctly.
 * @param fn The async function to handle
 */
export const asyncHandler = (fn: Function) => (req: Request, res: Response, next: Function) =>
    Promise
        .resolve(fn(req, res, next))
        .catch((err) => {
            if (!err.isBoom) {
                return next(Boom.badImplementation(err));
            }
            next(err);
        });


export const AsyncController = function (target, key, descriptor) {
    const fn = descriptor.value;
    descriptor.value = (req: Request, res: Response, next: Function) =>
        Promise
            .resolve(fn(req, res, next))
            .catch((err) => {
                if (!err.isBoom) {
                    return next(Boom.badImplementation(err));
                }
                next(err);
            });
};

/*export const Validate = function(target, key, descriptor) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
}*/
/**
 * Will throw an Error if a user-specified condition function evaluates to false.
 * The function should accept the result of a resolved promise and return a boolean.
 * 
 * @param fn The user-specified condition function
 * @param err The Error to throw if the condition resolves to false
 * @param statusCode The HTTP status code to send the client
 */
export const throwIf = (fn: (result?: any) => boolean, err: Boom | Error, options?: any) => (result?: any) => {

    if (fn(result)) {
        return throwError(options)(err);
    }
    return result;
};

export const throwError = (options?: any) => (err: Boom | Error) => {
    // if (!Boom.isBoom(err)) {
    //    err = Boom.boomify(err, options);
    // }
    throw err;
};