import { check } from 'express-validator';
import checkUnknownField from './CheckUnKnownField';

export const profileValidation = [
    check('name')
        .isLength({ min: 4, max: 20 })
        .withMessage('Name must be between 4 and 20 characters')
        .trim()
        .escape(),

    check('username')
        .isLength({ min: 4, max: 20 })
        .withMessage('Username must be between 4 and 20 characters')
        .trim()
        .escape(),

    check('bio')
        .isLength({ min: 4 })
        .withMessage('Bio at least 4 characters long.')
        .isLength({ max: 160 })
        .withMessage('Bio cannot exceed 160 characters')
        .trim()
        .escape(),

    checkUnknownField(['name', 'username', 'bio']),
];
