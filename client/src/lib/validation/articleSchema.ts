import { z } from 'zod';

export const createArticleSchema = z.object({
    title: z
        .string()
        .min(10, { message: 'Title should be atleast 10 characters.' })
        .max(50, { message: "Title can't be longer than 50 character." }),
    description: z
        .string()
        .min(10, { message: 'Description should be atleast 10 characters.' })
        .max(100, {
            message: "Description can't be longer than 100 character.",
        }),
});
