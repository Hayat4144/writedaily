import { addTag, deleteTag, readTag, updateTag } from '@controller/tags/api';
import express from 'express';

const tagsRoutes = express.Router();

tagsRoutes.get('/api/:version/read/tag', readTag);
tagsRoutes.post('/api/:version/add/tag', addTag);
tagsRoutes.put('/api/:version/update/tag', updateTag);
tagsRoutes.delete('/api/:version/delete/tag', deleteTag);

export default tagsRoutes;
