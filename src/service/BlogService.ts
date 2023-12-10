import prisma from '@config/databaseConfig';
import { CreateBlogData, httpStatusCode } from '@customtype/index';
import { Blog as PrismaBlog } from '@prisma/client';
import { CustomError } from '@utils/CustomError';

interface Blogs {
    createBlog(data: CreateBlogData, userId: string): Promise<PrismaBlog>;
    updateBlog(
        update: any,
        user_id: string,
        blogId: string,
    ): Promise<PrismaBlog>;
    deleteBlog(id: string, userId: string): Promise<PrismaBlog>;
    getBlogs(
        userId: string,
        sortIn: object | [],
        Skip: number,
        ResultPerPage: number,
    ): Promise<[PrismaBlog[], number]>;
    BlogById(id: string): Promise<PrismaBlog | null>;
}

class BlogService implements Blogs {
    async createBlog(
        data: CreateBlogData,
        userId: string,
    ): Promise<PrismaBlog> {
        const createnewBlog = await prisma.blog.create({
            data: {
                ...data,
                author: { connect: { id: userId } },
            },
        });
        return createnewBlog;
    }

    async updateBlog(
        updateData: any,
        userId: string,
        blogId: string,
    ): Promise<PrismaBlog> {
        const isBlogExist = await this.BlogById(blogId);
        if (!isBlogExist)
            throw new CustomError(
                'Blog does not exist.',
                httpStatusCode.BAD_REQUEST,
            );
        const updatedBlog = await prisma.blog.update({
            where: {
                id: isBlogExist.id,
                authorId: userId,
            },
            data: updateData,
        });

        return updatedBlog;
    }

    async deleteBlog(id: string, userId: string): Promise<PrismaBlog> {
        const isBlogExist = await this.BlogById(id);
        if (!isBlogExist)
            throw new CustomError(
                'Blog does not exist.',
                httpStatusCode.BAD_REQUEST,
            );

        const isBlogDeleted = await prisma.blog.delete({
            where: {
                id,
                authorId: userId,
            },
        });
        return isBlogDeleted;
    }

    async getBlogs(
        userId: string,
        sort: [] | object,
        skip: number,
        ResultPerPage: number,
    ): Promise<[PrismaBlog[], number]> {
        const blogs = await prisma.blog.findMany({
            where: {
                authorId: userId,
            },
            take: ResultPerPage,
            skip,
            orderBy: sort,
        });
        const totalBlogs = await prisma.blog.count({
            where: {
                authorId: userId,
            },
            orderBy: sort,
        });
        const blogPromise = await Promise.all([blogs, totalBlogs]);
        return blogPromise;
    }

    async BlogById(id: string): Promise<PrismaBlog | null> {
        const isBlogExist = await prisma.blog.findUnique({
            where: {
                id,
            },
        });
        return isBlogExist;
    }
}

export default BlogService;
