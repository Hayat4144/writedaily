'use client';
import React from 'react';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import type { z } from 'zod';
import { SignupSchema } from '@/lib/validation/auth';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { Loader2Icon } from 'lucide-react';
import SignupUser from '@/externalapi/SignupUser';
import { toast } from '../ui/use-toast';

type SignupInput = z.infer<typeof SignupSchema>;

export default function SignupForm() {
    const [isLoading, setIsLoading] = React.useState<boolean>(false);
    const router = useRouter();

    // react-hook-form validation with zod
    const form = useForm<SignupInput>({
        resolver: zodResolver(SignupSchema),
        defaultValues: {
            email: '',
            password: '',
            name: '',
            confirmpassword: '',
        },
    });

    // handle the registeration
    const onSubmit = async (values: SignupInput) => {
        setIsLoading((prevState) => !prevState);
        const { data, error } = await SignupUser(values);
        setIsLoading((prevState) => !prevState);
        if (error) return toast({ title: error, variant: 'destructive' });
        toast({ title: data });
        router.push('/auth/signin');
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Name</FormLabel>
                            <FormControl>
                                <Input
                                    type="text"
                                    placeholder="Enter your name"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                ></FormField>
                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="Enter your email"
                                    type="email"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                ></FormField>
                <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="Enter your password"
                                    type="password"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                ></FormField>
                <FormField
                    control={form.control}
                    name="confirmpassword"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Confirm password</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="Re-enter your password"
                                    type="password"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                ></FormField>
                <Button disabled={isLoading}>
                    {isLoading && (
                        <Loader2Icon
                            className="mr-2 h-4 w-4 animate-spin"
                            aria-hidden="true"
                        />
                    )}
                    Register
                    <span className="sr-only">Register</span>
                </Button>
            </form>
        </Form>
    );
}
