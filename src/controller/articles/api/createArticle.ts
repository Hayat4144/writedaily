import { httpStatusCode } from '@customtype/index';
import ArticleService from '@service/ArticleService';
import asyncHandler from '@utils/asynHandler';
import { NewArticle } from 'db/schema';
import { Request, Response } from 'express';

const createArticle = asyncHandler(async (req: Request, res: Response) => {
    const { title, content, description } = req.body;
    const service = new ArticleService();
    const data: NewArticle = {
        title,
        content,
        description,
        authorId: req.user_id,
    };
    const addArticle = await service.createArticle(data);
    return res.status(httpStatusCode.OK).json({ data: addArticle });
});

export default createArticle;
