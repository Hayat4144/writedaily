import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import PublishedArticle from '@/components/forms/PublishedArticle';
import { articleById } from '@/externalapi/article';
import { httpStatusCode } from '@/types';
import { getServerSession } from 'next-auth';
import { notFound } from 'next/navigation';
import React from 'react';

interface PublishedProps {
    params: {
        articleId: string;
    };
}

export default async function page({ params }: PublishedProps) {
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
        <main className="grid grid-cols-1 gap-5 md:grid-cols-4 mx-5 md:mx-10  my-10">
            <PublishedArticle result={articleData} />
        </main>
    );
}
