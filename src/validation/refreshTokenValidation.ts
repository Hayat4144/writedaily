import { check } from 'express-validator';

const refresTokenvalidation = [
    check('refreshtoken').isJWT().withMessage('refreshtoken should be a jwt.'),
];

export default refresTokenvalidation;
