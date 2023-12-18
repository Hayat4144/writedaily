import { httpStatusCode } from '@customtype/index';
import FollowService from '@service/followService';
import asyncHandler from '@utils/asynHandler';
import { Request, Response } from 'express';

const CountFollowing = asyncHandler(async (req: Request, res: Response) => {
    const followService = new FollowService();
    const following = await followService.countfollowing(req.user_id);
    return res.status(httpStatusCode.OK).json({ data: following });
});

export default CountFollowing;
