import { BASE_URL } from '@/lib/constant';

export const Addtopic = async (name: string) => {
    const response = await fetch(`${BASE_URL}/api/v1/add/topic`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name }),
    });

    const { error, data } = await response.json();
    if (response.status !== 200) {
        return { error };
    }
    return { data };
};

const searchTopic = async (query: string) => {
    const response = await fetch(
        `${BASE_URL}/api/v1/search/topic?name=${query}`,
        {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        },
    );

    const { error, data } = await response.json();
    if (response.status !== 200) {
        return { error };
    }
    return { data };
};

export default searchTopic;
