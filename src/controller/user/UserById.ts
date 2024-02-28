import { httpStatusCode } from '@customtype/index';
import UserService from '@service/UserService';
import asyncHandler from '@utils/asynHandler';
import { Request, Response } from 'express';

const userService = new UserService();

const userById = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    if (!id)
        return res
            .status(httpStatusCode.BAD_REQUEST)
            .json({ error: 'id is required.' });
    const isUserExist = await userService.isUserExist(id);
    if (!isUserExist)
        return res.status(httpStatusCode.BAD_REQUEST).json({
            error: {
                message: 'User does not exist.',
                status: httpStatusCode.NOT_FOUND,
            },
        });
    return res.status(httpStatusCode.OK).json({ data: isUserExist });
});

export default userById;
