import { check } from 'express-validator';
import checkUnknownField from './CheckUnKnownField';

export const updateTopicValidate = [
    check('name')
        .notEmpty()
        .withMessage('Name cannot be empty.')
        .isString()
        .withMessage('Name must be a string.')
        .trim()
        .escape(),

    check('id')
        .notEmpty()
        .withMessage('Id cannot be empty.')
        .isString()
        .withMessage('Id must be a string.'),

    checkUnknownField(['name', 'id']),
];

export const addTopicValidate = [
    check('name')
        .notEmpty()
        .withMessage('Name cannot be empty.')
        .isString()
        .withMessage('Name must be a string.')
        .trim()
        .escape(),
];
