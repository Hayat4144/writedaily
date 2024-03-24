import React from 'react';
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from '@/components/ui/sheet';
import { Icons } from '@/components/icons';
import { store } from '@/app/store';
import { Button } from '@/components/ui/button';

type Props = {
    title: string;
    totalComments: number;
};

export default async function CommentSheet({ title, totalComments }: Props) {
    const id = store.getData();
    console.log(id);
    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button variant={'ghost'}>
                    <Icons.comment className="mr-2" />
                    {totalComments}
                </Button>
            </SheetTrigger>
            <SheetContent className="w-[400px] sm:w-[540px]">
                <SheetHeader>
                    <SheetTitle>
                        {totalComments} comments for "{title}"
                    </SheetTitle>
                </SheetHeader>
            </SheetContent>
        </Sheet>
    );
}
