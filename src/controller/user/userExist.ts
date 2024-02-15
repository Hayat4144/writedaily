import { httpStatusCode } from '@customtype/index';
import UserService from '@service/UserService';
import asyncHandler from '@utils/asynHandler';
import { Request, Response } from 'express';

const userService = new UserService();

const userExist = asyncHandler(async (req: Request, res: Response) => {
    const { email } = req.query;
    if (!email)
        return res
            .status(httpStatusCode.BAD_REQUEST)
            .json({ error: 'Email is required.' });
    const isUser = await userService.isUserByEmail(email as string);
    if (!isUser)
        return res
            .status(httpStatusCode.BAD_REQUEST)
            .json({ error: 'User not found' });
    return res.status(httpStatusCode.OK).json({ data: isUser });
});

export default userExist;
