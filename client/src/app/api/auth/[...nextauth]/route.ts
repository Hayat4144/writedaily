import { BASE_URL } from '@/lib/constant';
import { decodeToken, isResfreshToken } from '@/lib/jwt';
import { NextAuthOptions } from 'next-auth';
import NextAuth from 'next-auth/next';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import userExist from '@/externalapi/userExist';
import SignupUser from '@/externalapi/SignupUser';
import verifySocialtoken from '@/externalapi/VerifySocailtoken';

const RefreshAccessToken = async (
    accessToken: string,
    refreshtoken: string,
) => {
    try {
        const tokenResponse = await fetch(
            `${BASE_URL}/api/v1/token/rotation?refreshtoken=${refreshtoken}`,
            {
                method: 'GET',
                cache: 'no-cache',
                headers: {
                    'Content-Type': 'application/json',
                },
            },
        );
        const { AccessToken, Refreshtoken, error } = await tokenResponse.json();
        if (tokenResponse.status !== 200) {
            return Promise.reject(new Error(error));
        }
        return { AccessToken, Refreshtoken };
    } catch (error: any) {
        return {
            AccessToken: accessToken,
            Refreshtoken: refreshtoken,
            error: 'RefreshAccessTokenError',
        };
    }
};

const providers = [
    GoogleProvider({
        clientId: process.env.GOOGLE_ID as string,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
        authorization: {
            params: {
                prompt: 'consent',
                access_type: 'offline',
                response_type: 'code',
            },
        },
    }),
    CredentialsProvider({
        name: 'Credentials',
        credentials: {},
        async authorize(credentials: any) {
            const result = await fetch(`${BASE_URL}/api/v1/signin`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: credentials?.email,
                    password: credentials?.password,
                }),
            });
            const response = await result.json();
            if (result.status !== 200) {
                return Promise.reject(new Error(response.error));
            }
            return response;
        },
    }),
];

export const authOptions: NextAuthOptions = {
    session: {
        strategy: 'jwt',
        maxAge: 30 * 24 * 60 * 60, // 30 days
    },
    secret: process.env.NEXTAUTH_SECRET,
    providers,
    callbacks: {
        signIn: async ({ account, user }) => {
            if (account?.provider && account.provider === 'google') {
                const isUser = await userExist(user.email as string);
                if (isUser.error) {
                    const [firstName, lastName] = user.name?.split(
                        '  ',
                    ) as string[];
                    const createUser = {
                        email: user.email,
                        provider: account.provider,
                        providerId: account.providerAccountId,
                        profilePic: user.image,
                        name: firstName + lastName,
                    };

                    const signup = await SignupUser(createUser);
                    if (signup.error) {
                        return Promise.reject(new Error(signup.error));
                    }
                    return true;
                } else {
                    return true;
                }
            }
            return true;
        },
        jwt: async ({ token, user, account, trigger, session }) => {
            /* Token is stored data after the successfull login
         user is return variable from the providers.the user is undefined initially.
        it is only avaible at login time at successful login 
      */
            try {
                if (user) {
                    // This will only be executed at login. Each next invocation will skip this part.
                    if (
                        account?.provider === 'google' ||
                        account?.provider === 'email'
                    ) {
                        const verifyToken = await verifySocialtoken(
                            account.id_token,
                        );

                        if (verifyToken.error) {
                            return Promise.reject(new Error(verifyToken.error));
                        }
                        token.AccessToken = verifyToken.data;
                    } else {
                        const AccessToken = await decodeToken(user.AccessToken);
                        token.AccessToken = user.AccessToken;
                        token.AccessTokenExpiry = AccessToken.exp;
                        token.RefreshToken = user.RefreshToken;
                    }
                }

                if (trigger === 'update') {
                    token = { ...token, ...session.user };
                }

                const shouldRefreshTime = isResfreshToken(
                    token.AccessTokenExpiry,
                );
                if (!shouldRefreshTime) {
                    return token;
                }
                const refreshTokenData = await RefreshAccessToken(
                    token.AccessToken,
                    token.RefreshToken,
                );

                if (refreshTokenData.error) {
                    // clear all data token session add the provide like thing in the client side to check
                    // if there is any error occured in the session or token logout the user and redirect
                    // to the signin page.
                    token.error = refreshTokenData.error;
                    return token;
                }

                const { exp } = await decodeToken(refreshTokenData.AccessToken);
                return {
                    ...token,
                    AccessToken: refreshTokenData.AccessToken,
                    RefreshToken: refreshTokenData.Refreshtoken,
                    AccessTokenExpiry: exp,
                };
            } catch (error: any) {
                throw Promise.reject(error);
            }
        },
        session: async ({ session, token }) => {
            if (token) {
                const accessToken = await decodeToken(token.AccessToken);
                session.user.AccessToken = token.AccessToken;
                session.user.RefreshToken = token.RefreshToken;
                session.user.id = accessToken.id;
                session.user.email = accessToken.email;
                session.user.name = accessToken.name;
                session.user.image = (token.image as string) || token.picture;
                session.error = token.error;
            }

            return session;
        },
    },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
