import { BASE_URL } from '@/lib/constant';

const SignupUser = async (createData: object) => {
    const response = await fetch(`${BASE_URL}/api/v1/signup`, {
        method: 'POST',
        cache: 'no-store',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...createData, provider: 'credential' }),
    });

    const { error, data } = await response.json();
    if (response.status !== 200) {
        return { error };
    }
    return { data };
};

export default SignupUser;
