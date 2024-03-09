import { BASE_URL } from '@/lib/constant';

export const updateProfile = async (token: string, updateData: any) => {
    const response = await fetch(`${BASE_URL}/api/v1/user/update/profile`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ ...updateData }),
    });

    const { error, data } = await response.json();
    if (response.status !== 200) {
        return { error };
    }
    return { data };
};

export const userById = async (id: string) => {
    const response = await fetch(`${BASE_URL}/api/v1/get/user/by/${id}`, {
        cache: 'no-store',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    const { error, data } = await response.json();
    if (response.status !== 200) {
        return { error };
    }
    return { data };
};

export const CountFollowers = async (id: string) => {
    const response = await fetch(`${BASE_URL}/api/v1/count/followers/${id}`, {
        cache: 'no-store',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    const { error, data } = await response.json();
    if (response.status !== 200) {
        return { error };
    }
    return { data };
};

export const CountFollowings = async (token: string) => {
    const response = await fetch(`${BASE_URL}/api/v1/count/following`, {
        cache: 'no-store',
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
    });

    const { error, data } = await response.json();
    if (response.status !== 200) {
        return { error };
    }
    return { data };
};
