import { BASE_URL } from '@/lib/constant';

const CommentAPi = async (
    token: string,
    content: string,
    commentableId: string,
    commentType: string,
) => {
    const response = await fetch(`${BASE_URL}/api/v1/add/comment`, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content, commentType, commentableId }),
    });
    const { data, error } = await response.json();
    if (response.status !== 200) return { error };
    else return { data };
};

export default CommentAPi;
