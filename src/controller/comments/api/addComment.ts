import { httpStatusCode } from '@customtype/index';
import BlogService from '@service/ArticleService';
import CommentService from '@service/CommentService';
import asyncHandler from '@utils/asynHandler';
import { Request, Response } from 'express';

const addComment = asyncHandler(async (req: Request, res: Response) => {
    const { content, commentType, commentableId } = req.body;
    const articleService = new BlogService();
    const commentService = new CommentService(articleService);
    const insertComment = await commentService.addComment(
        req.user_id,
        content,
        commentableId,
        commentType,
    );
    return res.status(httpStatusCode.OK).json({ data: insertComment[0] });
});

export default addComment;
