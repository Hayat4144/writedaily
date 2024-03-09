import { z } from 'zod';

export const profileFormSchema = z.object({
    username: z
        .string()
        .min(4, {
            message: 'Username must be at least 4 characters.',
        })
        .max(30, {
            message: 'Username must not be longer than 30 characters.',
        }),
    name: z
        .string()
        .min(4, { message: 'Name must be at least 4 characters' })
        .max(20, {
            message: 'Name must not be longer than 20 characters.',
        }),
    bio: z
        .string()
        .max(160, { message: 'Bio should not greater than 160 characters.' })
        .min(4, { message: 'Bio must be at least 4 characters.' }),
});
