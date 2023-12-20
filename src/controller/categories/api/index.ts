import { httpStatusCode } from '@customtype/index';
import CategoryService from '@service/CategoryService';
import asyncHandler from '@utils/asynHandler';
import { Request, Response } from 'express';

const categoryService = new CategoryService();

export const addCategory = asyncHandler(async (req: Request, res: Response) => {
    const { name } = req.body;
    const Category = await categoryService.createCategory(name);
    return res.status(httpStatusCode.OK).json({ data: Category[0] });
});

export const readCategory = asyncHandler(
    async (req: Request, res: Response) => {
        const Category = await categoryService.readCategory();
        return res.status(httpStatusCode.OK).json({ data: Category });
    },
);

export const updateCategory = asyncHandler(
    async (req: Request, res: Response) => {
        const { name, id } = req.body;
        const updatedCategory = await categoryService.updateCategory(id, name);
        return res.status(httpStatusCode.OK).json({ data: updatedCategory[0] });
    },
);

export const deleteCategory = asyncHandler(
    async (req: Request, res: Response) => {
        const { id } = req.body;
        const deletedCategory = await categoryService.deleteCategory(id);
        return res.status(httpStatusCode.OK).json({
            data: `${deletedCategory.Name} has been deleted successfully.`,
        });
    },
);
