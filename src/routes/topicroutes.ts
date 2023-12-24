import {
    addTopics,
    deleteTopics,
    readTopics,
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

topicsRoutes.get('/api/:version/read/tag', readTopics);

topicsRoutes.post(
    '/api/:version/add/tag',
    addTopicValidate,
    validate,
    addTopics,
);
topicsRoutes.put(
    '/api/:version/update/tag',
    updateTopicValidate,
    validate,
    updateTopics,
);
topicsRoutes.delete(
    '/api/:version/delete/tag/:deleteId/',
    validateCuid('deleteId'),
    validate,
    deleteTopics,
);

export default topicsRoutes;
