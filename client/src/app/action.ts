'use server';

import CommentAPi from '@/externalapi/Comment';
import ToggleLike from '@/externalapi/ToggleLike';
import { updateProfile } from '@/externalapi/UserService';
import { unpublishArticle } from '@/externalapi/article';
import { ProfileFormValues, commentType, likeType } from '@/types';
import { revalidateTag } from 'next/cache';

export const unpublishaArticleActions = async (token: string, id: string) => {
    const { data, error } = await unpublishArticle(token, id);
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
