import { BASE_URL } from '@/lib/constant';

const uploadFile = async (filedata: FormData) => {
    const response = await fetch(`${BASE_URL}/api/v3/upload`, {
        method: 'POST',
        body: filedata,
    });
    const { data, error } = await response.json();
    if (response.status !== 200) {
        return { error };
    }
    return { data };
};

export default uploadFile;
