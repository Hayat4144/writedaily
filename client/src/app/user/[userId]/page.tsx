import PrivateNavbar from '@/components/Navbar/PrivateNavbar';
import { Heading1, Paragraph } from '@/components/ui/typography';
import ProfileHeader from '@/components/user/profile/ProfileHeader';
import React, { Fragment } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import {
    CountFollowers,
    CountFollowings,
    userById,
} from '@/externalapi/UserService';
import { httpStatusCode } from '@/types';
import { notFound } from 'next/navigation';
import { Feed } from '@/externalapi/Feed';
import FeedItem from '@/components/feed/FeedItem';
import { privateArticle } from '@/externalapi/article';

export default async function page({
    params,
}: {
    params: {
        userId: string;
    };
}) {
    const session = await getServerSession(authOptions);
    const { data, error } = await userById(params.userId);
    if (error) {
        error.status === httpStatusCode.NOT_FOUND
            ? notFound()
            : (() => {
                  throw new Error(error.message);
              })();
        return;
    }
    const token = session?.user.AccessToken as string;
    const [followers, following, feedData] = await Promise.all([
        CountFollowers(params.userId),
        CountFollowings(token),
        privateArticle(token),
    ]);
    if (followers.error || following.error) {
        throw new Error(error);
    }
    const { results, total_result } = feedData.data;
    console.log(results);

    const profileData = {
        ...data,
        followers: followers.data,
        following: following.data,
    };
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
                        <TabsContent value="about">About</TabsContent>
                    </Tabs>
                </section>
                <aside className="hidden md:block md:col-span-1 md:border-l md:p-5">
                    <ProfileHeader data={profileData} />
                </aside>
            </main>
        </Fragment>
    );
}
