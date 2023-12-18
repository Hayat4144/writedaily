import addLike from '@controller/likes/addLikes';
import articleLikes from '@controller/likes/articleLikes';
import express from 'express';
import authMiddleware from 'middleware/authMiddleware';

const likeroutes = express.Router();

likeroutes.get('/api/:version/article/likes/:articleId/', articleLikes);
likeroutes.post('/api/:version/add/like', authMiddleware, addLike);

export default likeroutes;
