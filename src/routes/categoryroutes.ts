import {
    addCategory,
    deleteCategory,
    readCategory,
    updateCategory,
} from '@controller/categories/api';
import express from 'express';

const categoryRoutes = express.Router();

categoryRoutes.get('/api/:version/read/category', readCategory);
categoryRoutes.post('/api/:version/add/category', addCategory);
categoryRoutes.put('/api/:version/update/category', updateCategory);
categoryRoutes.delete('/api/:version/delete/category', deleteCategory);

export default categoryRoutes;
