import { Request, Response, NextFunction } from 'express';
import { CustomError } from '../utils/CustomError';
import logger from '@utils/logger';
import { httpStatusCode } from '@customtype/index';

export const ErrorMiddleware = (
    err: Error | any,
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    err.statusCode = err.statusCode || httpStatusCode.INTERNAL_SERVER_ERROR;
    err.message = err.message || 'Internal server Errors';
    switch (err.name) {
        case 'JsonWebTokenError':
            err.message = `Json Web Token is invalid, Try again `;
            err.statusCode = httpStatusCode.UNAUTHORIZED;
            break;
        case 'TokenExpiredError':
            err.message = 'Json Web Token is Expired, Try again ';
            err.statusCode = httpStatusCode.UNAUTHORIZED;
            break;
        default:
            break;
    }

    if (err instanceof CustomError) {
        return res.status(err.statusCode).json({ error: err.message });
    }

    if (
        !(err instanceof CustomError) &&
        err.name !== 'TokenExpiredError' &&
        err.name !== 'JsonWebTokenError'
    ) {
        process.env.NODE_ENV === 'production'
            ? logger.error(err.message)
            : logger.error(err);
    }

    return res.status(err.statusCode).json({
        error: err.message,
    });
};

export default ErrorMiddleware;
