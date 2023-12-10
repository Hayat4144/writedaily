import { payload } from '@customtype/index';
import { readFileSync } from 'fs';
import jwt, { SignOptions } from 'jsonwebtoken';
import { join } from 'path';

const options: SignOptions = {
    algorithm: 'ES256',
    expiresIn: '24h',
};

const getPrivateKeySecret = (): Buffer => {
    const filePath = join(process.cwd(), 'private.pem');
    const secretKey = readFileSync(filePath);
    return secretKey;
};

const getPublicKeySecret = (): Buffer => {
    const filePath = join(process.cwd(), 'public.pem');
    const secretKey = readFileSync(filePath);
    return secretKey;
};

const getAccessToken = async (payload: any): Promise<string> => {
    const secret = getPrivateKeySecret();
    const token = jwt.sign(payload, secret, options);
    return token;
};

const getRefreshToken = async (paylod: payload): Promise<string> => {
    const secret = getPrivateKeySecret();
    const token = jwt.sign(paylod, secret, {
        ...options,
        expiresIn: '30d',
    });
    return token;
};

const verifyToken = async (token: string, option: SignOptions) => {
    const secret = getPublicKeySecret();
    const isVerified = jwt.verify(token, secret, option) as payload;
    return isVerified;
};

export {
    getPrivateKeySecret,
    getRefreshToken,
    getAccessToken,
    getPublicKeySecret,
    verifyToken,
    options,
};
