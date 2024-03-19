import article from '@controller/articles/api/article';
import createArticle from '@controller/articles/api/createArticle';
import deleteArticle from '@controller/articles/api/deleteArticle';
import Feed from '@controller/articles/api/feed';
import articleData from '@controller/articles/api/getPublishedPageArticleData';
import publishArticle from '@controller/articles/api/publishArticle';
import readArticle from '@controller/articles/api/readArticles';
import SearchArticle from '@controller/articles/api/searchArticle';
import unpublishArticle from '@controller/articles/api/unpublishArticle';
import updateArticle from '@controller/articles/api/updateArticle';
import uploadMedia from '@controller/media/uploadMedia';
import {
    addArticleValidate,
    deleteArticleValidate,
    publishArticleValidate,
    readPrivateArticleValidate,
    updateArticleValidate,
} from '@validation/articleValidation';
import validate from '@validation/index';
import validateCuid from '@validation/validateCuid';
import express from 'express';
import authMiddleware from 'middleware/authMiddleware';

const articleroutes = express.Router();

articleroutes.post(
    '/api/:version/create/article',
    addArticleValidate,
    validate,
    authMiddleware,
    createArticle,
);
articleroutes.post(
    '/api/:version/update/article',
    updateArticleValidate,
    validate,
    authMiddleware,
    updateArticle,
);
articleroutes.delete(
    '/api/:version/delete/article',
    deleteArticleValidate,
    validate,
    authMiddleware,
    deleteArticle,
);
articleroutes.get(
    '/api/:version/read/articles',
    readPrivateArticleValidate,
    validate,
    readArticle,
);
articleroutes.get(
    '/api/:version/article/:id',
    validateCuid('id'),
    validate,
    article,
);
articleroutes.post(
    '/api/:version/publish/article',
    authMiddleware,
    publishArticle,
);
articleroutes.get('/api/:version/search/articles', SearchArticle);

articleroutes.post('/api/:verions/upload', uploadMedia);
articleroutes.get('/api/:version/feed/', Feed);
articleroutes.get(
    '/api/:version/articleData/:id',
    validateCuid('id'),
    validate,
    articleData,
);

articleroutes.get(
    '/api/:version/unpublish/article/:id',
    validateCuid('id'),
    validate,
    authMiddleware,
    unpublishArticle,
);

export default articleroutes;
