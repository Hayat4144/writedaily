import {
    addTopics,
    deleteTopics,
    readTopics,
    updateTopics,
} from '@controller/tags/api';
import express from 'express';

const topicsRoutes = express.Router();

topicsRoutes.get('/api/:version/read/tag', readTopics);
topicsRoutes.post('/api/:version/add/tag', addTopics);
topicsRoutes.put('/api/:version/update/tag', updateTopics);
topicsRoutes.delete('/api/:version/delete/tag', deleteTopics);

export default topicsRoutes;
