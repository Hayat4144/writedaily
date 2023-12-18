import { httpStatusCode } from '@customtype/index';
import FollowService from '@service/followService';
import asyncHandler from '@utils/asynHandler';
import { Request, Response } from 'express';

const CountFollowers = asyncHandler(async (req: Request, res: Response) => {
    const { followeeId } = req.params;
    const followService = new FollowService();
    const followers = await followService.countfollowers(followeeId);
    return res.status(httpStatusCode.OK).json({ data: followers });
});

export default CountFollowers;
