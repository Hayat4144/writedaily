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
import { getArticleLikes } from '@/externalapi/Like';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { getFirstLetter } from '@/lib/utils';
import { Paragraph } from '@/components/ui/typography';
import FollowButton from '../profile/FollowButton';

type Props = {
    title: string;
    totalLikes: number;
};

export default async function LikeSheet({ title, totalLikes }: Props) {
    const id = store.getData();
    if (!id) return;
    const { data, error } = await getArticleLikes(id);

    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button variant={'ghost'}>
                    <Icons.like className="mr-2" />
                    {totalLikes}
                </Button>
            </SheetTrigger>
            <SheetContent className="w-[400px] sm:w-[540px]">
                <SheetHeader>
                    <SheetTitle>
                        {totalLikes} likes for "{title}"
                    </SheetTitle>
                    <div className="space-y-2">
                        {error ? <Paragraph>{error}</Paragraph> : null}
                        {data.length &&
                            data.map((item: any) => (
                                <div
                                    className="flex items-center gap-4"
                                    key={item.id}
                                >
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
                                            {item.user.bio}
                                        </p>
                                    </div>
                                    <FollowButton
                                        className="ml-auto hover:bg-transparent text-green-600"
                                        id={item.user.id}
                                    />
                                </div>
                            ))}
                    </div>
                </SheetHeader>
            </SheetContent>
        </Sheet>
    );
}
