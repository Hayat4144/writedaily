import { httpStatusCode } from '@customtype/index';
import BlogService from '@service/BlogService';
import asyncHandler from '@utils/asynHandler';
import { Response, Request } from 'express';

const SearchArticle = asyncHandler(async (req: Request, res: Response) => {
    const { search } = req.query;
    const ArticleService = new BlogService();
    const results = await ArticleService.searchArticles(search as string);
    return res.status(httpStatusCode.OK).json({ data: results });
});

export default SearchArticle;
