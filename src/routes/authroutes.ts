import Changepassword from 'auth/ChangePassword';
import RefreshAccessToken from 'auth/Refreshtoken';
import ResetPassword from 'auth/ResetPassword';
import ResetPasswordRequest from 'auth/ResetpasswordRequest';
import Signin from 'auth/Signin';
import Signup from 'auth/Singup';
import express from 'express';
import authMiddleware from 'middleware/authMiddleware';

const authrouter = express.Router();

authrouter.post('/api/:version/signup', Signup);
authrouter.post('/api/:version/signin', Signin);
authrouter.get('/api/:version/token/rotation', RefreshAccessToken);
authrouter.post(
    '/api/:version/change/password',
    authMiddleware,
    Changepassword,
);
authrouter.get('/api/:version/reset/password/request', ResetPasswordRequest);
authrouter.post('/api/:version/reset/password', ResetPassword);

export default authrouter;
