import { Heading1, Paragraph } from '@/components/ui/typography';
import ProfileHeader from '@/components/user/profile/ProfileHeader';
import React, { Fragment } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
    CountFollowers,
    CountFollowings,
    userById,
} from '@/externalapi/UserService';
import { httpStatusCode } from '@/types';
import { notFound } from 'next/navigation';
import FeedItem from '@/components/feed/FeedItem';
import { userArticles } from '@/externalapi/article';
import PaginationControls from '@/components/feed/PaginationControls';
import { Metadata, ResolvingMetadata } from 'next';

type Props = {
    params: {
        userId: string;
    };
    searchParams?: {
        page: number;
    };
};

export async function generateMetadata(
    { params }: Props,
    parent: ResolvingMetadata,
): Promise<Metadata> {
    const { data } = await userById(params.userId);
    return {
        title: `${data.name} | Writedaily`,
        description:
            'Explore user details on WriteDaily. Discover information about users, including their published posts, bio, following, and followers.',
    };
}

export default async function page({ params, searchParams }: Props) {
    const currentPage = Number(searchParams?.page) ?? 1;
    const { data, error } = await userById(params.userId);
    if (error) {
        error.status === httpStatusCode.NOT_FOUND
            ? notFound()
            : (() => {
                  throw new Error(error.message);
              })();
        return;
    }
    const [followers, feedData, following] = await Promise.all([
        CountFollowers(params.userId),
        userArticles(params.userId),
        CountFollowings(params.userId),
    ]);
    if (followers.error || following.error || feedData.error) {
        throw new Error(following.error || followers.error || feedData.error);
    }
    const { results, total_result } = feedData.data;

    const profileData = {
        ...data,
        followers: followers.data,
        following: following.data,
    };

    const resultPerPage = 20;
    const pageCount = Math.ceil(total_result / resultPerPage);
    const NumberOfPages = Array.from({ length: pageCount }, (_, i) => i + 1);

    return (
        <Fragment>
            <main className="grid grid-cols-1 md:grid-cols-3  h-screen">
                <section className="md:col-span-2 px-5 py-5 md:mx-5 lg:mx-10">
                    <div className="md:hidden">
                        <ProfileHeader data={profileData} />
                    </div>
                    <Heading1 className="hidden md:block">{data.name}</Heading1>
                    <Tabs defaultValue="home" className="w-full md:my-5">
                        <TabsList className="w-full justify-start bg-transparent border-b rounded-none">
                            <TabsTrigger
                                className="data-[state=active]:bg-transparent data-[state=active]:shadow-none 
                                pb-2 rounded-none"
                                value="home"
                            >
                                Home
                            </TabsTrigger>
                            <TabsTrigger
                                value="about"
                                className="data-[state=active]:bg-transparent data-[state=active]:shadow-none 
                                 pb-2 rounded-none"
                            >
                                About
                            </TabsTrigger>
                        </TabsList>
                        <TabsContent value="home" className="space-y-2">
                            {feedData.data ? (
                                results.length > 0 ? (
                                    results.map((item: any) => (
                                        <FeedItem
                                            privateComp={true}
                                            data={item}
                                            key={item.id}
                                        />
                                    ))
                                ) : (
                                    <Fragment>
                                        <Paragraph>
                                            You don't have any articles yet.
                                        </Paragraph>
                                    </Fragment>
                                )
                            ) : (
                                <Fragment>{feedData.error}</Fragment>
                            )}
                        </TabsContent>
                        <TabsContent value="about">
                            {data.bio ? (
                                <Paragraph>{data.bio}</Paragraph>
                            ) : null}
                        </TabsContent>
                    </Tabs>
                    {total_result > resultPerPage ? (
                        <PaginationControls
                            pageNumbers={NumberOfPages}
                            currentPage={currentPage}
                        />
                    ) : null}
                </section>
                <aside className="hidden md:block md:col-span-1 md:border-l md:p-5">
                    <ProfileHeader data={profileData} />
                </aside>
            </main>
        </Fragment>
    );
}
