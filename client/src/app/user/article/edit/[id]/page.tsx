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

export default async function page({
    params,
}: {
    params: {
        id: string;
    };
}) {
    const session = await getServerSession(authOptions);
    const token = session?.user.AccessToken as string;
    const { data, error } = await articleById(token, params.id);
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
