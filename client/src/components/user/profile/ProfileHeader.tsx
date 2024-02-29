import React, { Fragment } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Heading4, Paragraph } from '@/components/ui/typography';
import { Button } from '@/components/ui/button';
import { getFirstLetter } from '@/lib/utils';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export default async function ProfileHeader({ data }: { data: any }) {
    const session = await getServerSession(authOptions);
    const isIntruder = session?.user.id !== data.id;
    return (
        <Fragment>
            <div className="flex items-center space-x-5">
                <Avatar className="h-14 w-14">
                    <AvatarImage src={data.profilePic} alt="@shadcn" />
                    <AvatarFallback className="uppercase">
                        {getFirstLetter(data.name)}
                    </AvatarFallback>
                </Avatar>
                <div>
                    <Heading4>{data.name}</Heading4>
                    <Paragraph className="text-muted-foreground">
                        {data.followers} followers{' '}
                        {!isIntruder ? (
                            <Fragment>
                                |
                                <span className="ml-1">
                                    {data.following} following
                                </span>
                            </Fragment>
                        ) : null}{' '}
                    </Paragraph>
                </div>
            </div>
            <Button className="w-full my-5 rounded-full">Follow</Button>
        </Fragment>
    );
}
