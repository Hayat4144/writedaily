import { FollowsData, follows } from '@db/schema';
import UserService from './UserService';
import { CustomError } from '@utils/CustomError';
import { httpStatusCode } from '@customtype/index';
import db from '@db/index';
import { eq, sql } from 'drizzle-orm';
import { and } from 'drizzle-orm';
import { userRemoveField } from '@utils/constant';

type followReturnData = {
    type: 'unfollow' | 'follow';
    resultData: FollowsData | undefined;
};

interface followerServicemethods {
    addFollowers(
        followerId: string,
        followeeId: string,
    ): Promise<followReturnData | undefined>;
    isAlreadyFollow(
        followerId: string,
        followeeId: string,
    ): Promise<FollowsData | undefined>;
    unfollow(
        followerId: string,
        followeeId: string,
    ): Promise<FollowsData | undefined>;
    countfollowers(followeeId: string): Promise<number>;
    countfollowing(followeeId: string): Promise<number>;
    followers(followeeId: string): Promise<FollowsData[]>;
    following(followeeId: string): Promise<FollowsData[]>;
}

class FollowService extends UserService implements followerServicemethods {
    async following(followeeId: string): Promise<FollowsData[]> {
        const allFollowings = await db.query.follows.findMany({
            where: eq(follows.followerId, followeeId),
            with: {
                follower: {
                    columns: userRemoveField,
                },
            },
        });
        return allFollowings;
    }

    async followers(followeeId: string): Promise<FollowsData[]> {
        const allFollowers = await db.query.follows.findMany({
            where: eq(follows.followeeId, followeeId),
            with: {
                follower: {
                    columns: userRemoveField,
                },
            },
        });
        return allFollowers;
    }

    async countfollowing(followeeId: string): Promise<number> {
        const [{ numbeOfFollowing }] = await db
            .select({
                numbeOfFollowing: sql`count(*)`.mapWith(Number).as('count'),
            })
            .from(follows)
            .where(eq(follows.followerId, followeeId));
        return numbeOfFollowing;
    }

    async countfollowers(followeeId: string): Promise<number> {
        const [{ numberOfFollowers }] = await db
            .select({
                numberOfFollowers: sql`count(*)`.mapWith(Number).as('count'),
            })
            .from(follows)
            .where(eq(follows.followeeId, followeeId));
        return numberOfFollowers;
    }

    async unfollow(
        followerId: string,
        followeeId: string,
    ): Promise<FollowsData | undefined> {
        const drop = await db
            .delete(follows)
            .where(
                and(
                    eq(follows.followeeId, followeeId),
                    eq(follows.followerId, followerId),
                ),
            )
            .returning();
        return drop[0];
    }

    async addFollowers(
        followerId: string,
        followeeId: string,
    ): Promise<followReturnData | undefined> {
        const isUserExist = await this.isUserExist(followeeId);
        if (!isUserExist) {
            throw new CustomError(
                `Followee does not exist`,
                httpStatusCode.BAD_REQUEST,
            );
        }
        console.log(followeeId, isUserExist.id);
        if (isUserExist.id === followerId) {
            throw new CustomError(
                'you can not follow to yourself.',
                httpStatusCode.BAD_REQUEST,
            );
        }
        const isFollow = await this.isAlreadyFollow(followeeId, followerId);
        if (isFollow) {
            const unfollow = await this.unfollow(followerId, followeeId);
            const unfollowData: followReturnData = {
                type: 'unfollow',
                resultData: unfollow,
            };
            return unfollowData;
        }
        const addFollows = await db
            .insert(follows)
            .values({ followeeId, followerId })
            .returning();
        const followData: followReturnData = {
            type: 'follow',
            resultData: addFollows[0],
        };
        return followData;
    }
    async isAlreadyFollow(
        followeeId: string,
        followerId: string,
    ): Promise<FollowsData | undefined> {
        const isExist = await db.query.follows.findFirst({
            where: and(
                eq(follows.followerId, followerId),
                eq(follows.followeeId, followeeId),
            ),
        });
        return isExist;
    }
}

export default FollowService;
