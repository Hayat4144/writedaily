import changepasswordValidation from '@validation/changepasswordValidation';
import validate from '@validation/index';
import refresTokenvalidation from '@validation/refreshTokenValidation';
import EmailValidation from '@validation/resetPasswordRequestValidation';
import resetPasswordValidate from '@validation/resetPasswordValidation';
import signupValidation from '@validation/signupValidation';
import Changepassword from 'auth/ChangePassword';
import RefreshAccessToken from 'auth/Refreshtoken';
import ResetPassword from 'auth/ResetPassword';
import ResetPasswordRequest from 'auth/ResetpasswordRequest';
import Signin from 'auth/Signin';
import Signup from 'auth/Singup';
import verifySocailToken from 'auth/VerifySocialtoken';
import express from 'express';
import authMiddleware from 'middleware/authMiddleware';

const authrouter = express.Router();

authrouter.post('/api/:version/signup', signupValidation, validate, Signup);
authrouter.post('/api/:version/signin', Signin);

authrouter.get(
    '/api/:version/token/rotation',
    refresTokenvalidation,
    validate,
    RefreshAccessToken,
);
authrouter.post(
    '/api/:version/change/password',
    changepasswordValidation,
    validate,
    authMiddleware,
    Changepassword,
);
authrouter.get(
    '/api/:version/reset/password/request',
    EmailValidation,
    validate,
    ResetPasswordRequest,
);
authrouter.post(
    '/api/:version/reset/password',
    resetPasswordValidate,
    validate,
    ResetPassword,
);

authrouter.post('/api/:version/verify/socail/token', verifySocailToken);

export default authrouter;
