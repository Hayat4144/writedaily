import { httpStatusCode } from '@customtype/index';
import BlogService from '@service/BlogService';
import asyncHandler from '@utils/asynHandler';
import { Request, Response } from 'express';

const deleteBlog = asyncHandler(async (req: Request, res: Response) => {
    const { articleId } = req.query;
    const service = new BlogService();
    const deletedBlog = await service.deleteBlog(
        articleId as string,
        req.user_id,
    );
    if (deletedBlog) {
        return res.status(httpStatusCode.OK).json({
            data: `${deletedBlog.title} has been deleted successfully.`,
        });
    }
});

export default deleteBlog;
