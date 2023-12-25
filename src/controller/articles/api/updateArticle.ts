import { httpStatusCode } from '@customtype/index';
import ArticleService from '@service/ArticleService';
import asyncHandler from '@utils/asynHandler';
import { Request, Response } from 'express';

const updateArticle = asyncHandler(async (req: Request, res: Response) => {
    const { data, id } = req.body;
    const service = new ArticleService();
    const updatedData = await service.updateArticle(data, req.user_id, id);
    return res.status(httpStatusCode.OK).json({ data: updatedData });
});

export default updateArticle;
