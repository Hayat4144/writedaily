import asyncHandler from '@utils/asynHandler';
import { Response, Request } from 'express';
import UserService from '@service/UserService';
import { httpStatusCode } from '@customtype/index';

const userService = new UserService();

const Changepassword = asyncHandler(async (req: Request, res: Response) => {
    let { newpassword, password, confirmpassword } = req.body;
    const changePassword = await userService.changePassword(
        newpassword,
        password,
        confirmpassword,
        req.user_id,
    );
    if (changePassword.success) {
        return res
            .status(httpStatusCode.OK)
            .json({ data: 'Password has been changed successfully.' });
    }
});

export default Changepassword;
