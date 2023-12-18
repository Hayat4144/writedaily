import { httpStatusCode } from '@customtype/index';
import LikeService from '@service/LikeService';
import asyncHandler from '@utils/asynHandler';
import { Request, Response } from 'express';

const articleLikes = asyncHandler(async (req: Request, res: Response) => {
    const { articleId } = req.params;
    const likeService = new LikeService();
    const likes = await likeService.getArticleLikes(articleId);
    return res.status(httpStatusCode.OK).json({ data: likes });
});

export default articleLikes;
