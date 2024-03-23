import { BASE_URL } from '@/lib/constant';

const verifySocialtoken = async (token: any) => {
    const result = await fetch(`${BASE_URL}/api/v1/verify/socail/token`, {
        method: 'POST',
        cache: 'no-store',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            idToken: token,
        }),
    });
    const response = await result.json();
    if (result.status !== 200) {
        return { error: response.error };
    }
    return {
        access_token: response.access_token,
        refresh_token: response.refresh_token,
    };
};

export default verifySocialtoken;
