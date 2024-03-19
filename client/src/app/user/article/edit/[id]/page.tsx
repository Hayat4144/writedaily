import React, { Fragment } from 'react';
import Editor from '@/components/Editor';
import { Heading2, Paragraph } from '@/components/ui/typography';
import { buttonVariants } from '@/components/ui/button';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import UserProfile from '@/components/Navbar/UserProfile';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { articleById } from '@/externalapi/article';
import { Metadata, ResolvingMetadata } from 'next';
import { notFound, redirect } from 'next/navigation';
import { httpStatusCode } from '@/types';
import UnpublishAlert from '@/components/user/articles/UnpublishAlert';

type Props = {
    params: { id: string };
    searchParams: { [key: string]: string | string[] | undefined };
};

export async function generateMetadata(
    { params }: Props,
    parent: ResolvingMetadata,
): Promise<Metadata> {
    const { data } = await articleById(params.id);
    return {
        title: `Edit ${data[0].title} | Writedaily`,
        description:
            'Edit your article on WriteDaily. Make revisions, add new content, and fine-tune your writing before publishing it to the world.',
    };
}

export default async function page({
    params,
}: {
    params: {
        id: string;
    };
}) {
    const session = await getServerSession(authOptions);
    if (!session) return redirect('/auth/signin');
    const { data, error } = await articleById(params.id);
    if (error) {
        error.status === httpStatusCode.NOT_FOUND
            ? notFound()
            : (() => {
                  throw new Error(error.message);
              })();
    }

    return (
        <Fragment>
            <header>
                <nav className="flex h-16 px-5 md:px-0 justify-between md:mx-10 items-center">
                    <div className="flex items-center space-x-2">
                        <Heading2 className="text-2xl md:text-4xl">
                            Writedaily
                        </Heading2>
                        <Paragraph className="text-sm">
                            Drafts in {session?.user.name}
                        </Paragraph>
                    </div>
                    <div className=" flex items-center space-x-3">
                        {!data[0].isPublished ? (
                            <Link
                                href={`/user/article/publish/${params.id}`}
                                className={cn(
                                    buttonVariants({
                                        size: 'sm',
                                        className: 'rounded-full py-0',
                                    }),
                                )}
                            >
                                Published
                            </Link>
                        ) : (
                            <UnpublishAlert title={data[0].title} />
                        )}
                        <UserProfile />
                    </div>
                </nav>
            </header>
            <main>
                <Editor data={data[0]} />
            </main>
        </Fragment>
    );
}
