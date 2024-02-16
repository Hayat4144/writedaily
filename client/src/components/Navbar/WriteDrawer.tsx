'use client';
import { useMediaQuery } from '@/hooks/useMediaquery';
import React, { Fragment } from 'react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from '@/components/ui/drawer';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { Icons } from '../icons';
import { Textarea } from '../ui/textarea';
import { createArticle } from '@/externalapi/article';
import { useSession } from 'next-auth/react';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip';

export default function WriteDrawer() {
    const [open, setOpen] = React.useState(false);
    const isDesktop = useMediaQuery('(min-width: 768px)');
    if (isDesktop) {
        return (
            <Dialog open={open} onOpenChange={setOpen}>
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <DialogTrigger asChild>
                                <Button
                                    className="space-x-1"
                                    variant={'ghost'}
                                    size={'sm'}
                                >
                                    <Icons.editing size={20} />
                                    <span className="hidden md:block">
                                        Write
                                    </span>
                                </Button>
                            </DialogTrigger>
                        </TooltipTrigger>
                        <TooltipContent>Create article</TooltipContent>
                    </Tooltip>
                </TooltipProvider>
                <DialogContent className="sm:max-w-[425px] md:max-w-[525px]">
                    <DialogHeader>
                        <DialogTitle>Edit profile</DialogTitle>
                        <DialogDescription>
                            Make changes to your profile here. Click save when
                            you're done.
                        </DialogDescription>
                    </DialogHeader>
                    <TitleForm />
                </DialogContent>
            </Dialog>
        );
    }

    return (
        <Drawer open={open} onOpenChange={setOpen}>
            <DrawerTrigger asChild>
                <Button className="space-x-1" variant={'ghost'} size={'sm'}>
                    <Icons.editing size={20} />
                    <span className="hidden md:block">Write</span>
                </Button>
            </DrawerTrigger>
            <DrawerContent>
                <DrawerHeader className="text-left">
                    <DrawerTitle>Create Article </DrawerTitle>
                    <DrawerDescription>
                        Add a clear and concise title of your article. clik save
                        when you're done.
                    </DrawerDescription>
                </DrawerHeader>
                <TitleForm className="px-4" />
                <DrawerFooter className="pt-2">
                    <DrawerClose asChild>
                        <Button variant="outline">Cancel</Button>
                    </DrawerClose>
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    );
}

function TitleForm({ className }: React.ComponentProps<'form'>) {
    const session = useSession();
    const [isLoading, setIsLoading] = React.useState<boolean>(false);
    const submitHandler = async (formData: FormData) => {
        setIsLoading(true);
        const articleData = {
            title: formData.get('title'),
            description: formData.get('description'),
            content: [],
        };
        const token = session.data?.user.AccessToken as string;
        if (!token) return setIsLoading(false);
        const { data, error } = await createArticle(token, articleData);
        setIsLoading(false);
        error ? toast(error) : toast('Article has been created successfully.');
    };
    return (
        <form
            className={cn('grid items-start gap-4', className)}
            action={submitHandler}
        >
            <div className="grid gap-2">
                <Label htmlFor="title">Title</Label>
                <Input
                    type="text"
                    id="title"
                    name="title"
                    placeholder="Battle between SQL and NOSQL"
                />
            </div>
            <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                    id="description"
                    name="description"
                    placeholder="The Battle between SQL and NoSQL: Choosing the Right Database for Your Web Application"
                />
            </div>
            <Button type="submit">
                {isLoading ? (
                    <Fragment>
                        <Loader2 className="animate-spin" size={18} />
                        please wait...
                    </Fragment>
                ) : (
                    'Save changes'
                )}
            </Button>
        </form>
    );
}
