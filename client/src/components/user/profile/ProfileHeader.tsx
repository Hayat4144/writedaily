import React, { Fragment } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Heading4, Paragraph } from '@/components/ui/typography';
import { getFirstLetter } from '@/lib/utils';
import FollowButton from './FollowButton';

export default function ProfileHeader({ data }: { data: any }) {
    return (
        <Fragment>
            <div className="flex items-center space-x-5">
                <Avatar className="h-14 w-14">
                    <AvatarImage src={data.profilePic} alt="user-image" />
                    <AvatarFallback className="uppercase">
                        {getFirstLetter(data.name)}
                    </AvatarFallback>
                </Avatar>
                <div>
                    <Heading4>{data.name}</Heading4>
                    <Paragraph className="text-muted-foreground">
                        {data.followers} followers |
                        <span className="ml-1">{data.following} following</span>{' '}
                    </Paragraph>
                </div>
            </div>
            <FollowButton />
        </Fragment>
    );
}
