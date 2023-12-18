import { httpStatusCode } from '@customtype/index';
import FollowService from '@service/followService';
import asyncHandler from '@utils/asynHandler';
import { Request, Response } from 'express';

const toggleFollow = asyncHandler(async (req: Request, res: Response) => {
    const { followeeId } = req.params;
    const followService = new FollowService();
    const follow_unfollow = await followService.addFollowers(
        req.user_id,
        followeeId,
    );
    return res.status(httpStatusCode.OK).json({ data: follow_unfollow });
});

export default toggleFollow;
