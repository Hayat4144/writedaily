'use client';
import { Button, buttonVariants } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { isFollowing, toggleFollowing } from '@/externalapi/UserService';
import { cn } from '@/lib/utils';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';

enum followingStatus {
    FOLLOWING = 'following',
    FOLLOW = 'follow',
    UNFOLLOW = 'unfollowing',
}

export default function FollowButton() {
    const session = useSession();
    const token = session.data?.user.AccessToken as string;
    const [value, setValue] = useState<followingStatus>(followingStatus.FOLLOW);
    const [isLogdin, setIsLogdin] = useState<boolean>(false);
    const params = useParams();

    const checkFollowing = async () => {
        const { data } = await isFollowing(token, params.userId as string);
        if (data) setValue(followingStatus.UNFOLLOW);
        else setValue(followingStatus.FOLLOW);
    };

    useEffect(() => {
        if (session.status === 'authenticated') {
            setIsLogdin(true);
            checkFollowing();
        }
    }, [session]);

    const toggleFollowingHandler = async () => {
        try {
            if (!isLogdin) {
                return toast({
                    title: 'You are not authenticated.',
                    description: (
                        <Link
                            href="/auth/signin"
                            className={cn(buttonVariants())}
                        >
                            Please signin
                        </Link>
                    ),
                });
            }
            setValue((prevState) => {
                if (prevState === followingStatus.FOLLOW)
                    return followingStatus.UNFOLLOW;
                else return followingStatus.FOLLOW;
            });
            const { error } = await toggleFollowing(
                token,
                params.userId as string,
            );
            if (error) {
                setValue((prevState) => {
                    if (prevState === followingStatus.FOLLOW)
                        return followingStatus.FOLLOW;
                    else return followingStatus.UNFOLLOW;
                });
                toast({ title: error, variant: 'destructive' });
            }
        } catch (error) {
            toast({ title: error as string, variant: 'destructive' });
        }
    };

    return (
        <Button
            className="my-5 rounded-full w-full"
            onClick={toggleFollowingHandler}
        >
            {value}
        </Button>
    );
}
