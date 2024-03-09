import { httpStatusCode } from '@customtype/index';
import UserService from '@service/UserService';
import asyncHandler from '@utils/asynHandler';
import { Request, Response } from 'express';

const userService = new UserService();

const userProfile = asyncHandler(async (req: Request, res: Response) => {
    const isUserExist = await userService.isUserExist(req.user_id);
    if (!isUserExist)
        return res.status(httpStatusCode.BAD_REQUEST).json({
            error: {
                message: 'User does not exist.',
                status: httpStatusCode.NOT_FOUND,
            },
        });
    const updatedProfile = await userService.updateProfile(
        isUserExist.id,
        req.body,
    );
    return res.status(httpStatusCode.OK).json({ data: updatedProfile });
});

export default userProfile;
