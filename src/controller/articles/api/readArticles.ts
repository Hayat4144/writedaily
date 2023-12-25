import { httpStatusCode } from '@customtype/index';
import ArticleService from '@service/ArticleService';
import asyncHandler from '@utils/asynHandler';
import pagination from '@utils/pagination';
import { Request, Response } from 'express';

const readArticle = asyncHandler(async (req: Request, res: Response) => {
    let { page, resultPerPage } = req.query;
    const perpage = Number(resultPerPage) || 20;
    const currentPage = Number(page) || 1;
    const skip = pagination(perpage, currentPage);
    const service = new ArticleService();
    const Articles = await service.getArticles(req.user_id, skip, perpage);
    return res
        .status(httpStatusCode.OK)
        .json({ data: { results: Articles[0], total_result: Articles[1] } });
});

export default readArticle;
