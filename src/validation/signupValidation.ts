import { httpStatusCode } from '@customtype/index';
import { CustomError } from '@utils/CustomError';
import { check } from 'express-validator';

const signupValidation = [
    check('name')
        .isLength({ min: 4, max: 30 })
        .trim()
        .escape()
        .withMessage('Name should be 4 to 15 characters long'),

    check('email')
        .isEmail()
        .trim()
        .escape()
        .withMessage('Invalid email provided'),

    check('password')
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
            'Password must contain at least 8 characters, including 1 symbol, 1 number, 1 uppercase, and 1 lowercase letter',
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
];

export default signupValidation;
