import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import PublishedArticle from '@/components/forms/PublishedArticle';
import { articleById } from '@/externalapi/article';
import { httpStatusCode } from '@/types';
import { getServerSession } from 'next-auth';
import { notFound } from 'next/navigation';
import React from 'react';
import type { Metadata, ResolvingMetadata } from 'next';

type Props = {
    params: { articleId: string };
    searchParams: { [key: string]: string | string[] | undefined };
};

export async function generateMetadata(
    { params, searchParams }: Props,
    parent: ResolvingMetadata,
): Promise<Metadata> {
    const session = await getServerSession(authOptions);
    const token = session?.user.AccessToken;
    const { data } = await articleById(token as string, params.articleId);
    const result = data[0];

    return {
        title: result.title,
        description: result.description,
    };
}

export default async function page({ params }: Props) {
    const session = await getServerSession(authOptions);
    const token = session?.user.AccessToken;
    const { data, error } = await articleById(
        token as string,
        params.articleId,
    );
    if (error) {
        error.status === httpStatusCode.NOT_FOUND
            ? notFound()
            : (() => {
                  throw new Error(error.message);
              })();
    }

    const articleData = data[0];
    return (
        <main className="mx-5 md:mx-10 my-10">
            <PublishedArticle result={articleData} />
        </main>
    );
}
