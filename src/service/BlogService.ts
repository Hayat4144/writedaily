import prisma from '@config/databaseConfig';
import { httpStatusCode } from '@customtype/index';
import { CustomError } from '@utils/CustomError';
import { userRemoveField } from '@utils/constant';
import db from 'db';
import {
    Article,
    NewArticle,
    articles,
    comments,
    likes,
    users,
} from 'db/schema';
import { and, asc, count, eq, getTableColumns, or, sql } from 'drizzle-orm';

interface Blogs {
    createBlog(data: NewArticle): Promise<Article[]>;
    updateBlog(update: any, user_id: string, blogId: string): Promise<Article>;
    deleteBlog(id: string, userId: string): Promise<Article>;
    getBlogs(userId: string, Skip: number, ResultPerPage: number): Promise<any>;
    isArticleExist(id: string): Promise<Article | undefined>;
    ArtcleById(id: string): Promise<any>;
}

class BlogService implements Blogs {
    async ArtcleById(id: string) {
        const isExist = await this.isArticleExist(id);
        if (!isExist)
            throw new CustomError(
                'Blog does not exist.',
                httpStatusCode.BAD_REQUEST,
            );
        const { ...rest } = getTableColumns(articles);
        const { password, email, createdAt, ...userfield } =
            getTableColumns(users);
        const article = await db
            .select({
                ...rest,
                author: userfield,
                totalLikes: sql<number>`cast(count(distinct ${likes.id}) as int)`,
                totalComments: sql<number>`cast(count(distinct ${comments.id}) as int)`,
            })
            .from(articles)
            .where(eq(articles.id, id))
            .leftJoin(users, eq(articles.authorId, users.id))
            .leftJoin(likes, eq(articles.id, likes.likebleId))
            .leftJoin(comments, eq(articles.id, comments.commentableId))
            .groupBy(articles.id, users.id)
            .orderBy(asc(articles.title));
        return article;
    }

    async createBlog(data: NewArticle): Promise<Article[]> {
        const createnewBlog = await db
            .insert(articles)
            .values(data)
            .returning();
        return createnewBlog;
    }

    async updateBlog(
        updateData: any,
        userId: string,
        blogId: string,
    ): Promise<Article> {
        const isBlogExist = await this.isArticleExist(blogId);
        if (!isBlogExist)
            throw new CustomError(
                'Blog does not exist.',
                httpStatusCode.BAD_REQUEST,
            );
        if (isBlogExist.authorId !== userId) {
            throw new CustomError(
                "You don't have rights to update the blog.",
                httpStatusCode.FORBIDDEN,
            );
        }
        const updatedBlog = await db
            .update(articles)
            .set(updateData)
            .where(and(eq(articles.id, blogId), eq(articles.authorId, userId)))
            .returning();
        return updatedBlog[0];
    }

    async deleteBlog(id: string, userId: string): Promise<Article> {
        const isBlogExist = await this.isArticleExist(id);
        if (!isBlogExist)
            throw new CustomError(
                'Blog does not exist.',
                httpStatusCode.BAD_REQUEST,
            );
        if (isBlogExist.authorId !== userId) {
            throw new CustomError(
                "You don't have rights to update the blog.",
                httpStatusCode.FORBIDDEN,
            );
        }
        const isBlogDeleted = await db
            .delete(articles)
            .where(and(eq(articles.authorId, userId), eq(articles.id, id)))
            .returning();

        return isBlogDeleted[0];
    }

    async getBlogs(
        userId: string,
        skip: number,
        ResultPerPage: number,
    ): Promise<[Article[], number]> {
        const blogs = await db.query.articles.findMany({
            where: eq(articles.authorId, userId),
            limit: ResultPerPage,
            offset: skip,
            orderBy: [asc(articles.title)],
        });
        const [{ count }] = await db
            .select({
                count: sql`count(*)`.mapWith(Number).as('count'),
            })
            .from(articles)
            .where(eq(articles.authorId, userId));
        const blogPromise = await Promise.all([blogs, count]);
        return blogPromise;
    }

    async isArticleExist(id: string): Promise<Article | undefined> {
        const isBlogExist = await db.query.articles.findFirst({
            where: eq(articles.id, id),
        });
        return isBlogExist;
    }
}

export default BlogService;
