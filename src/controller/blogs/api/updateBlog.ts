import { httpStatusCode } from '@customtype/index';
import BlogService from '@service/BlogService';
import asyncHandler from '@utils/asynHandler';
import { Request, Response } from 'express';

const updateBlog = asyncHandler(async (req: Request, res: Response) => {
    const { data, id } = req.body;
    const service = new BlogService();
    const updatedData = await service.updateBlog(data, req.user_id, id);
    return res.status(httpStatusCode.OK).json({ data: updatedData });
});

export default updateBlog;
