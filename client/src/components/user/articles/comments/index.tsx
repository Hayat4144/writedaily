'use client';
import { ToggleLikeAction } from '@/app/action';
import { Icons } from '@/components/icons';
import { Button } from '@/components/ui/button';
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import { toast } from '@/components/ui/use-toast';
import { likeType } from '@/types';
import { useSession } from 'next-auth/react';

type props = {
    type: 'commentLike' | 'commentReply';
    id: string;
    children?: React.ReactNode;
};

const ButtonHandler = ({ type, id, children }: props) => {
    const session = useSession();
    if (!session) return;
    const token = session.data?.user.AccessToken;
    const commentLikehandler = async () => {
        if (!token) return;
        const { error, data } = await ToggleLikeAction(
            token,
            id,
            likeType.comment,
        );
        if (error) {
            return toast({ title: error, variant: 'destructive' });
        } else if (data) {
            return data.deletedId
                ? toast({ title: 'You are unlike the article.' })
                : toast({ title: 'Like has been added successfully.' });
        }
    };

    const replyHandler = () => {};
    switch (type) {
        case 'commentLike':
            return (
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button
                            variant="ghost"
                            size={'sm'}
                            disabled={!session.data}
                            onClick={commentLikehandler}
                        >
                            <Icons.like className="mr-2 h-4 w-4" />
                            {children}
                            <span className="sr-only">comment like</span>
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent side="top">Add comment like</TooltipContent>
                </Tooltip>
            );
        case 'commentReply':
            return (
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button
                            variant="ghost"
                            disabled={!session.data}
                            size={'sm'}
                            onClick={replyHandler}
                        >
                            <Icons.comment />
                            <span className="sr-only">Reply</span>
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent side="top">
                        Add comment reply
                    </TooltipContent>
                </Tooltip>
            );
    }
};

export default ButtonHandler;
