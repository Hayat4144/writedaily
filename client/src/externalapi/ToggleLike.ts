import { BASE_URL } from '@/lib/constant';
import { likeType } from '@/types';

const ToggleLike = async (
    token: string,
    likebleId: string,
    likeType: likeType,
) => {
    const response = await fetch(`${BASE_URL}/api/v1/add/like`, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ likeType, likebleId }),
    });
    const { data, error } = await response.json();
    if (response.status !== 200) return { error };
    else return { data };
};

export default ToggleLike;
