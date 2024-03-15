import userProfile from '@controller/user/Profile';
import userProfilePic from '@controller/user/UpdateProfilePic';
import userById from '@controller/user/UserById';
import userExist from '@controller/user/userExist';
import deleteAccount from '@controller/user/DeleteAccount';
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
userRoutes.post(
    '/api/:version/update/profile/pic',
    authMiddleware,
    userProfilePic,
);

userRoutes.delete(
    '/api/:version/delete/account',
    authMiddleware,
    deleteAccount,
);

export default userRoutes;
