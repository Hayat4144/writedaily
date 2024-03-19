import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import PublishedArticle from '@/components/forms/PublishedArticle';
import { articleById, getpublishArticleData } from '@/externalapi/article';
import { httpStatusCode } from '@/types';
import { Metadata, ResolvingMetadata } from 'next';
import { getServerSession } from 'next-auth';
import { notFound, redirect } from 'next/navigation';
import React from 'react';

type Props = {
    params: { articleId: string };
    searchParams: { [key: string]: string | string[] | undefined };
};

export async function generateMetadata(
    { params }: Props,
    parent: ResolvingMetadata,
): Promise<Metadata> {
    const session = await getServerSession(authOptions);
    if (!session) return redirect('/auth/signin');
    const token = session?.user.AccessToken as string;
    const { data, error } = await getpublishArticleData(
        token,
        params.articleId,
    );
    return {
        title: `Publish ${data.title || 'article'} | Writedaily`,
        description:
            'Publish your article on WriteDaily. Make revisions, add new content, and fine-tune your writing before publishing it to the world.',
    };
}

export default async function page({ params }: Props) {
    const session = await getServerSession(authOptions);
    if (!session) return redirect('/auth/signin');
    const token = session?.user.AccessToken as string;
    const { data, error } = await getpublishArticleData(
        token,
        params.articleId,
    );
    if (error) {
        error.status === httpStatusCode.NOT_FOUND
            ? notFound()
            : (() => {
                  throw new Error(error.message);
              })();
    }

    const filteredData = data.topics.map((item: any) => {
        if (typeof item === 'object' && item !== null) {
            const { topics } = item;
            return { ...topics };
        }
    });
    data['topics'] = filteredData;

    return (
        <main className="mx-5 md:mx-10 my-10">
            <PublishedArticle result={data} />
        </main>
    );
}
