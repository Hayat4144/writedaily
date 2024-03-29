import { httpStatusCode } from '@customtype/index';
import TopicsService from '@service/TopicService';
import asyncHandler from '@utils/asynHandler';
import { Request, Response } from 'express';

const topicsService = new TopicsService();

export const getArticleTopics = asyncHandler(
    async (req: Request, res: Response) => {
        const { id } = req.params;
        const result = await topicsService.articleTopics(id);
        return res.status(httpStatusCode.OK).json({ data: result });
    },
);
export const addTopics = asyncHandler(async (req: Request, res: Response) => {
    const { name } = req.body;
    const tagService = new TopicsService();
    const tag = await tagService.createTag(name);
    return res.status(httpStatusCode.OK).json({ data: tag[0] });
});

export const readTopics = asyncHandler(async (req: Request, res: Response) => {
    const tagService = new TopicsService();
    const tags = await tagService.readTopics();
    return res.status(httpStatusCode.OK).json({ data: tags });
});

export const updateTopics = asyncHandler(
    async (req: Request, res: Response) => {
        const { name, id } = req.body;
        const tagService = new TopicsService();
        const updatedtag = await tagService.updateTopics(id, name);
        return res.status(httpStatusCode.OK).json({ data: updatedtag[0] });
    },
);

export const searchTopics = asyncHandler(
    async (req: Request, res: Response) => {
        const { name } = req.query;
        const topicsService = new TopicsService();
        const topics = await topicsService.searchTopics(name as string);
        return res.status(httpStatusCode.OK).json({
            data: topics,
        });
    },
);

export const deleteTopics = asyncHandler(
    async (req: Request, res: Response) => {
        const { deleteId } = req.params;
        const tagService = new TopicsService();
        const deletedtag = await tagService.deleteTopic(deleteId);
        return res.status(httpStatusCode.OK).json({
            data: `${deletedtag.Name} has been deleted successfully.`,
        });
    },
);
