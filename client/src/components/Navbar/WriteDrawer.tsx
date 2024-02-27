'use client';
import { useMediaQuery } from '@/hooks/useMediaquery';
import React from 'react';
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
import { Icons } from '../icons';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import { ArticleForm } from '../forms/ArticleForm';

interface WriteDrawerProps {
    children?: React.ReactNode;
}

export default function WriteDrawer({ children }: WriteDrawerProps) {
    const [open, setOpen] = React.useState(false);
    const isDesktop = useMediaQuery('(min-width: 768px)');
    if (isDesktop) {
        return (
            <Dialog open={open} onOpenChange={setOpen}>
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <DialogTrigger asChild>
                                {children ? (
                                    children
                                ) : (
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
                                )}
                            </DialogTrigger>
                        </TooltipTrigger>
                        <TooltipContent>Create an article</TooltipContent>
                    </Tooltip>
                </TooltipProvider>
                <DialogContent className="sm:max-w-[425px] md:max-w-[525px]">
                    <DialogHeader>
                        <DialogTitle>Create an Article</DialogTitle>
                        <DialogDescription>
                            Add your title and description here. Click save when
                            you're done.
                        </DialogDescription>
                    </DialogHeader>
                    <ArticleForm />
                </DialogContent>
            </Dialog>
        );
    }

    return (
        <Drawer open={open} onOpenChange={setOpen}>
            <DrawerTrigger asChild>
                {children ? (
                    children
                ) : (
                    <Button className="space-x-1" variant={'ghost'} size={'sm'}>
                        <Icons.editing size={20} />
                        <span className="hidden md:block">Write</span>
                    </Button>
                )}
            </DrawerTrigger>
            <DrawerContent>
                <DrawerHeader className="text-left">
                    <DrawerTitle>Create Article </DrawerTitle>
                    <DrawerDescription>
                        Add a clear and concise title of your article. clik save
                        when you're done.
                    </DrawerDescription>
                </DrawerHeader>
                <ArticleForm className="px-4" />
                <DrawerFooter className="pt-2">
                    <DrawerClose asChild>
                        <Button variant="outline">Cancel</Button>
                    </DrawerClose>
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    );
}
