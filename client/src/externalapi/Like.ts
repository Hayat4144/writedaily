import { BASE_URL } from '@/lib/constant';

export const getArticleLikes = async (id: string) => {
    const response = await fetch(`${BASE_URL}/api/v1/article/likes/${id}`, {
        headers: {
            'Content-Type': 'application/json',
        },
        next: {
            tags: ['articleLikes'],
        },
    });
    const { data, error } = await response.json();
    if (response.status !== 200) return { error };
    else return { data };
};
