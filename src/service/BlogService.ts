import prisma from '@config/databaseConfig';
import { httpStatusCode } from '@customtype/index';
import { CustomError } from '@utils/CustomError';
import db from 'db';
import { Article, NewArticle, articles } from 'db/schema';
import { and, asc, eq, sql } from 'drizzle-orm';

interface Blogs {
    createBlog(data: NewArticle): Promise<Article[]>;
    updateBlog(update: any, user_id: string, blogId: string): Promise<Article>;
    deleteBlog(id: string, userId: string): Promise<Article>;
    getBlogs(
        userId: string,
        Skip: number,
        ResultPerPage: number,
    ): Promise<[Article[], number]>;
    BlogById(id: string): Promise<Article | undefined>;
}

class BlogService implements Blogs {
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
        const isBlogExist = await this.BlogById(blogId);
        if (!isBlogExist)
            throw new CustomError(
                'Blog does not exist.',
                httpStatusCode.BAD_REQUEST,
            );
        const updatedBlog = await db
            .update(articles)
            .set(updateData)
            .where(and(eq(articles.id, blogId), eq(articles.authorId, userId)))
            .returning();
        return updatedBlog[0];
    }

    async deleteBlog(id: string, userId: string): Promise<Article> {
        const isBlogExist = await this.BlogById(id);
        if (!isBlogExist)
            throw new CustomError(
                'Blog does not exist.',
                httpStatusCode.BAD_REQUEST,
            );
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

    async BlogById(id: string): Promise<Article | undefined> {
        const isBlogExist = await db.query.articles.findFirst({
            where: eq(articles.id, id),
        });
        return isBlogExist;
    }
}

export default BlogService;
