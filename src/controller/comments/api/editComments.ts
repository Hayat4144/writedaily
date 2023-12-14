import { httpStatusCode } from '@customtype/index';
import BlogService from '@service/BlogService';
import CommentService from '@service/CommentService';
import asyncHandler from '@utils/asynHandler';
import { Request, Response } from 'express';

const editComment = asyncHandler(async (req: Request, res: Response) => {
    const { content, id } = req.body;
    const articleService = new BlogService();
    const commentService = new CommentService(articleService);
    const editedComment = await commentService.editComment(
        req.user_id,
        id,
        content,
    );
    if (!editedComment || editComment.length < 1) {
        return res
            .status(httpStatusCode.BAD_REQUEST)
            .json({ error: 'Something went wrong please try agian.' });
    }
    return res.status(httpStatusCode.OK).json({ data: editedComment });
});

export default editComment;
