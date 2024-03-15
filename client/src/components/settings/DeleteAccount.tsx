'use client';
import React, { Fragment, useEffect, useState } from 'react';
import {
    AlertDialog,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Paragraph } from '../ui/typography';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { signOut, useSession } from 'next-auth/react';
import { toast } from '../ui/use-toast';
import { Loader2 } from 'lucide-react';
import { deleteAccount } from '@/externalapi/UserService';

export default function DeleteAccount() {
    const session = useSession();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isDisable, setDisabale] = useState<boolean>(true);
    const [value, setValue] = useState('');
    const token = session.data?.user.AccessToken as string;

    useEffect(() => {
        if (session.status === 'loading') setDisabale(true);
        if (value === 'delete') {
            setDisabale(false);
        }
        if (isLoading) setDisabale(true);
    }, [value, session.status, isLoading]);

    const deleteHandler = async () => {
        try {
            setIsLoading((prevState) => !prevState);
            const { data, error } = await deleteAccount(token);
            setIsLoading((prevState) => !prevState);
            if (error) return toast({ title: error, variant: 'destructive' });
            toast({ title: data });
            signOut({ callbackUrl: '/auth/signin' });
        } catch (error) {
            toast({ title: error as string, variant: 'destructive' });
            setIsLoading((prevState) => !prevState);
        }
    };

    return (
        <AlertDialog>
            <AlertDialogTrigger className="text-justify">
                <h3 className="text-destructive">Delete account</h3>
                <Paragraph className="text-muted-foreground text-sm">
                    Permanently delete your account and all of your content.
                </Paragraph>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Delete account </AlertDialogTitle>
                    <AlertDialogDescription>
                        We’re sorry to see you go. Once your account is deleted,
                        all of your content will be permanently gone, including
                        your profile, articles, bookmarks, and library. If
                        you’re not sure about that, we suggest you deactivate.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <div className="space-y-2">
                    <Label htmlFor="delete">
                        To confirm deletion, type “delete” below:
                    </Label>
                    <Input
                        id="delete"
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                    />
                </div>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <Button disabled={isDisable} onClick={deleteHandler}>
                        {isLoading ? (
                            <Fragment>
                                <Loader2 className="mr-2 w-4 h-4 animate-spin" />
                                Please wait...
                            </Fragment>
                        ) : (
                            'Continue'
                        )}
                    </Button>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
