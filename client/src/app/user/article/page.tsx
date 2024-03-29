import { Button } from '@/components/ui/button';
import { Heading2, Paragraph } from '@/components/ui/typography';
import React, { Fragment } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import CardItem from '@/components/user/articles/CardItem';
import WriteDrawer from '@/components/Navbar/WriteDrawer';
import PrivateNavbar from '@/components/Navbar/PrivateNavbar';
import Link from 'next/link';
import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { userArticles } from '@/externalapi/article';

export const revalidate = 30;

export const metadata: Metadata = {
    title: 'Your Articles | Writedaily',
    description:
        'View your articles on WriteDaily. Manage and organize your published and draft articles.',
};

export default async function page({
    searchParams,
}: {
    searchParams?: {
        currentTab?: string;
    };
}) {
    const currentTab = searchParams?.currentTab || 'drafts';
    const session = await getServerSession(authOptions);
    if (!session) {
        return redirect('/auth/signin');
    }
    const { data, error } = await userArticles(session.user.id);
    if (error) throw new Error(error);
    const draftsData = data.results.filter((item: any) => !item.isPublished);
    const pubslishedData = data.results.filter((item: any) => item.isPublished);
    return (
        <Fragment>
            <header>
                <PrivateNavbar />
            </header>
            <main className="grid grid-cols-1 lg:grid-cols-4 h-screen">
                <section className="lg:col-span-3 px-5 py-5 md:mx-5 lg:mx-10">
                    <div className="flex items-center justify-between">
                        <Heading2>Your Articles</Heading2>
                        <WriteDrawer>
                            <Button className="rounded-full">
                                Write an article
                            </Button>
                        </WriteDrawer>
                    </div>
                    <Tabs defaultValue="drafts" className="w-full  my-10">
                        <TabsList className="w-full justify-start bg-transparent border-b rounded-none">
                            <TabsTrigger
                                className="data-[state=active]:bg-transparent data-[state=active]:shadow-none 
                                pb-2 rounded-none"
                                value="drafts"
                            >
                                Drafts
                            </TabsTrigger>
                            <TabsTrigger
                                value="published"
                                className="data-[state=active]:bg-transparent data-[state=active]:shadow-none 
                                 pb-2 rounded-none"
                            >
                                Published
                            </TabsTrigger>
                        </TabsList>
                        <TabsContent value="drafts" className="space-y-2">
                            {draftsData.length < 1 ? (
                                <Paragraph>
                                    You don't have any drafts articles yet.
                                </Paragraph>
                            ) : (
                                draftsData.map((item: any) => (
                                    <CardItem key={item.id} data={item} />
                                ))
                            )}
                        </TabsContent>
                        <TabsContent value="published" className="space-y-3">
                            {pubslishedData.length < 1 ? (
                                <Paragraph>
                                    You have not published any articles yet.
                                </Paragraph>
                            ) : (
                                <ul className="space-y-3">
                                    {pubslishedData.map((item: any) => (
                                        <li key={item.id}>
                                            <Link
                                                href={`/user/article/${item.id}`}
                                            >
                                                <CardItem data={item} />
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </TabsContent>
                    </Tabs>
                </section>
            </main>
        </Fragment>
    );
}
