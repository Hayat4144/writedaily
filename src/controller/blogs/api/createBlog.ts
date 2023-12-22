import { CreateBlogData, httpStatusCode } from '@customtype/index';
import BlogService from '@service/BlogService';
import asyncHandler from '@utils/asynHandler';
import { NewArticle } from 'db/schema';
import { Request, Response } from 'express';

const createBlog = asyncHandler(async (req: Request, res: Response) => {
    const { title, content } = req.body;
    const service = new BlogService();
    const data: NewArticle = {
        title,
        content,
        authorId: req.user_id,
    };
    const addblog = await service.createBlog(data);
    return res.status(httpStatusCode.OK).json({ data: addblog });
});

export default createBlog;
