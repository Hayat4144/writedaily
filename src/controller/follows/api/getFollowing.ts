import { httpStatusCode } from '@customtype/index';
import FollowService from '@service/followService';
import asyncHandler from '@utils/asynHandler';
import { Request, Response } from 'express';

const getFollowing = asyncHandler(async (req: Request, res: Response) => {
    const followService = new FollowService();
    const following = await followService.following(req.user_id);
    return res.status(httpStatusCode.OK).json({ data: following });
});

export default getFollowing;
