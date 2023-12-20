import { httpStatusCode } from '@customtype/index';
import TagsService from '@service/TagsService';
import asyncHandler from '@utils/asynHandler';
import logger from '@utils/logger';
import { Request, Response } from 'express';

export const addTag = asyncHandler(async (req: Request, res: Response) => {
    const { name } = req.body;
    const tagService = new TagsService();
    const tag = await tagService.createTag(name);
    return res.status(httpStatusCode.OK).json({ data: tag[0] });
});

export const readTag = asyncHandler(async (req: Request, res: Response) => {
    const tagService = new TagsService();
    const tags = await tagService.readTags();
    logger.info(tags);
    return res.status(httpStatusCode.OK).json({ data: tags });
});

export const updateTag = asyncHandler(async (req: Request, res: Response) => {
    const { name, id } = req.body;
    const tagService = new TagsService();
    const updatedtag = await tagService.updateTag(id, name);
    return res.status(httpStatusCode.OK).json({ data: updatedtag[0] });
});

export const deleteTag = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.body;
    const tagService = new TagsService();
    const deletedtag = await tagService.deleteTag(id);
    return res
        .status(httpStatusCode.OK)
        .json({ data: `${deletedtag.Name} has been deleted successfully.` });
});
