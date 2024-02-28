'use client';
import React, { Fragment, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Icons } from '../icons';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '../ui/dialog';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Loader2 } from 'lucide-react';
import { Input } from '../ui/input';
import { signIn } from 'next-auth/react';

const emailSchema = z.object({
    email: z.string().email({ message: 'Please enter valid email' }),
});

type Inputs = z.infer<typeof emailSchema>;

export default function AuthForm() {
    const [isLoading, setisLoading] = useState<boolean>(false);
    const form = useForm<Inputs>({
        resolver: zodResolver(emailSchema),
        defaultValues: {
            email: '',
        },
    });

    const onSubmit = () => {};

    const googleHandler = () => {
        signIn('google', { callbackUrl: '/feed' });
    };

    return (
        <div className="grid grid-cols-2 gap-5">
            <Button variant={'outline'} onClick={googleHandler}>
                <Icons.google className="mr-2 h-4 w-4" /> google
            </Button>
            <Dialog>
                <DialogTrigger asChild>
                    <Button variant={'outline'}>
                        <Icons.email className="mr-2 h-4 w-4" /> Email
                    </Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Enter your email address</DialogTitle>
                    </DialogHeader>
                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(onSubmit)}
                            className="grid gap-4"
                        >
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Email</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Enter you email"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            ></FormField>
                            <Button disabled={isLoading}>
                                {isLoading ? (
                                    <Fragment>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        <span>Please wait</span>
                                    </Fragment>
                                ) : (
                                    <span>Submit</span>
                                )}
                            </Button>
                        </form>
                    </Form>
                </DialogContent>
            </Dialog>
        </div>
    );
}
