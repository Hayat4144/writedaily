import prisma from '@config/databaseConfig';
import { httpStatusCode } from '@customtype/index';
import asyncHandler from '@utils/asynHandler';
import { Request, Response } from 'express';
import bcrypt from 'bcrypt';

const Signup = asyncHandler(async (req: Request, res: Response) => {
    const { name, email, password } = await req.body;
    const saltRound = 10;
    const IsUserExist = await prisma.user.findFirst({
        where: { email: email },
    });
    if (IsUserExist) {
        return res
            .status(httpStatusCode.BAD_REQUEST)
            .json({ error: 'User already exit.' });
    }
    const hashPassword = await bcrypt.hash(password, saltRound);
    const createNewuser = await prisma.user.create({
        data: {
            name,
            email,
            password: hashPassword,
        },
    });
    if (createNewuser) {
        return res.status(httpStatusCode.OK).json({
            data: `${createNewuser.email} has been created successfully.`,
        });
    }
});

export default Signup;
