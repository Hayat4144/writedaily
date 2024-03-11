import { BASE_URL } from '@/lib/constant';

const Feed = async (page: number) => {
    const response = await fetch(`${BASE_URL}/api/v1/feed?page=${page}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });
    const { data, error } = await response.json();
    if (response.status !== 200) return { error };
    else return { data };
};

export { Feed };
