import { check, query } from 'express-validator';
import checkUnknownField from './CheckUnKnownField';
import validateCuid from './validateCuid';
import { isCuid } from '@paralleldrive/cuid2';

export const publishArticleValidate = [
    validateCuid('articleId'),
    check('topicsId')
        .notEmpty()
        .withMessage('TopicsId cannot be empty.')
        .isArray({ min: 4 })
        .withMessage('Atleast choose 4 topics.')
        .custom((value) => {
            if (!value.every((topicId: string) => isCuid(topicId))) {
                throw new Error('Invalid TopicsId format.');
            }
            const isDuplicate = value.some(
                (item: string, i: number) => value.indexOf(item) !== i,
            );
            if (isDuplicate) {
                throw new Error('Duplicate topic is provided.');
            }
            return true;
        }),

    checkUnknownField(['articleId', 'topicsId']),
];

export const readPrivateArticleValidate = [
    query('page')
        .optional()
        .isInt()
        .withMessage('Page must be a valid integer.')
        .isInt({ min: 1 })
        .withMessage('Page must be greater than 1 or equal to 1')
        .toInt(),

    query('resultPerPage')
        .optional()
        .isInt()
        .withMessage('ResultPerPage must be a valid integer.')
        .isInt({ min: 10 })
        .withMessage('ResultPerPage must be greater than 10 or equal to 10')
        .toInt(),
];

export const deleteArticleValidate = [
    validateCuid('articleId'),
    checkUnknownField(['articleId']),
];

export const addArticleValidate = [
    check('title')
        .notEmpty()
        .withMessage('Title is required.')
        .isString()
        .withMessage('Title must be a string.')
        .trim()
        .escape()
        .isLength({ min: 5, max: 150 })
        .withMessage('Title should be between 5 and 150 characters long.'),

    check('content')
        .optional()
        .isArray()
        .withMessage('Content should be an array.'),

    check('description')
        .optional()
        .isString()
        .withMessage('Description must be a string if provided.')
        .trim()
        .escape(),

    checkUnknownField(['title', 'content', 'description']),
];

export const updateArticleValidate = [
    validateCuid('id'),
    check('data').custom((data, { req }) => {
        if (!data) {
            throw new Error(
                'At least one of the fields (title, description, content) must be provided in data.',
            );
        }

        // Check if at least one of the fields is present
        const hasTitle =
            data.hasOwnProperty('title') &&
            typeof data.title === 'string' &&
            data.title.trim() !== '';
        const hasDescription =
            data.hasOwnProperty('description') &&
            typeof data.description === 'string' &&
            data.description.trim() !== '';
        const hasContent =
            data.hasOwnProperty('content') && Array.isArray(data.content);

        if (!(hasTitle || hasDescription || hasContent)) {
            throw new Error(
                'At least one of the fields (title, description, content) must be provided in data.',
            );
        }

        return true;
    }),

    check('data.title')
        .optional()
        .isString()
        .withMessage('Title must be a string.')
        .notEmpty()
        .withMessage('Title cannot be empty.')
        .trim()
        .escape(),

    check('data.description')
        .optional()
        .isString()
        .withMessage('Description must be a string.')
        .notEmpty()
        .withMessage('Description cannot be empty.')
        .trim()
        .escape(),

    check('data.content')
        .optional()
        .isArray()
        .withMessage('Content should be an array.'),

    checkUnknownField(['id', 'data']),
];
