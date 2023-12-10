import { CreateBlogData, httpStatusCode } from '@customtype/index';
import BlogService from '@service/BlogService';
import asyncHandler from '@utils/asynHandler';
import { Request, Response } from 'express';

const createBlog = asyncHandler(async (req: Request, res: Response) => {
    const { title, content, tags } = req.body;
    const service = new BlogService();
    const data: CreateBlogData = {
        title,
        content,
        tags,
    };
    const addblog = await service.createBlog(data, req.user_id);
    return res.status(httpStatusCode.OK).json({ data: addblog });
});

export default createBlog;
