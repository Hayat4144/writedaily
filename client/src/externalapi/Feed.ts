import { BASE_URL } from '@/lib/constant';

const Feed = async (token: string) => {
    const response = await fetch(`${BASE_URL}/api/v1/feed/`, {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    const { data, error } = await response.json();
    if (response.status !== 200) return { error };
    else return { data };
};

export { Feed };
