import { httpStatusCode } from '@customtype/index';
import asyncHandler from '@utils/asynHandler';
import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import db from 'db';
import { eq } from 'drizzle-orm';
import { NewUser, users } from 'db/schema';

const Signup = asyncHandler(async (req: Request, res: Response) => {
    const { name, email, password, provider, providerId, profilePic } =
        await req.body;
    const saltRound = 10;
    const IsUserExist = await db.query.users.findFirst({
        where: eq(users.email, email),
    });
    if (IsUserExist) {
        return res
            .status(httpStatusCode.BAD_REQUEST)
            .json({ error: 'User already exit.' });
    }
    let userData: NewUser = { name, email, provider, providerId, profilePic };
    if (provider !== 'google') {
        const hashPassword = await bcrypt.hash(password, saltRound);
        userData = { ...userData, password: hashPassword };
    }
    const createNewuser = await db
        .insert(users)
        .values(userData)
        .returning({ email: users.email });
    if (createNewuser.length > 0) {
        return res.status(httpStatusCode.OK).json({
            data: `${createNewuser[0].email} has been created successfully.`,
        });
    }
});

export default Signup;
