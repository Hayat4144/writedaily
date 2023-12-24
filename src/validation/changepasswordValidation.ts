import { httpStatusCode } from '@customtype/index';
import { CustomError } from '@utils/CustomError';
import { check } from 'express-validator';
import checkUnknownField from './CheckUnKnownField';

const changepasswordValidation = [
    check('password').notEmpty().withMessage("Old password can't be empty."),
    check('newpassword')
        .isStrongPassword({
            minLength: 8,
            minLowercase: 1,
            minUppercase: 1,
            minNumbers: 1,
            minSymbols: 1,
        })
        .trim()
        .escape()
        .withMessage(
            'New Password must contain at least 8 characters, including 1 symbol, 1 number, 1 uppercase, and 1 lowercase letter',
        )
        .custom((value, { req }) => {
            if (value !== req.body.confirmpassword) {
                throw new CustomError(
                    "Password doesn't match.",
                    httpStatusCode.BAD_REQUEST,
                );
            } else {
                return value;
            }
        }),
    checkUnknownField(['confirmpassword', 'password', 'newpassword']),
];

export default changepasswordValidation;
