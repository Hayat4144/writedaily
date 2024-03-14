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
    check('provider').custom((value, { req }) => {
        if (value !== 'google') {
            if (!req.body.password || !req.body.confirmpassword) {
                throw new Error('Password fields are required');
            }
        }
        return value;
    }),
    // check('password')
    //     .optional()
    //     .isStrongPassword({
    //         minLength: 8,
    //         minLowercase: 1,
    //         minUppercase: 1,
    //         minNumbers: 1,
    //         minSymbols: 1,
    //     })
    //     .trim()
    //     .escape()
    //     .withMessage(
    //         'Password must contain at least 8 characters, including 1 symbol, 1 number, 1 uppercase, and 1 lowercase letter',
    //     )
    //     .custom((value, { req }) => {
    //         if (
    //             req.body.provider !== 'google' &&
    //             value !== req.body.confirmpassword
    //         ) {
    //             throw new Error("Password doesn't match.");
    //         }
    //         return value;
    //     }),
];

export default signupValidation;
