import { Response, Request, NextFunction } from 'express';
import { httpStatusCode } from '@customtype/index';
import asyncHandler from '@utils/asynHandler';
import { OAuth2Client } from 'google-auth-library';
import { getAccessToken } from '@utils/jwt';
import UserService from '@service/UserService';
const client = new OAuth2Client();

const userService = new UserService();

const verifySocailToken = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const { idToken } = req.body;
        const ticket = await client.verifyIdToken({
            idToken,
            audience: process.env.CLIENT_ID,
        });
        const payload = ticket.getPayload();
        const userExist = await userService.isUserByEmail(
            payload?.email as string,
        );
        const access_token = await getAccessToken({
            id: userExist?.id,
            name: payload?.name,
            email: userExist?.email,
        });
        return res.status(httpStatusCode.OK).json({ access_token });
    },
);

export default verifySocailToken;
