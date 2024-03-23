'use client';
import React, { Fragment, useState } from 'react';
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
import { Button, buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useSession } from 'next-auth/react';
import { useParams } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { unpublishaArticleActions } from '@/app/action';
import { toast } from '@/components/ui/use-toast';

type Props = {
    title: string;
};

export default function UnpublishAlert({ title }: Props) {
    const session = useSession();
    const token = session.data?.user.AccessToken as string;
    const { id } = useParams();
    const [isLoading, setIsLoading] = useState(false);

    const unpuhlishHandler = async () => {
        setIsLoading((prevState) => !prevState);
        const { data, error } = await unpublishaArticleActions(
            token,
            id as string,
        );
        setIsLoading((prevState) => !prevState);
        if (error) return toast({ title: error, variant: 'destructive' });
        toast({ title: data });
    };
    return (
        <AlertDialog>
            <AlertDialogTrigger
                className={cn(
                    buttonVariants({ variant: 'default' }),
                    'rounded-full',
                )}
            >
                Un-Publish
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Unpublish {title} </AlertDialogTitle>
                    <AlertDialogDescription>
                        Are you sure absolutely sure to unpublish it?
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <Button onClick={unpuhlishHandler} disabled={isLoading}>
                        {isLoading ? (
                            <Fragment>
                                <Loader2 className="w-4 h-4 animate-spin  mr-2" />
                                please wait...
                            </Fragment>
                        ) : (
                            'Submit'
                        )}
                    </Button>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
