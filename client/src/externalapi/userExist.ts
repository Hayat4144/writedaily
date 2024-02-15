import { BASE_URL } from '@/lib/constant';

const userExist = async (email: string) => {
    const response = await fetch(`${BASE_URL}/api/v1/get/user?email=${email}`, {
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

export default userExist;
