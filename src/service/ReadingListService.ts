import db from '@db/index';
import { NewreadingList, ReadingList, ReadingListData } from '@db/schema';
import BlogService from './BlogService';
import { CustomError } from '@utils/CustomError';
import { httpStatusCode } from '@customtype/index';
import { and, asc, eq, sql } from 'drizzle-orm';

class ReadingListService extends BlogService {
    async allReadingList(skip: number, resultPerPage: number, userId: string) {
        const lists = await db.query.ReadingList.findMany({
            where: eq(ReadingList.userId, userId),
            with: {
                artilce: {
                    columns: {
                        id: true,
                        title: true,
                        content: true,
                    },
                },
            },
            limit: resultPerPage,
            offset: skip,
            orderBy: asc(ReadingList.createdAt),
        });
        const [{ count }] = await db
            .select({
                count: sql`count(*)`.mapWith(Number).as('count'),
            })
            .from(ReadingList)
            .where(eq(ReadingList.userId, userId));
        const listPromise = await Promise.all([lists, count]);
        return listPromise;
    }

    async add(data: NewreadingList) {
        const isArticleExist = await this.isArticleExist(data.articleId);
        if (!isArticleExist) {
            throw new CustomError(
                'Article does not exist.',
                httpStatusCode.BAD_REQUEST,
            );
        }
        const isListAlreadyExist = await db.query.ReadingList.findFirst({
            where: and(
                eq(ReadingList.articleId, data.articleId),
                eq(ReadingList.userId, data.userId),
            ),
        });

        if (isListAlreadyExist) {
            throw new CustomError(
                `${isArticleExist.title} is already in reading list.`,
                httpStatusCode.BAD_REQUEST,
            );
        }

        await db.insert(ReadingList).values(data);
        return {
            data: `${isArticleExist.title} has been add to reading list.`,
        };
    }
    async delete(id: string, userid: string) {
        const isExist = await this.isReadingListExist(id);
        if (!isExist) {
            throw new CustomError(
                'Reading list does not exist.',
                httpStatusCode.BAD_REQUEST,
            );
        }
        if (isExist.userId !== userid) {
            throw new CustomError(
                "You are unauthorized. you don't have rights delete it.",
                httpStatusCode.FORBIDDEN,
            );
        }
        const drop = await db
            .delete(ReadingList)
            .where(eq(ReadingList.id, id))
            .returning();
        return drop;
    }

    async isReadingListExist(id: string) {
        return await db.query.ReadingList.findFirst({
            where: eq(ReadingList.id, id),
        });
    }
}

export default ReadingListService;
