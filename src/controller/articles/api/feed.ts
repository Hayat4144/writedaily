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
    const skip = pagination(20, page);
    const response = await articleService.articleFeed(skip, 20);
    return res.status(httpStatusCode.OK).json({ data: response });
});

export default Feed;
