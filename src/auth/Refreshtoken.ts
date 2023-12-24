import { httpStatusCode, payload } from '@customtype/index';
import asyncHandler from '@utils/asynHandler';
import { getAccessToken, options, verifyToken } from '@utils/jwt';
import { Request, Response } from 'express';
import { SignOptions } from 'jsonwebtoken';

const RefreshAccessToken = asyncHandler(async (req: Request, res: Response) => {
    const { refreshtoken } = req.query;
    const option: SignOptions = { ...options, expiresIn: '30d' };
    const { id, name, email } = await verifyToken(
        refreshtoken as string,
        option,
    );
    const payload: payload = {
        id,
        name,
        email,
    };
    const token = await getAccessToken(payload);
    return res
        .status(httpStatusCode.OK)
        .json({ AccessToken: token, Refreshtoken: refreshtoken });
});

export default RefreshAccessToken;
