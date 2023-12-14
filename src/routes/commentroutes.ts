import addComment from '@controller/comments/api/addComment';
import deleteComment from '@controller/comments/api/deleteComment';
import editComment from '@controller/comments/api/editComments';
import express from 'express';
import authMiddleware from 'middleware/authMiddleware';

const commentroutes = express.Router();

commentroutes.post('/api/:version/add/comment', authMiddleware, addComment);
commentroutes.put('/api/:version/edit/comment', authMiddleware, editComment);
commentroutes.delete(
    '/api/:version/delete/comment',
    authMiddleware,
    deleteComment,
);

export default commentroutes;
