import article from '@controller/blogs/api/article';
import createBlog from '@controller/blogs/api/createBlog';
import deleteBlog from '@controller/blogs/api/deleteBlog';
import readBlog from '@controller/blogs/api/readBlog';
import updateBlog from '@controller/blogs/api/updateBlog';
import express from 'express';
import authMiddleware from 'middleware/authMiddleware';

const articleroutes = express.Router();

articleroutes.post('/api/:version/create/blog', authMiddleware, createBlog);
articleroutes.post('/api/:version/update/blog', authMiddleware, updateBlog);
articleroutes.delete('/api/:version/delete/blog', authMiddleware, deleteBlog);
articleroutes.get('/api/:version/read/blog', authMiddleware, readBlog);

articleroutes.get('/api/:version/article/:id', article);

export default articleroutes;
