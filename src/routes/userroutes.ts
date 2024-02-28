import userById from '@controller/user/UserById';
import userExist from '@controller/user/userExist';
import express from 'express';

const userRoutes = express.Router();

userRoutes.get('/api/:version/get/user', userExist);
userRoutes.get('/api/:version/get/user/by/:id/', userById);

export default userRoutes;
