import { httpStatusCode } from '@customtype/index';
import LikeService from '@service/LikeService';
import asyncHandler from '@utils/asynHandler';
import { Request, Response } from 'express';

const addLike = asyncHandler(async (req: Request, res: Response) => {
    const { likebleId, likeType } = req.body;
    console.log(req.body);
    const likeService = new LikeService();
    const toggleLike = await likeService.addlikes(
        likeType,
        req.user_id,
        likebleId,
    );
    return res.status(httpStatusCode.OK).json({ data: toggleLike });
});

export default addLike;
