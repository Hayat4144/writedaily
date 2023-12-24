import { check } from 'express-validator';
import validateCuid from './validateCuid';
import checkUnknownField from './CheckUnKnownField';
import { commentType } from '@customtype/index';

export const articleCommentValidate = [
    validateCuid('articleId'),
    checkUnknownField(['articleId']),
];

export const deleteCommentValidate = [
    validateCuid('deleteId'),
    checkUnknownField(['deleteId']),
];

export const editCommentValidate = [
    check('content')
        .notEmpty()
        .withMessage('Content cannot be empty.')
        .isString()
        .withMessage('Content must be a string.')
        .isLength({ min: 4 })
        .withMessage('Content should be at least 4 characters long.')
        .trim()
        .escape(),

    validateCuid('commentId'),

    checkUnknownField(['content', 'commentId']),
];

export const addCommentValidate = [
    check('content')
        .notEmpty()
        .withMessage('Content cannot be empty.')
        .isString()
        .withMessage('Content must be a string.')
        .isLength({ min: 4 })
        .withMessage('Content should be at least 4 characters long.')
        .trim()
        .escape(),

    check('commentType')
        .notEmpty()
        .withMessage('CommentType cannot be empty.')
        .isIn(Object.values(commentType))
        .withMessage(
            "Invalid value:comment type either 'comment' or 'article'.",
        ),

    validateCuid('commentableId'),

    checkUnknownField(['content', 'commentType', 'commentableId']),
];
