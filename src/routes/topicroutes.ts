import {
    addTopics,
    deleteTopics,
    getArticleTopics,
    readTopics,
    searchTopics,
    updateTopics,
} from '@controller/tags/api';
import validate from '@validation/index';
import {
    addTopicValidate,
    updateTopicValidate,
} from '@validation/topicValidate';
import validateCuid from '@validation/validateCuid';
import express from 'express';

const topicsRoutes = express.Router();

topicsRoutes.get('/api/:version/article/topics/:id', getArticleTopics);

topicsRoutes.get('/api/:version/read/tag', readTopics);

topicsRoutes.post(
    '/api/:version/add/topic',
    addTopicValidate,
    validate,
    addTopics,
);
topicsRoutes.put(
    '/api/:version/update/topic',
    updateTopicValidate,
    validate,
    updateTopics,
);
topicsRoutes.delete(
    '/api/:version/delete/topic/:deleteId/',
    validateCuid('deleteId'),
    validate,
    deleteTopics,
);

topicsRoutes.get('/api/:version/search/topic', searchTopics);

export default topicsRoutes;
