'use client';
import React, { Fragment } from 'react';
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
import { Button } from '@/components/ui/button';
import { Icons } from '@/components/icons';
import { useSession } from 'next-auth/react';
import { Loader2 } from 'lucide-react';
import { deleteArticle } from '@/externalapi/article';
import { toast } from '@/components/ui/use-toast';

export default function DeleteArticle({ id }: { id: string }) {
    const [open, setOpen] = React.useState(false);
    const [isLoading, setIsLoading] = React.useState(false);

    const session = useSession();
    const token = session.data?.user.AccessToken as string;

    const DeleteArticleHandler = async () => {
        setIsLoading((prevState) => !prevState);
        const { data, error } = await deleteArticle(token, id);
        setIsLoading((prevState) => !prevState);
        if (error) return toast({ title: error, variant: 'destructive' });
        toast({ title: data });
        setOpen((prevState) => !prevState);
    };
    return (
        <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogTrigger className="w-full" asChild>
                <Button
                    className="space-x-2 px-2 text-sm justify-start py-1.5"
                    variant={'ghost'}
                >
                    <Icons.delete size={20} />
                    <span>Delete</span>
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>
                        Are you absolutely sure?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. This will permanently
                        delete your article and remove your data from our
                        servers.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <Button onClick={() => DeleteArticleHandler()}>
                        {isLoading ? (
                            <Fragment>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Please wait
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
