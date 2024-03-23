import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Heading1, Paragraph } from '@/components/ui/typography';
import { articleById } from '@/externalapi/article';
import { httpStatusCode } from '@/types';
import { notFound } from 'next/navigation';
import React, { Fragment } from 'react';
import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
} from '@/components/ui/hover-card';
import { Button } from '@/components/ui/button';
import ViewEditor from '@/components/Editor/ViewEditor';
import type { Metadata, ResolvingMetadata } from 'next';
import { getFirstLetter } from '@/lib/utils';
import ArticleHeader from '@/components/user/articles/ArticleHeader';
import { Separator } from '@/components/ui/separator';
import HeaderBottom from '@/components/user/articles/header';

type Props = {
    params: { articleId: string };
};

export async function generateMetadata(
    { params }: Props,
    parent: ResolvingMetadata,
): Promise<Metadata> {
    const { data } = await articleById(params.articleId);
    const result = data[0];

    return {
        title: result.title,
        description: result.description,
    };
}

export default async function page({ params }: Props) {
    const { data, error } = await articleById(params.articleId);
    if (error) {
        error.status === httpStatusCode.NOT_FOUND
            ? notFound()
            : (() => {
                  throw new Error(error.message);
              })();
    }

    const articledData = data[0];

    return (
        <Fragment>
            <section className="">
                <Heading1 className="text-4xl md:text-6xl">
                    {articledData.title}
                </Heading1>
                <Paragraph className="text-muted-foreground">
                    {articledData.description}
                </Paragraph>
                <div className="flex my-5 space-x-4 item-center">
                    <Avatar className="h-12 w-12">
                        <AvatarImage src={articledData.author.profilePic} />
                        <AvatarFallback>
                            {getFirstLetter(articledData.author.name)}
                        </AvatarFallback>
                    </Avatar>
                    <div>
                        <div className="flex items-center">
                            <HoverCard>
                                <HoverCardTrigger className="font-medium cursor-pointer">
                                    {articledData.author.name}
                                </HoverCardTrigger>
                                <HoverCardContent>
                                    {articledData.author.bio}
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
                        <ArticleHeader data={articledData} />
                    </div>
                </div>
                <Separator />
                <div className="border-b py-2">
                    <HeaderBottom dataValue={articledData} />
                </div>
            </section>
            <ViewEditor content={articledData.content || []} />
        </Fragment>
    );
}
