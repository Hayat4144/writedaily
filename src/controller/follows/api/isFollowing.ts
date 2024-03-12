import { httpStatusCode } from '@customtype/index';
import FollowService from '@service/followService';
import asyncHandler from '@utils/asynHandler';
import { Request, Response } from 'express';

const isFollowing = asyncHandler(async (req: Request, res: Response) => {
    const { followeeId } = req.params;
    const followService = new FollowService();
    const checkFollowing = await followService.isAlreadyFollow(
        followeeId,
        req.user_id,
    );
    return res.status(httpStatusCode.OK).json({ data: checkFollowing });
});

export default isFollowing;
