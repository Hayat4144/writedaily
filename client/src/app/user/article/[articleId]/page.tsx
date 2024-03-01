import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Heading1, Paragraph } from '@/components/ui/typography';
import { articleById } from '@/externalapi/article';
import { httpStatusCode } from '@/types';
import { getServerSession } from 'next-auth';
import { notFound } from 'next/navigation';
import React, { Fragment } from 'react';
import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
} from '@/components/ui/hover-card';
import moment from 'moment';
import { Button } from '@/components/ui/button';
import ViewEditor from '@/components/Editor/ViewEditor';
import { Separator } from '@/components/ui/separator';

export default async function page({
    params,
}: {
    params: {
        articleId: string;
    };
}) {
    const session = await getServerSession(authOptions);
    const token = session?.user.AccessToken as string;
    const { data, error } = await articleById(token, params.articleId);
    if (error) {
        error.status === httpStatusCode.NOT_FOUND
            ? notFound()
            : (() => {
                  throw new Error(error.message);
              })();
    }

    const articledData = data[0];
    const relativetime = moment(articledData.createdAt).fromNow();

    return (
        <Fragment>
            <section className="">
                <Heading1 className="text-4xl md:text-6xl">
                    {articledData.title}
                </Heading1>
                <Paragraph className="text-muted-foreground">
                    {articledData.description}
                </Paragraph>
                <div className="flex my-5 space-x-4">
                    <Avatar className="h-12 w-12">
                        <AvatarImage src="https://github.com/shadcn.png" />
                        <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                    <div>
                        <div className="flex items-center">
                            <HoverCard>
                                <HoverCardTrigger className="font-medium cursor-pointer">
                                    {articledData.author.name}
                                </HoverCardTrigger>
                                <HoverCardContent>
                                    The React Framework – created and maintained
                                    by @vercel.
                                </HoverCardContent>
                            </HoverCard>
                            <Button
                                variant={'ghost'}
                                size={'sm'}
                                className="hover:bg-transparent text-green-600 py-0  my-0"
                            >
                                Follow
                            </Button>
                        </div>
                        <Paragraph className="text-sm text-muted-foreground -mt-2">
                            5 min read . {relativetime}
                        </Paragraph>
                    </div>
                </div>
            </section>
            <ViewEditor content={articledData.content} />
        </Fragment>
    );
}
