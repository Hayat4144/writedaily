'use client';
import React, { Fragment, useState } from 'react';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
} from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Heading4 } from '@/components/ui/typography';
import Image from 'next/image';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Button } from '../ui/button';
import { Icons } from '../icons';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import ToggleLike from '@/externalapi/ToggleLike';
import { useSession } from 'next-auth/react';
import { toast } from '../ui/use-toast';
import { Input } from '../ui/input';
import CommentAPi from '@/externalapi/Comment';
import { Loader } from 'lucide-react';
import moment from 'moment';
import { getFirstLetter } from '@/lib/utils';
import Link from 'next/link';

interface FeedItemProps {
    data: any;
    privateComp?: boolean;
}

export default function FeedItem({ data, privateComp }: FeedItemProps) {
    const session = useSession();
    const token = session.data?.user.AccessToken;

    const [commentBox, setCommentBox] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [comment, setComment] = useState('');

    const LikeHandler = async (likeid: string) => {
        const { data, error } = await ToggleLike(
            token as string,
            likeid,
            'article' as any,
        );
        if (data) {
            return data.deletedId
                ? toast({ title: 'You are unlike the article.' })
                : toast({ title: 'Like has been added successfully.' });
        }
        toast({ title: error, variant: 'destructive' });
    };

    const CommentHandler = async (id: string) => {
        setIsLoading(!isLoading);
        const { data, error } = await CommentAPi(
            token as string,
            comment,
            id,
            'article',
        );
        setIsLoading(false);
        if (!error)
            return toast({ title: 'Comment has been added successfullyly.' });
        else return toast({ title: error, variant: 'destructive' });
    };

    const relativeTime = moment(data.createdAt).fromNow();

    return (
        <Card>
            {!privateComp ? (
                <CardHeader className="flex flex-row items-center space-x-4 py-3">
                    <Avatar>
                        <AvatarImage src={data.author.profilePic}></AvatarImage>
                        <AvatarFallback className="uppercase">
                            {getFirstLetter(data.author.name)}
                        </AvatarFallback>
                    </Avatar>
                    <div>
                        <p className="font-bold leading-none">
                            {data.author.name}
                        </p>
                        <CardDescription>{relativeTime}</CardDescription>
                    </div>
                </CardHeader>
            ) : null}
            <CardContent
                className={`grid grid-cols-1 md:grid-cols-3 gap-5 ${privateComp ? 'mt-2' : ''}`}
            >
                <Link
                    href={`/user/article/${data.id}`}
                    className="md:col-span-2"
                >
                    <Heading4>{data.title}</Heading4>
                    <CardDescription>{data.description}</CardDescription>
                </Link>
                <div className="">
                    <AspectRatio ratio={10 / 5} className="rounded-md">
                        <Image
                            src="/image1.jpg"
                            alt="pic"
                            fill
                            className="w-full h-full rounded-md"
                        />
                    </AspectRatio>
                </div>
            </CardContent>
            <CardFooter className="py-2 w-full flex items-center justify-between">
                <div className="flex items-center">
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    variant={'ghost'}
                                    className="text-muted-foreground"
                                    disabled={!session.data ? true : false}
                                    onClick={() => LikeHandler(data.id)}
                                >
                                    <Icons.like className="mr-2 h-4 w-4" />
                                    {data.totalLikes}
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Like</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>

                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    variant={'ghost'}
                                    disabled={!session.data ? true : false}
                                    className="text-muted-foreground"
                                    onClick={() => setCommentBox(!commentBox)}
                                >
                                    <Icons.comment className="mr-2 h-4 w-4" />
                                    {data.totalComments}
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Comment</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </div>
                <div className="flex item-center space-x-1">
                    <Button className="text-sm h-8" variant={'secondary'}>
                        React
                    </Button>
                    <Button className="text-sm h-8" variant={'default'}>
                        Node
                    </Button>
                </div>
            </CardFooter>
            <div className={`${!commentBox ? 'hidden' : 'block px-5 py-2'}`}>
                <form
                    action=""
                    className="flex space-x-3"
                    onSubmit={(e) => {
                        e.preventDefault();
                        CommentHandler(data.id);
                    }}
                >
                    <Input
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                    />
                    <Button disabled={isLoading}>
                        {isLoading ? (
                            <Fragment>
                                <Loader className="mr-2 h-4 w-4 animate-spin" />
                                Please wait
                            </Fragment>
                        ) : (
                            <>Submit</>
                        )}
                    </Button>
                </form>
            </div>
        </Card>
    );
}
