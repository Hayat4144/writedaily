import { httpStatusCode } from '@customtype/index';
import { Request, Response } from 'express';
import asyncHandler from '@utils/asynHandler';
import bcrypt from 'bcrypt';
import { payload } from '@customtype/index';
import prisma from '@config/databaseConfig';
import { getAccessToken, getRefreshToken } from '@utils/jwt';

const Signin = asyncHandler(async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const isUserExist = await prisma.user.findUnique({
        where: {
            email: email as string,
        },
    });
    if (!isUserExist) {
        return res
            .status(httpStatusCode.BAD_REQUEST)
            .json({ error: `${email} does not exist.` });
    }

    const isValidPassword = await bcrypt.compare(
        password as string,
        isUserExist.password,
    );
    if (!isValidPassword)
        return res
            .status(httpStatusCode.BAD_REQUEST)
            .json({ error: 'Invalid email/password' });
    const payload: payload = {
        id: isUserExist.id,
        name: isUserExist.name,
        email: isUserExist.email,
    };
    const token = await Promise.all([
        getAccessToken(payload),
        getRefreshToken(payload),
    ]);
    return res
        .status(httpStatusCode.OK)
        .json({ AccessToken: token[0], RefreshToken: token[1] });
});

export default Signin;
