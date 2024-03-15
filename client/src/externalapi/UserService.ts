import { BASE_URL } from '@/lib/constant';

export const deleteAccount = async (token: string) => {
    const response = await fetch(`${BASE_URL}/api/v1/delete/account`, {
        method: 'DELETE',
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    const { error, data } = await response.json();
    if (response.status !== 200) {
        return { error };
    }
    return { data };
};

export const isFollowing = async (token: string, id: string) => {
    const response = await fetch(`${BASE_URL}/api/v1/check/following/${id}`, {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    const { error, data } = await response.json();
    if (response.status !== 200) {
        return { error };
    }
    return { data };
};

export const toggleFollowing = async (token: string, id: string) => {
    const response = await fetch(`${BASE_URL}/api/v1/follow/${id}`, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    const { error, data } = await response.json();
    if (response.status !== 200) {
        return { error };
    }
    return { data };
};

export const updateProfilePic = async (token: string, formData: FormData) => {
    const response = await fetch(`${BASE_URL}/api/v1/update/profile/pic`, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${token}`,
        },
        body: formData,
    });

    const { error, data } = await response.json();
    if (response.status !== 200) {
        return { error };
    }
    return { data };
};

export const changePassword = async (token: string, updateData: any) => {
    const response = await fetch(`${BASE_URL}/api/v1/change/password`, {
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
        headers: {
            'Content-Type': 'application/json',
        },
        next: {
            tags: ['userById'],
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

export const CountFollowings = async (id: string) => {
    const response = await fetch(`${BASE_URL}/api/v1/count/following/${id}`, {
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
