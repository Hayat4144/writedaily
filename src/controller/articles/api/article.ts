import { httpStatusCode } from '@customtype/index';
import BlogService from '@service/ArticleService';
import asyncHandler from '@utils/asynHandler';
import { Request, Response } from 'express';

const article = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const articleService = new BlogService();
    const article = await articleService.ArtcleById(id);
    return res.status(httpStatusCode.OK).json({ data: article });
});

export default article;
