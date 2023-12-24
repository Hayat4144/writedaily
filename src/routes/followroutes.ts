import toggleFollow from '@controller/follows/api';
import CountFollowers from '@controller/follows/api/CountFollowers';
import CountFollowing from '@controller/follows/api/CountFollowing';
import getFollowers from '@controller/follows/api/getFollowers';
import getFollowing from '@controller/follows/api/getFollowing';
import validate from '@validation/index';
import validateCuid from '@validation/validateCuid';
import express from 'express';
import authMiddleware from 'middleware/authMiddleware';

const followroutes = express.Router();

followroutes.post(
    '/api/:version/follow/:followeeId/',
    validateCuid('followeeId'),
    validate,
    authMiddleware,
    toggleFollow,
);

followroutes.get(
    '/api/:version/count/followers/:followeeId/',
    validateCuid('followeeId'),
    validate,
    CountFollowers,
);
followroutes.get(
    '/api/:version/count/following',
    authMiddleware,
    CountFollowing,
);
followroutes.get('/api/:version/get/followers', authMiddleware, getFollowers);
followroutes.get('/api/:version/get/followings', authMiddleware, getFollowing);

export default followroutes;
