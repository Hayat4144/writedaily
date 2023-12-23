import asyncHandler from '@utils/asynHandler';
import { Response, Request } from 'express';
import bcrypt from 'bcrypt';
import UserService from '@service/UserService';
import isValidDate from '@utils/isValidDate';
import { httpStatusCode } from '@customtype/index';

const userService = new UserService();

const ResetPassword = asyncHandler(async (req: Request, res: Response) => {
    const { token, password } = req.body;
    const isTokenexist = await userService.isValidToken(token);

    if (!isTokenexist)
        return res
            .status(httpStatusCode.BAD_REQUEST)
            .json({ error: `Invalid token or link, please check it` });
    const isTokenValid = isValidDate(isTokenexist.createdAt, 10);

    if (!isTokenValid) {
        const deleteToken = await userService.deleteToken(isTokenexist.id);
        if (deleteToken.deleted && isTokenexist.id === deleteToken.id) {
            return res.status(httpStatusCode.BAD_REQUEST).json({
                error: 'Token has been expired.',
            });
        }
        return;
    }

    const hashPassword = await bcrypt.hash(password, 10);
    const updatedPassword = await userService.updatePassword(
        isTokenexist.userId,
        hashPassword,
    );

    if (updatedPassword.updated) {
        const deletedToken = await userService.deleteToken(isTokenexist.id);
        if (deletedToken.deleted) {
            return res
                .status(httpStatusCode.OK)
                .json({ data: 'your password has been reset successfully.' });
        }
        return res
            .status(httpStatusCode.BAD_REQUEST)
            .json({ error: 'Invalid token is provided.' });
    } else {
        return res
            .status(httpStatusCode.BAD_REQUEST)
            .json({ error: "you don't have rights to reset password." });
    }
});

export default ResetPassword;
