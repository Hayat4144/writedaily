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

export const deleteArticle = async (token: string, id: string) => {
    const response = await fetch(
        `${BASE_URL}/api/v1/delete/article?articleId=${id}`,
        {
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        },
    );
    const { error, data } = await response.json();
    return error ? { error } : { data };
};
