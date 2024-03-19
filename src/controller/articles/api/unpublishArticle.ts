import { httpStatusCode } from '@customtype/index';
import ArticleService from '@service/ArticleService';
import asyncHandler from '@utils/asynHandler';
import { Request, Response } from 'express';

const unpublishArticle = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const service = new ArticleService();
    const updatedData = await service.UnpublishArticle(id, req.user_id);
    if (updatedData.unpublised) {
        return res
            .status(httpStatusCode.OK)
            .json({ error: updatedData.message });
    }
    return res
        .status(httpStatusCode.BAD_REQUEST)
        .json({ data: updatedData.message });
});

export default unpublishArticle;
