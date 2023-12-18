import { comments, likes, users } from '@db/schema';
import { getTableColumns } from 'drizzle-orm';

export const userRemoveField = {
    password: false,
    email: false,
    createdAt: false,
};

export const queryRemoveField = {
    user: { columns: userRemoveField },
    userIdField: {
        userId: false,
    },
};

export const { userId, ...likeColumns } = getTableColumns(likes);
export const { ...commentColumns } = getTableColumns(comments);
export const { password, email, createdAt, ...userfield } =
    getTableColumns(users);
