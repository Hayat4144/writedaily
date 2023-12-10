import { httpStatusCode } from '@customtype/index';
import BlogService from '@service/BlogService';
import asyncHandler from '@utils/asynHandler';
import pagination from '@utils/pagination';
import { Request, Response } from 'express';

const readBlog = asyncHandler(async (req: Request, res: Response) => {
    let { page, resultPerPage } = req.query;
    const perpage = Number(resultPerPage) || 20;
    const currentPage = Number(page) || 1;
    const skip = pagination(perpage, currentPage);
    const service = new BlogService();
    const blogs = await service.getBlogs(
        req.user_id,
        { title: 'asc' },
        skip,
        perpage,
    );
    return res
        .status(httpStatusCode.OK)
        .json({ data: { results: blogs[0], total_result: blogs[1] } });
});

export default readBlog;
