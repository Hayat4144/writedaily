import { httpStatusCode } from '@customtype/index';
import UserService from '@service/UserService';
import asyncHandler from '@utils/asynHandler';
import { Request, Response } from 'express';

const userService = new UserService();

const DeleteAccount = asyncHandler(async (req: Request, res: Response) => {
    const isDeleted = await userService.deleteAccount(req.user_id);
    if (isDeleted)
        return res
            .status(httpStatusCode.OK)
            .json({ data: 'Your account has been deleted successfully.' });
    else
        return res
            .status(httpStatusCode.OK)
            .json({ error: 'Something went wrong.' });
});

export default DeleteAccount;
