'use client';
import React, { Fragment, useState } from 'react';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import { Icons } from '@/components/icons';
import { Button } from '@/components/ui/button';
import { CommentAction, ToggleLikeAction } from '@/app/action';
import { useSession } from 'next-auth/react';
import { commentType, likeType } from '@/types';
import { toast } from '@/components/ui/use-toast';
import { Input } from '@/components/ui/input';
import { Loader2 } from 'lucide-react';

interface props {
    dataValue: any;
}

export default function index({ dataValue }: props) {
    const session = useSession();
    const token = session.data?.user.AccessToken as string;
    const [commentBox, setCommentBox] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [comment, setComment] = useState('');

    const LikeHandler = async () => {
        const { data, error } = await ToggleLikeAction(
            token,
            dataValue.id,
            likeType.article,
        );
        if (error) return toast({ title: error, variant: 'destructive' });
        else if (data) {
            return data.deletedId
                ? toast({ title: 'You are unlike the article.' })
                : toast({ title: 'Like has been added successfully.' });
        }
    };

    const CommentHandler = async () => {
        setIsLoading(!isLoading);
        const { error } = await CommentAction(
            token as string,
            comment,
            dataValue.id,
            commentType.article,
        );
        setIsLoading(false);
        if (!error) {
            toast({ title: 'Comment has been added successfullyly.' });
            setComment('');
            setCommentBox(false);
            return;
        }
        toast({ title: error, variant: 'destructive' });
    };

    return (
        <Fragment>
            <div className="flex items-center">
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                variant={'ghost'}
                                className="text-muted-foreground"
                                disabled={!session.data ? true : false}
                                onClick={LikeHandler}
                            >
                                <Icons.like className="mr-2 h-4 w-4" />
                                <span>{dataValue.totalLikes}</span>
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
                                className="text-muted-foreground"
                                disabled={!session.data ? true : false}
                                onClick={() => setCommentBox(!commentBox)}
                            >
                                <Icons.comment className="mr-2 h-4 w-4" />
                                <span>{dataValue.totalComments}</span>
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>Comment</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            </div>
            <div className={`${!commentBox ? 'hidden' : 'block px-5 py-2'}`}>
                <form
                    action=""
                    className="flex space-x-3"
                    onSubmit={(e) => {
                        e.preventDefault();
                        CommentHandler();
                    }}
                >
                    <Input
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                    />
                    <Button disabled={isLoading}>
                        {isLoading ? (
                            <Fragment>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Please wait
                            </Fragment>
                        ) : (
                            <>Submit</>
                        )}
                    </Button>
                </form>
            </div>
        </Fragment>
    );
}
