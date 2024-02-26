import { BASE_URL } from '@/lib/constant';

const userArticles = async (token: string) => {
    const response = await fetch(`${BASE_URL}/api/v1/read/articles/`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    const { data, error } = await response.json();
    if (response.status !== 200) return { error };
    else return { data };
};

export default userArticles;
