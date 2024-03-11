import PrivateNavbar from '@/components/Navbar/PrivateNavbar';
import FeedItem from '@/components/feed/FeedItem';
import { Feed } from '@/externalapi/Feed';
import React, { Fragment } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import PaginationControls from '@/components/feed/PaginationControls';

export default async function page({
    searchParams,
}: {
    searchParams?: {
        currentTab?: string;
        page?: number;
    };
}) {
    const resultPerPage = 20;
    const currentTab = searchParams?.currentTab || 'personalized';
    const currentPage = Number(searchParams?.page) ?? 1;
    const { data, error } = await Feed(currentPage);
    const results = data.results;
    const totalResults = data.total_result;

    const pageCount = Math.ceil(totalResults / resultPerPage);
    const NumberOfPages = Array.from({ length: pageCount }, (_, i) => i + 1);

    return (
        <Fragment>
            <header>
                <PrivateNavbar />
            </header>
            <main className="mx-5 md:mx-auto max-w-2xl mb-5">
                <Tabs defaultValue="personalized" className="w-full  my-10">
                    <TabsList className="w-full justify-start bg-transparent border-b rounded-none">
                        <TabsTrigger
                            className="data-[state=active]:bg-transparent data-[state=active]:shadow-none 
                                pb-2 rounded-none"
                            value="personalized"
                        >
                            Personalized
                        </TabsTrigger>
                        <TabsTrigger
                            value="following"
                            className="data-[state=active]:bg-transparent data-[state=active]:shadow-none 
                                 pb-2 rounded-none"
                        >
                            Following
                        </TabsTrigger>
                    </TabsList>
                    <TabsContent value="personalized" className="space-y-3">
                        {results.map((item: any) => (
                            <FeedItem data={item} key={item.id} />
                        ))}
                    </TabsContent>
                    <TabsContent value="following" className="space-y-3">
                        {results.map((item: any) => (
                            <FeedItem data={item} key={item.id} />
                        ))}
                    </TabsContent>
                </Tabs>
                {totalResults > resultPerPage ? (
                    <PaginationControls
                        pageNumbers={NumberOfPages}
                        currentPage={currentPage}
                    />
                ) : null}
            </main>
        </Fragment>
    );
}
