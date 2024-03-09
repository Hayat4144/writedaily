import userProfile from '@controller/user/Profile';
import userById from '@controller/user/UserById';
import userExist from '@controller/user/userExist';
import { profileValidation } from '@validation/profileValidation';
import express from 'express';
import authMiddleware from 'middleware/authMiddleware';

const userRoutes = express.Router();

userRoutes.get('/api/:version/get/user', userExist);
userRoutes.get('/api/:version/get/user/by/:id/', userById);
userRoutes.post(
    '/api/:version/user/update/profile',
    authMiddleware,
    profileValidation,
    userProfile,
);

export default userRoutes;
