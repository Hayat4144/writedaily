import { httpStatusCode } from '@customtype/index';
import ArticleService from '@service/ArticleService';
import asyncHandler from '@utils/asynHandler';
import pagination from '@utils/pagination';
import { Request, Response } from 'express';
const articleService = new ArticleService();

const Feed = asyncHandler(async (req: Request, res: Response) => {
    let { page }: { page?: number } = req.query;
    if (!page) {
        page = 0;
    }
    const resultPerPage = 20;
    const skip = pagination(resultPerPage, page);
    const response = await articleService.articleFeed(skip, resultPerPage);
    return res
        .status(httpStatusCode.OK)
        .json({ data: { results: response[0], total_result: response[1] } });
});

export default Feed;
