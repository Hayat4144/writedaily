import { httpStatusCode } from '@customtype/index';
import asyncHandler from '@utils/asynHandler';
import { NextFunction, Request, Response } from 'express';
import { matchedData, validationResult } from 'express-validator';

const validate = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res
                .status(httpStatusCode.UNPROCESSABLE_ENTITY)
                .json({ error: errors.array()[0].msg });
        }
        next();
    },
);

export default validate;
