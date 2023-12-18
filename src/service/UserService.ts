import db from '@db/index';
import { User, users } from '@db/schema';
import { eq } from 'drizzle-orm';

type UserDetails = Omit<User, 'password'>;

interface userservice {
    isUserExist(id: string): Promise<UserDetails | undefined>;
}

class UserService implements userservice {
    async isUserExist(id: string): Promise<UserDetails | undefined> {
        const isUser = await db.query.users.findFirst({
            where: eq(users.id, id),
            columns: {
                password: false,
            },
        });
        return isUser;
    }
}

export default UserService;
