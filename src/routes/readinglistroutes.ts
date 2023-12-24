import {
    addReadingList,
    deleteReadingList,
    readreadingList,
} from '@controller/readingList/api';
import express from 'express';
import authMiddleware from 'middleware/authMiddleware';
import { readPrivateArticleValidate as readinglistValidate } from '@validation/articleValidation';
import validate from '@validation/index';
import validateCuid from '@validation/validateCuid';

const readinglistRoutes = express.Router();

readinglistRoutes.get(
    '/api/:version/readinglist',
    readinglistValidate,
    validate,
    authMiddleware,
    readreadingList,
);
readinglistRoutes.post(
    '/api/:version/add/readinglist/:articleId/',
    validateCuid('articleId'),
    validate,
    authMiddleware,
    addReadingList,
);

readinglistRoutes.delete(
    '/api/:version/delete/readinglist/:listId/',
    validateCuid('listId'),
    validate,
    authMiddleware,
    deleteReadingList,
);

export default readinglistRoutes;
