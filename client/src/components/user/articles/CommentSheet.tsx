import React from 'react';
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from '@/components/ui/sheet';
import { Icons } from '@/components/icons';
import { store } from '@/app/store';
import { Button } from '@/components/ui/button';
import { getArticleComments } from '@/externalapi/Comment';
import { Paragraph } from '@/components/ui/typography';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { getFirstLetter } from '@/lib/utils';
import moment from 'moment';
import { TooltipProvider } from '@/components/ui/tooltip';
import ButtonHandler from './comments';

type Props = {
    title: string;
    totalComments: number;
};

export default async function CommentSheet({ title, totalComments }: Props) {
    const id = store.getData();
    if (!id) return;
    const { data, error } = await getArticleComments(id);
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
                    <div className="space-y-2">
                        {error ? <Paragraph>{error}</Paragraph> : null}
                        {data.length &&
                            data.map((item: any) => (
                                <div key={item.id}>
                                    <div className="flex  items-center gap-4">
                                        <Avatar className="hidden h-12 w-12 sm:flex">
                                            <AvatarImage
                                                src={item.user.profilePic}
                                                alt="Avatar"
                                            />
                                            <AvatarFallback>
                                                {getFirstLetter(item.user.name)}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="grid gap-1">
                                            <p className="text-sm font-medium leading-none">
                                                {item.user.name}
                                            </p>
                                            <p className="text-sm text-muted-foreground">
                                                {moment(
                                                    item.createdAt,
                                                ).fromNow()}
                                            </p>
                                        </div>
                                    </div>
                                    <Paragraph className="text-sm my-2">
                                        {item.content}
                                    </Paragraph>
                                    <TooltipProvider>
                                        <div className="flex item-center justify-between">
                                            <div>
                                                <ButtonHandler
                                                    type="commentLike"
                                                    id={item.id}
                                                >
                                                    {item.like.length || null}
                                                </ButtonHandler>
                                            </div>
                                            <ButtonHandler
                                                type="commentReply"
                                                id={item.id}
                                            />
                                        </div>
                                    </TooltipProvider>
                                </div>
                            ))}
                    </div>
                </SheetHeader>
            </SheetContent>
        </Sheet>
    );
}
