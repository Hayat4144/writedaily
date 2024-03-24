'use client';
import { Button, buttonVariants } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { isFollowing, toggleFollowing } from '@/externalapi/UserService';
import { cn } from '@/lib/utils';
import { VariantProps } from 'class-variance-authority';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';

enum followingStatus {
    FOLLOWING = 'following',
    FOLLOW = 'follow',
    UNFOLLOW = 'unfollowing',
}

interface Props
    extends React.ButtonHTMLAttributes<HTMLButtonElement>,
        VariantProps<typeof buttonVariants> {
    id?: string;
}

export default function FollowButton({
    variant,
    className,
    size,
    id,
    ...props
}: Props) {
    variant = variant || 'ghost';
    size = size || 'sm';
    const session = useSession();
    const token = session.data?.user.AccessToken as string;
    const [value, setValue] = useState<followingStatus>(followingStatus.FOLLOW);
    const [isLogdin, setIsLogdin] = useState<boolean>(false);
    const params = useParams();

    const checkFollowing = async () => {
        const { data } = await isFollowing(
            token,
            id || (params.userId as string),
        );
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
                id || (params.userId as string),
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
            className={cn('my-5 rounded-full', className)}
            onClick={toggleFollowingHandler}
            variant={variant}
            size={size}
            {...props}
        >
            {value}
        </Button>
    );
}
