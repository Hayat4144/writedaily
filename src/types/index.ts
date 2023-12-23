import { JwtPayload } from 'jsonwebtoken';

export interface changePasswordInterface {
    success: boolean;
}

export interface DeletedData {
    deleted: boolean;
    id: string;
    name?: string;
}

export interface updatedResponse {
    updated: boolean;
    name?: string;
}

export interface ResetPasswordTokenData {
    user_id: string;
    email: string;
}

// Define custom properties for Request object
declare global {
    namespace Express {
        interface Request {
            user_id: string;
            email: string;
            name: string;
        }
    }
}

export enum commentType {
    article,
    comment,
}

export enum likeType {
    article,
    comment,
}

export interface CreateBlogData {
    title: string;
    content: [];
    tags: string[];
}

export enum httpStatusCode {
    OK = 200,
    CREATED = 201,
    NO_CONTENT = 204,
    BAD_REQUEST = 400,
    UNAUTHORIZED = 401,
    FORBIDDEN = 403,
    NOT_FOUND = 404,
    INTERNAL_SERVER_ERROR = 500,
}

export interface payload extends JwtPayload {
    email: string;
    name: string;
    id: string;
}
