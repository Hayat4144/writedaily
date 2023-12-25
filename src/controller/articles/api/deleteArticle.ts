import { httpStatusCode } from '@customtype/index';
import ArticleService from '@service/ArticleService';
import asyncHandler from '@utils/asynHandler';
import { Request, Response } from 'express';

const deleteArticle = asyncHandler(async (req: Request, res: Response) => {
    const { articleId } = req.query;
    const service = new ArticleService();
    const deletedArticle = await service.deleteArticle(
        articleId as string,
        req.user_id,
    );
    if (deletedArticle) {
        return res.status(httpStatusCode.OK).json({
            data: `${deletedArticle.title} has been deleted successfully.`,
        });
    }
});

export default deleteArticle;
