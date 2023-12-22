import { httpStatusCode } from '@customtype/index';
import BlogService from '@service/BlogService';
import asyncHandler from '@utils/asynHandler';
import { Request, Response } from 'express';

const publishArticle = asyncHandler(async (req: Request, res: Response) => {
    let { articleId, topicsId } = req.body;
    const service = new BlogService();
    const { data } = await service.PublishArticle(
        articleId,
        topicsId,
        req.user_id,
    );
    return res
        .status(httpStatusCode.OK)
        .json({ data: `${data.title} has been published successfully.` });
});

export default publishArticle;
