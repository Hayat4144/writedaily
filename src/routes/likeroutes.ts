import addLike from '@controller/likes/addLikes';
import articleLikes from '@controller/likes/articleLikes';
import validate from '@validation/index';
import {
    addlikeValidate,
    articlelikesValidate,
} from '@validation/likeValidation';
import express from 'express';
import authMiddleware from 'middleware/authMiddleware';

const likeroutes = express.Router();

likeroutes.get(
    '/api/:version/article/likes/:articleId/',
    articlelikesValidate,
    validate,
    articleLikes,
);
likeroutes.post(
    '/api/:version/add/like',
    addlikeValidate,
    validate,
    authMiddleware,
    addLike,
);

export default likeroutes;
