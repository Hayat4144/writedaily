import { check } from 'express-validator';

const refresTokenvalidation = [
    check('refreshtoken')
        .isEmpty()
        .isJWT()
        .withMessage('refreshtoken should be a jwt.'),
];

export default refresTokenvalidation;
