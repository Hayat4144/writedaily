import { httpStatusCode } from '@customtype/index';
import BlogService from '@service/BlogService';
import CommentService from '@service/CommentService';
import asyncHandler from '@utils/asynHandler';
import { Request, Response } from 'express';

const deleteComment = asyncHandler(async (req: Request, res: Response) => {
    const { deleteId } = req.query;
    const articleService = new BlogService();
    const commentService = new CommentService(articleService);
    const deletedComment = await commentService.deleteComment(
        req.user_id,
        deleteId as string,
    );
    if (!deletedComment || deleteComment.length < 1) {
        return res
            .status(httpStatusCode.BAD_REQUEST)
            .json({ error: 'Something went wrong please try agian.' });
    }
    return res
        .status(httpStatusCode.OK)
        .json({ data: `Comment has been deleted successfully.` });
});

export default deleteComment;
