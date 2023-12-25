import addComment from '@controller/comments/api/addComment';
import articleComments from '@controller/comments/api/articleComment';
import deleteComment from '@controller/comments/api/deleteComment';
import editComment from '@controller/comments/api/editComments';
import { deleteArticleValidate } from '@validation/articleValidation';
import {
    addCommentValidate,
    articleCommentValidate,
    deleteCommentValidate,
    editCommentValidate,
} from '@validation/commentValidate';
import validate from '@validation/index';
import express from 'express';
import authMiddleware from 'middleware/authMiddleware';

const commentroutes = express.Router();

commentroutes.post(
    '/api/:version/add/comment',
    addCommentValidate,
    validate,
    authMiddleware,
    addComment,
);
commentroutes.put(
    '/api/:version/edit/comment',
    editCommentValidate,
    validate,
    authMiddleware,
    editComment,
);

commentroutes.delete(
    '/api/:version/delete/comment',
    deleteCommentValidate,
    validate,
    authMiddleware,
    deleteComment,
);
commentroutes.get(
    '/api/:version/article/comments/:articleId/',
    articleCommentValidate,
    validate,
    articleComments,
);

export default commentroutes;
