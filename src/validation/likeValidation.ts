import { check } from 'express-validator';
import checkUnknownField from './CheckUnKnownField';
import validateCuid from './validateCuid';
import { likeType } from '@customtype/index';

export const articlelikesValidate = [
    validateCuid('articleId'),
    checkUnknownField(['articleId']),
];

export const addlikeValidate = [
    validateCuid('likebleId'),
    check('likeType')
        .notEmpty()
        .withMessage('LikeType cannot be empty.')
        .isIn(Object.values(likeType))
        .withMessage('Invalid value:Like type either be comment or article.'),

    checkUnknownField(['likebleId', 'likeType']),
];
