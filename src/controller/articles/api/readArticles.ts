import { httpStatusCode } from '@customtype/index';
import ArticleService from '@service/ArticleService';
import asyncHandler from '@utils/asynHandler';
import pagination from '@utils/pagination';
import { Request, Response } from 'express';

const readArticle = asyncHandler(async (req: Request, res: Response) => {
    let { page, resultPerPage, user_id } = req.query;
    const perpage = Number(resultPerPage) || 20;
    const currentPage = Number(page) || 1;
    const skip = pagination(perpage, currentPage);
    const service = new ArticleService();
    const Articles = await service.getArticles(
        user_id as string,
        skip,
        perpage,
    );

    const data = Articles[0].map((item: any) => {
        const totalLikes = item.likes.length;
        const totalComments = item.comments.length;
        return { ...item, totalLikes, totalComments };
    });
    return res
        .status(httpStatusCode.OK)
        .json({ data: { results: data, total_result: Articles[1] } });
});

export default readArticle;
