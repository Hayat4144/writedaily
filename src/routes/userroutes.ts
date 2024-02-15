import userExist from '@controller/user/userExist';
import express from 'express';

const userRoutes = express.Router();

userRoutes.get('/api/:version/get/user', userExist);

export default userRoutes;
