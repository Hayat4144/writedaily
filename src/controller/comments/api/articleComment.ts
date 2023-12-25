import { httpStatusCode } from '@customtype/index';
import BlogService from '@service/ArticleService';
import CommentService from '@service/CommentService';
import asyncHandler from '@utils/asynHandler';
import { Request, Response } from 'express';

const articleComments = asyncHandler(async (req: Request, res: Response) => {
    const { articleId } = req.params;
    const articleService = new BlogService();
    const commentService = new CommentService(articleService);
    const Allcomments = await commentService.articleComments(articleId);
    return res.status(httpStatusCode.OK).json({ data: Allcomments });
});

export default articleComments;
