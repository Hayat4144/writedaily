import {
    addReadingList,
    deleteReadingList,
    readreadingList,
} from '@controller/readingList/api';
import express from 'express';
import authMiddleware from 'middleware/authMiddleware';

const readinglistRoutes = express.Router();

readinglistRoutes.get(
    '/api/:version/readinglist',
    authMiddleware,
    readreadingList,
);
readinglistRoutes.post(
    '/api/:version/add/readinglist/:articleId/',
    authMiddleware,
    addReadingList,
);

readinglistRoutes.delete(
    '/api/:version/delete/readinglist/:id/',
    authMiddleware,
    deleteReadingList,
);

export default readinglistRoutes;
