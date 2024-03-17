import FeedItem from '@/components/feed/FeedItem';
import PaginationControls from '@/components/feed/PaginationControls';
import { Paragraph } from '@/components/ui/typography';
import { Feed } from '@/externalapi/Feed';
import { Metadata } from 'next';
import React, { Fragment } from 'react';

export const revalidate = 30;

export const metadata: Metadata = {
    title: 'Read Articles | WriteDaily',
    description:
        'Explore a collection of articles on WriteDaily. Read insightful content from various authors.',
};

export default async function page({
    searchParams,
}: {
    searchParams?: {
        page?: number;
    };
}) {
    const resultPerPage = 20;
    const currentPage = searchParams?.page ? Number(searchParams?.page) : 1;
    const { data, error } = await Feed(currentPage);
    const results = data.results;
    const totalResults = data.total_result;

    const pageCount = Math.ceil(totalResults / resultPerPage);
    const NumberOfPages = Array.from({ length: pageCount }, (_, i) => i + 1);

    return (
        <Fragment>
            <section className="space-y-2 my-5 h-screen">
                {results.length < 1 ? (
                    <div className="text-center">
                        <Paragraph className="text-xl">
                            Oops, It seems like there is nothing to read.
                        </Paragraph>
                        <Paragraph className="text-xl">
                            Try to refresh the page,might be some server
                            problem.
                        </Paragraph>
                    </div>
                ) : (
                    results.map((item: any) => (
                        <FeedItem data={item} key={item.id} />
                    ))
                )}
            </section>
            {totalResults > resultPerPage ? (
                <PaginationControls
                    pageNumbers={NumberOfPages}
                    currentPage={currentPage}
                />
            ) : null}
        </Fragment>
    );
}
