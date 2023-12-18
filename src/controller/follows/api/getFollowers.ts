import { httpStatusCode } from '@customtype/index';
import FollowService from '@service/followService';
import asyncHandler from '@utils/asynHandler';
import { Request, Response } from 'express';

const getFollowers = asyncHandler(async (req: Request, res: Response) => {
    const followService = new FollowService();
    const followers = await followService.followers(req.user_id);
    return res.status(httpStatusCode.OK).json({ data: followers });
});

export default getFollowers;
