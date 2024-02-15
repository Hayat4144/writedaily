import { BASE_URL } from '@/lib/constant';

export const createArticle = async (token: string, articleData: object) => {
    const response = await fetch(`${BASE_URL}/api/v1/create/article`, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...articleData }),
    });
    const { error, data } = await response.json();
    return error ? { error } : { data };
};
