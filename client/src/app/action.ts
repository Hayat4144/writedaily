'use server';

import CommentAPi from '@/externalapi/Comment';
import ToggleLike from '@/externalapi/ToggleLike';
import { updateProfile } from '@/externalapi/UserService';
import {
    createArticle,
    publishArticle,
    unpublishArticle,
} from '@/externalapi/article';
import { ProfileFormValues, commentType, likeType } from '@/types';
import { revalidateTag } from 'next/cache';

export const publishArticleAction = async (
    publishedData: FormData,
    config: any,
) => {
    const { data, error } = await publishArticle(publishedData, config);
    console.log(data, error);
    if (error) return { error };
    revalidateTag('articleById');
    revalidateTag('userArticles');
    return { data };
};

export const createArticleActions = async (token: string, value: any) => {
    const { data, error } = await createArticle(token, value);
    if (error) return { error };
    revalidateTag('userArticles');
    return { data };
};

export const unpublishaArticleActions = async (token: string, id: string) => {
    if (!token) return { error: 'Token is not provided.' };
    else if (!id) return { error: 'Id is not provider' };
    const { data, error } = await unpublishArticle(token, id);
    console.log(JSON.stringify({ data, error }));
    if (error) return { error };
    revalidateTag('articleById');
    return { data };
};

export const updateProfileActions = async (
    values: ProfileFormValues,
    token: string,
) => {
    const { data, error } = await updateProfile(token, values);
    if (error) return { error };
    revalidateTag('userById');
    return { data };
};

export const ToggleLikeAction = async (
    token: string,
    id: string,
    type: likeType,
) => {
    const { data, error } = await ToggleLike(token, id, type);
    if (error) return { error };
    revalidateTag('articleById');
    return { data };
};

export const CommentAction = async (
    token: string,
    content: string,
    id: string,
    type: commentType,
) => {
    const { data, error } = await CommentAPi(token, content, id, type);
    if (error) return { error };
    revalidateTag('articleById');
    return { data };
};
