import { httpStatusCode } from '@customtype/index';
import ReadingListService from '@service/ReadingListService';
import asyncHandler from '@utils/asynHandler';
import pagination from '@utils/pagination';
import { Request, Response } from 'express';

const readinListService = new ReadingListService();

export const readreadingList = asyncHandler(
    async (req: Request, res: Response) => {
        const { resultPerPage, pageNumber } = req.query;
        let page = Number(pageNumber) || 1;
        let showResultPerPage = Number(resultPerPage) || 20;
        const skip = pagination(showResultPerPage, page);
        const [lists, total_result] = await readinListService.allReadingList(
            skip,
            showResultPerPage,
            req.user_id,
        );
        return res
            .status(httpStatusCode.OK)
            .json({ results: lists, total_result: { count: total_result } });
    },
);

export const addReadingList = asyncHandler(
    async (req: Request, res: Response) => {
        const { articleId } = req.params;
        const { data } = await readinListService.add({
            articleId,
            userId: req.user_id,
        });
        return res.status(httpStatusCode.OK).json({ data });
    },
);

export const deleteReadingList = asyncHandler(
    async (req: Request, res: Response) => {
        const { id } = req.params;
        const data = await readinListService.delete(id, req.user_id);
        return res
            .status(httpStatusCode.OK)
            .json({ data: data[0], action: 'deleted' });
    },
);
