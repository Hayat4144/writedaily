import { httpStatusCode } from '@customtype/index';
import { Request, Response } from 'express';
import asyncHandler from '@utils/asynHandler';
import bcrypt from 'bcrypt';
import { payload } from '@customtype/index';
import { getAccessToken, getRefreshToken } from '@utils/jwt';
import db from 'db';
import { users } from 'db/schema';
import { eq } from 'drizzle-orm';

const Signin = asyncHandler(async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const IsUserExist = await db.query.users.findFirst({
        where: eq(users.email, email),
    });
    if (!IsUserExist) {
        return res
            .status(httpStatusCode.BAD_REQUEST)
            .json({ error: `${email} does not exist.` });
    }

    const isValidPassword = await bcrypt.compare(
        password as string,
        IsUserExist.password,
    );
    if (!isValidPassword)
        return res
            .status(httpStatusCode.BAD_REQUEST)
            .json({ error: 'Invalid email/password' });
    const payload: payload = {
        id: IsUserExist.id,
        name: IsUserExist.name,
        email: IsUserExist.email,
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
