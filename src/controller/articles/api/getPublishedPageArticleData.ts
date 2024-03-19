import { httpStatusCode } from '@customtype/index';
import ArticleService from '@service/ArticleService';
import asyncHandler from '@utils/asynHandler';
import { Request, Response } from 'express';
const articleService = new ArticleService();

const articleData = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await articleService.articleData(id);
    return res.status(httpStatusCode.OK).json({ data: result });
});

export default articleData;
