import { httpStatusCode } from '@customtype/index';
import FollowService from '@service/followService';
import asyncHandler from '@utils/asynHandler';
import { Request, Response } from 'express';

const CountFollowing = asyncHandler(async (req: Request, res: Response) => {
    const { user_id } = req.params;
    const followService = new FollowService();
    const following = await followService.countfollowing(user_id);
    return res.status(httpStatusCode.OK).json({ data: following });
});

export default CountFollowing;
