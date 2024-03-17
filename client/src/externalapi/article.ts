import { BASE_URL } from '@/lib/constant';

export const publishArticle = async (publishedData: FormData, config: any) => {
    const response = await fetch(`${BASE_URL}/api/v1/publish/article`, {
        method: 'POST',
        headers: config,
        body: publishedData,
    });
    const { error, data } = await response.json();
    return error ? { error } : { data };
};

export const listenArticle = async (encodedData: any) => {
    const response = await fetch(`${BASE_URL}/api/v1/article/listen`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/octet-stream',
        },
        body: encodedData,
    });
    const { error, data } = await response.json();
    return error ? { error } : { data };
};

export const userArticles = async (userId: string, page?: number) => {
    const response = await fetch(
        `${BASE_URL}/api/v1/read/articles?page=${page || 1}&user_id=${userId}`,
        {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        },
    );
    const { error, data } = await response.json();
    return error ? { error } : { data };
};

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

export const updateArticle = async (token: string, datas: any, id: string) => {
    const response = await fetch(`${BASE_URL}/api/v1/update/article`, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id, data: { ...datas } }),
    });
    const { error, data } = await response.json();
    return error ? { error } : { data };
};

export const articleById = async (token: string, id: string) => {
    const response = await fetch(`${BASE_URL}/api/v1/article/${id}`, {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        next: {
            tags: ['articleById'],
        },
    });
    const { error, data } = await response.json();
    return error ? { error } : { data };
};
