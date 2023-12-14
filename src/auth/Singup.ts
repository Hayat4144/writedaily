import { httpStatusCode } from '@customtype/index';
import asyncHandler from '@utils/asynHandler';
import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import db from 'db';
import { eq } from 'drizzle-orm';
import { NewUser, users } from 'db/schema';
import logger from '@utils/logger';

const Signup = asyncHandler(async (req: Request, res: Response) => {
    const { name, email, password } = await req.body;
    const saltRound = 10;
    console.log(name, email, password);
    const IsUserExist = await db.query.users.findFirst({
        where: eq(users.email, email),
    });
    logger.info(IsUserExist);
    if (IsUserExist) {
        return res
            .status(httpStatusCode.BAD_REQUEST)
            .json({ error: 'User already exit.' });
    }
    const hashPassword = await bcrypt.hash(password, saltRound);
    const userData: NewUser = {
        name,
        email,
        password: hashPassword,
    };
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
