import RefreshAccessToken from 'auth/Refreshtoken';
import Signin from 'auth/Signin';
import Signup from 'auth/Singup';
import express from 'express';

const authrouter = express.Router();

authrouter.post('/api/:version/signup', Signup);
authrouter.post('/api/:version/signin', Signin);
authrouter.get('/api/:version/token/rotation', RefreshAccessToken);

export default authrouter;
