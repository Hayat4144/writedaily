import createBlog from '@controller/blogs/api/createBlog';
import deleteBlog from '@controller/blogs/api/deleteBlog';
import readBlog from '@controller/blogs/api/readBlog';
import updateBlog from '@controller/blogs/api/updateBlog';
import express from 'express';
import authMiddleware from 'middleware/authMiddleware';

const blogsroutes = express.Router();

blogsroutes.post('/api/:version/create/blog', authMiddleware, createBlog);
blogsroutes.post('/api/:version/update/blog', authMiddleware, updateBlog);
blogsroutes.delete('/api/:version/delete/blog', authMiddleware, deleteBlog);
blogsroutes.get('/api/:version/read/blog', authMiddleware, readBlog);

export default blogsroutes;
