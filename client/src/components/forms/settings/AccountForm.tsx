'use client';
import DeactiveAccount from '@/components/settings/DeactiveAccount';
import DeleteAccount from '@/components/settings/DeleteAccount';
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
import { Separator } from '@/components/ui/separator';
import { zodResolver } from '@hookform/resolvers/zod';
import React, { Fragment, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Paragraph } from '@/components/ui/typography';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { getFirstLetter } from '@/lib/utils';
import { useSession } from 'next-auth/react';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';

const EmailSchema = z
    .object({
        email: z.string().email({ message: 'Please enter a valid email.' }),
        confirmemail: z.string(),
    })
    .refine((data) => data.email === data.confirmemail, {
        message: "Email doesn't match.",
        path: ['confirmemail'],
    });

type AccountFormValues = z.infer<typeof EmailSchema>;

export default function AccountForm() {
    const session = useSession();
    const [profilePic, setProfilePic] = useState(
        session.status !== 'loading' ? session.data?.user.image : '',
    );
    const [file, setFile] = useState<File | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const form = useForm<AccountFormValues>({
        resolver: zodResolver(EmailSchema),
        defaultValues: {
            email: '',
            confirmemail: '',
        },
        mode: 'onChange',
    });

    function onSubmit(data: AccountFormValues) {}

    const changeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files) return;
        const [file] = Array.from(e.target.files);
        setFile(file);
    };

    useEffect(() => {
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setProfilePic(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    }, [file]);

    return (
        <Fragment>
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-2"
                >
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="Enter your new email"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="confirmemail"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel> Confirm email</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="Confirm your email"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <Button type="submit">Update Email </Button>
                </form>
            </Form>
            <Separator />
            <div className="">
                <h2 className="font-medium mb-2">Profile Pic</h2>
                <div className="flex item-center space-x-3">
                    <Avatar className="h-14 w-14">
                        <AvatarImage src={profilePic} />
                        <AvatarFallback className="uppercase">
                            {getFirstLetter(
                                session.status !== 'loading'
                                    ? (session.data?.user.name as string)
                                    : '',
                            )}
                        </AvatarFallback>
                    </Avatar>
                    <div>
                        <div className="flex items-center">
                            <Label className="text-green-700 hover:bg-transparent py-0 my-0 cursor-pointer">
                                Update
                                <Input
                                    onChange={changeHandler}
                                    className="hidden"
                                    accept="image/jpeg, image/jpg, image/png, image/gif, image/bmp"
                                    type="file"
                                />
                            </Label>

                            <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <Button
                                        className="text-destructive hover:bg-transparent py-0 my-0"
                                        variant={'ghost'}
                                        size={'sm'}
                                    >
                                        Remove
                                    </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>
                                            Are you absolutely sure?
                                        </AlertDialogTitle>
                                        <AlertDialogDescription>
                                            This action cannot be undone. This
                                            will permanently remove your profile
                                            pic from our servers.
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel>
                                            Cancel
                                        </AlertDialogCancel>
                                        <AlertDialogAction>
                                            Continue
                                        </AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        </div>
                        <Paragraph className="text-sm text-muted-foreground">
                            Note: JPG,PNG, JPEG is supported only.
                        </Paragraph>
                    </div>
                </div>
                <Button
                    className={`${file ? 'block mt-3' : 'hidden'}`}
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <Fragment>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Please wait
                        </Fragment>
                    ) : (
                        'Upload'
                    )}
                </Button>
            </div>

            <Separator />
            <DeactiveAccount />
            <DeleteAccount />
        </Fragment>
    );
}
