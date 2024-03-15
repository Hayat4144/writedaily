'use server';

import { updateProfile } from '@/externalapi/UserService';
import { ProfileFormValues } from '@/types';
import { revalidateTag } from 'next/cache';

export const updateProfileActions = async (
    values: ProfileFormValues,
    token: string,
) => {
    const { data, error } = await updateProfile(token, values);
    if (error) return { error };
    revalidateTag('userById');
    return { data };
};
