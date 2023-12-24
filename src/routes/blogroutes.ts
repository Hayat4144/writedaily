import article from '@controller/blogs/api/article';
import createBlog from '@controller/blogs/api/createBlog';
import deleteBlog from '@controller/blogs/api/deleteBlog';
import publishArticle from '@controller/blogs/api/publishArticle';
import readBlog from '@controller/blogs/api/readBlog';
import SearchArticle from '@controller/blogs/api/searchArticle';
import updateBlog from '@controller/blogs/api/updateBlog';
import {
    addArticleValidate,
    deleteArticleValidate,
    publishArticleValidate,
    readPrivateArticleValidate,
    updateArticleValidate,
} from '@validation/articleValidation';
import { articleCommentValidate } from '@validation/commentValidate';
import validate from '@validation/index';
import validateCuid from '@validation/validateCuid';
import express from 'express';
import authMiddleware from 'middleware/authMiddleware';

const articleroutes = express.Router();

articleroutes.post(
    '/api/:version/create/blog',
    addArticleValidate,
    validate,
    authMiddleware,
    createBlog,
);
articleroutes.post(
    '/api/:version/update/blog',
    updateArticleValidate,
    validate,
    authMiddleware,
    updateBlog,
);
articleroutes.delete(
    '/api/:version/delete/blog',
    deleteArticleValidate,
    validate,
    authMiddleware,
    deleteBlog,
);
articleroutes.get(
    '/api/:version/read/blog',
    readPrivateArticleValidate,
    validate,
    authMiddleware,
    readBlog,
);
articleroutes.get(
    '/api/:version/article/:id',
    validateCuid('id'),
    validate,
    article,
);
articleroutes.post(
    '/api/:version/publish/article',
    publishArticleValidate,
    validate,
    authMiddleware,
    publishArticle,
);
articleroutes.get('/api/:version/search', SearchArticle);

export default articleroutes;
