'use client';
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
import { Heading4, Paragraph } from '@/components/ui/typography';
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
import { changePassword, updateProfilePic } from '@/externalapi/UserService';
import { toast } from '@/components/ui/use-toast';

const PasswordSchema = z
    .object({
        password: z
            .string()
            .min(4, { message: 'password must be at least 4 character long.' }),
        confirmpassword: z.string(),
        newpassowrd: z
            .string()
            .min(8, {
                message: 'Password must be at least 8 characters long',
            })
            .max(100)
            .regex(
                /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/,
                {
                    message:
                        'Password must contain at least 8 characters, one uppercase, one lowercase, one number and one special character',
                },
            ),
    })
    .refine((data) => data.newpassowrd === data.confirmpassword, {
        message: "Password doesn't match.",
        path: ['confirmpassword'],
    });

type AccountFormValues = z.infer<typeof PasswordSchema>;

export default function AccountForm() {
    const { data: session, update, status } = useSession();
    const [profilePic, setProfilePic] = useState('');
    const [file, setFile] = useState<File | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isLoading2, setIsLoading2] = useState(false);
    const token = session?.user.AccessToken as string;

    const form = useForm<AccountFormValues>({
        resolver: zodResolver(PasswordSchema),
        defaultValues: {
            password: '',
            newpassowrd: '',
            confirmpassword: '',
        },
        mode: 'onChange',
    });

    useEffect(() => {
        if (status !== 'loading') {
            setProfilePic(session?.user.image as string);
        }
    }, [status]);

    async function onSubmit(values: AccountFormValues) {
        setIsLoading((prevState) => !prevState);
        const { data, error } = await changePassword(token, values);
        setIsLoading((prevState) => !prevState);
        if (error) return toast({ title: error, variant: 'destructive' });
        toast({ title: data });
        form.reset();
    }

    const changeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files) return;
        const [file] = Array.from(e.target.files);
        setFile(file);
    };

    const uploadHandler = async () => {
        setIsLoading2((prevState) => !prevState);
        const formData = new FormData();
        if (!file) {
            setIsLoading2((prevState) => !prevState);
            return toast({ title: 'There is image to upload.' });
        }
        formData.append('profilePic', file);
        const { data, error } = await updateProfilePic(token, formData);
        setIsLoading2((prevState) => !prevState);
        if (error) return toast({ title: error, variant: 'destructive' });
        toast({ title: 'uploaded' });
        setProfilePic(data);
        update({
            ...session,
            user: {
                ...session?.user,
                image: data,
            },
        });
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
                        name="password"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Old Password</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="Enter your old password"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="newpassowrd"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>New Password</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="Enter your new password"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="confirmpassword"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel> Confirm password</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="Confirm your password"
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
                                <Loader2 className="animate-spin w-4 h-4 mr-2" />
                                please wait
                            </Fragment>
                        ) : (
                            'Change password'
                        )}
                    </Button>
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
                                status !== 'loading'
                                    ? (session?.user.name as string)
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
                    className={`${file ? 'flex mt-3' : 'hidden'}`}
                    disabled={isLoading2}
                    onClick={uploadHandler}
                >
                    {isLoading2 ? (
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
            <DeleteAccount />
        </Fragment>
    );
}
