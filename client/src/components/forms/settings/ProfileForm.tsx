'use client';

import { updateProfileActions } from '@/app/action';
import { Button } from '@/components/ui/button';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/components/ui/use-toast';
import { profileFormSchema } from '@/lib/validation/settings/SettingsSchema';
import { ProfileFormValues } from '@/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { useSession } from 'next-auth/react';
import React, { Fragment, useState } from 'react';
import { useForm } from 'react-hook-form';

interface formdata {
    name: string;
    username?: string | null;
    bio?: string | null;
}

interface ProfileFormProps {
    values: formdata;
}

export default function ProfileForm({ values }: ProfileFormProps) {
    const form = useForm<ProfileFormValues>({
        resolver: zodResolver(profileFormSchema),
        defaultValues: {
            name: values.name,
            username: values.username ?? '',
            bio: values.bio ?? '',
        },
        mode: 'onChange',
    });

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const { data: session, update } = useSession();
    const token = session?.user.AccessToken as string;

    async function onSubmit(value: ProfileFormValues) {
        setIsLoading((prevState) => !prevState);
        const { data, error } = await updateProfileActions(value, token);
        setIsLoading((prevState) => !prevState);
        if (error) return toast({ title: error, variant: 'destructive' });
        toast({
            title: 'Your profile has been updated successfully.',
        });
        update({
            ...session,
            user: {
                ...session?.user,
                name: data.name,
            },
        });
    }
    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Name</FormLabel>
                            <FormControl>
                                <Input placeholder="Hayat ilyas" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Username</FormLabel>
                            <FormControl>
                                <Input placeholder="hayat" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="bio"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Bio</FormLabel>
                            <FormControl>
                                <Textarea
                                    placeholder="Tell us a little bit about yourself"
                                    className="resize-none"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type="submit" disabled={isLoading}>
                    {isLoading ? (
                        <Fragment>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Please wait
                        </Fragment>
                    ) : (
                        'Update profile'
                    )}
                </Button>
            </form>
        </Form>
    );
}
