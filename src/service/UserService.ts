import {
    DeletedData,
    ResetPasswordTokenData,
    changePasswordInterface,
    httpStatusCode,
    updatedResponse,
} from '@customtype/index';
import db from '@db/index';
import { TokenData, User, tokens, users } from '@db/schema';
import { CustomError } from '@utils/CustomError';
import { and, eq, getTableColumns } from 'drizzle-orm';
import bcrypt from 'bcrypt';
import jwt, { SignOptions } from 'jsonwebtoken';
import { getPrivateKeySecret, options } from '@utils/jwt';

type UserDetails = Omit<User, 'password'>;

interface userservice {
    isUserExist(id: string): Promise<UserDetails | undefined>;
    changePassword(
        newpassword: string,
        oldpassword: string,
        confirmpassword: string,
        user_id: string,
    ): Promise<changePasswordInterface>;
    isTokenExist(userId: string): Promise<any | undefined>;
    isUserByEmail(email: string): Promise<UserDetails | undefined>;
    generateResetPasswordToken(data: ResetPasswordTokenData): string;
    addResetPasswordToken(token: string, user_id: string): Promise<TokenData>;
    isValidToken(token: string): Promise<TokenData | undefined>;
    deleteToken(id: string): Promise<DeletedData>;
    updatePassword(userId: string, password: string): Promise<updatedResponse>;
    updateProfile(userId: string, data: any): Promise<any>;
}

class UserService implements userservice {
    jwtTokenOption: SignOptions;

    constructor() {
        this.jwtTokenOption = options;
    }

    async updateProfile(userId: string, data: any) {
        const { password, providerId, provider, createdAt, ...userColumn } =
            getTableColumns(users);
        const updatedData = await db
            .update(users)
            .set(data)
            .where(eq(users.id, userId))
            .returning(userColumn);
        return updatedData[0];
    }

    async updatePassword(
        userId: string,
        password: string,
    ): Promise<updatedResponse> {
        const updatePassword = await db
            .update(users)
            .set({ password })
            .where(eq(users.id, userId));
        return updatePassword?.rowCount === 1
            ? { updated: true }
            : { updated: false };
    }

    async deleteToken(id: string): Promise<DeletedData> {
        const droptoken = await db
            .delete(tokens)
            .where(eq(tokens.id, id))
            .returning({ id: tokens.id });
        return { deleted: true, id: droptoken[0].id };
    }

    async isValidToken(token: string): Promise<TokenData | undefined> {
        const isValid = await db.query.tokens.findFirst({
            where: eq(tokens.token, token),
        });
        return isValid;
    }

    async addResetPasswordToken(
        token: string,
        userId: string,
    ): Promise<TokenData> {
        const insertToken = await db
            .insert(tokens)
            .values({ token, userId })
            .returning();
        return insertToken[0];
    }

    generateResetPasswordToken(data: ResetPasswordTokenData): string {
        const token = jwt.sign(data, getPrivateKeySecret(), {
            ...this.jwtTokenOption,
            expiresIn: '10m',
        });
        return token;
    }

    async isUserByEmail(email: string): Promise<UserDetails | undefined> {
        const user = await db.query.users.findFirst({
            where: eq(users.email, email),
            columns: {
                password: false,
            },
        });
        return user;
    }
    async isTokenExist(userId: string): Promise<any | undefined> {
        const isToken = await db.query.tokens.findFirst({
            where: eq(tokens.userId, userId),
            with: {
                user: {
                    columns: {
                        password: false,
                        createdAt: false,
                        name: false,
                    },
                },
            },
        });
        return isToken;
    }
    async changePassword(
        newpassword: string,
        oldpassword: string,
        confirmpassword: string,
        user_id: string,
    ): Promise<changePasswordInterface> {
        if (newpassword !== confirmpassword) {
            throw new CustomError(
                "Your password does'n match.",
                httpStatusCode.BAD_REQUEST,
            );
        }
        const isUserExist = await db.query.users.findFirst({
            where: eq(users.id, user_id),
        });
        if (!isUserExist) {
            throw new CustomError(
                'User does not exist.',
                httpStatusCode.BAD_REQUEST,
            );
        }

        const isValidPassword = await bcrypt.compare(
            oldpassword,
            isUserExist.password,
        );
        if (!isValidPassword) {
            throw new CustomError(
                'Invalid password',
                httpStatusCode.BAD_REQUEST,
            );
        }

        const hashPassword = await bcrypt.hash(newpassword, 10);

        const updatePassword = await this.updatePassword(
            isUserExist.id,
            hashPassword,
        );
        return updatePassword.updated ? { success: true } : { success: false };
    }

    async isUserExist(id: string): Promise<UserDetails | undefined> {
        const isUser = await db.query.users.findFirst({
            where: eq(users.id, id),
            columns: {
                password: false,
            },
        });
        return isUser;
    }
}

export default UserService;
