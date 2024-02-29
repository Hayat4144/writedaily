import { z } from 'zod';

export const profileFormSchema = z.object({
    username: z
        .string()
        .min(2, {
            message: 'Username must be at least 2 characters.',
        })
        .max(30, {
            message: 'Username must not be longer than 30 characters.',
        }),
    email: z.string().email({ message: 'Please enter a valid email.' }),
    bio: z
        .string()
        .max(160, { message: 'Bio should not greater than 160 characters.' })
        .min(4, { message: 'Bio must be at least 4 characters.' }),
});
