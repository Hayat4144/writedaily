import { check } from 'express-validator';
import checkUnknownField from './CheckUnKnownField';

const EmailValidation = [
    check('email')
        .notEmpty()
        .withMessage('email can not be empty.')
        .isEmail()
        .withMessage('Invalid email is provided.'),
    checkUnknownField(['email']),
];

export default EmailValidation;
