import asyncHandler from '@utils/asynHandler';
import { Response, Request } from 'express';
import { fork } from 'child_process';
import UserService from '@service/UserService';
import { CustomError } from '@utils/CustomError';
import { httpStatusCode } from '@customtype/index';

const userService = new UserService();

const ResetPasswordRequest = asyncHandler(
    async (req: Request, res: Response) => {
        const { email } = req.query;
        const isUser = await userService.isUserByEmail(email as string);
        if (!isUser) {
            throw new CustomError(
                'User does not exist.',
                httpStatusCode.BAD_REQUEST,
            );
        }
        const isToken = await userService.isTokenExist(isUser.id);
        if (isToken) {
            return res.status(httpStatusCode.OK).json({
                data: `Reset password link has been already send to your email ${isToken.user.email}`,
            });
        }
        let tokenData = {
            email: isUser.email,
            user_id: isUser.id,
        };
        const token = userService.generateResetPasswordToken(tokenData);
        const addToken = await userService.addResetPasswordToken(
            token,
            isUser.id,
        );
        const filepath = process.cwd() + '/src/utils/sendMail.ts';
        const productionpath = process.cwd() + '/dist/utils/sendMail.js';
        const childfilepath =
            process.env.NODE_ENV === 'production' ? productionpath : filepath;
        const sendMail = fork(childfilepath);

        const link = process.env.NODE_ENV === 'production' ? `${req.headers.origin}/resetpassword?token=${token}` : `${process.env.FRONTEND_URL}/resetpassword/?token=${token}`

        
        const message = {
            token,
            user: {
                email: isUser.email,
                id: isUser.id,
            },
            link,
        };
        sendMail.send(message);
        sendMail.on('message', (msg) => {
            const { error, data } = msg as any;
            if (error)
                return res
                    .status(httpStatusCode.BAD_REQUEST)
                    .json({ error: error.response });
            return res.status(httpStatusCode.OK).json({
                data: `Reset password email has been send to ${data.accepted[0]}`,
            });
        });
    },
);

export default ResetPasswordRequest;
