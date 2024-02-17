import PrivateNavbar from '@/components/Navbar/PrivateNavbar';
import FeedItem from '@/components/feed/FeedItem';
import { Icons } from '@/components/icons';
import { Button } from '@/components/ui/button';
import React, { Fragment } from 'react';

export default function page() {
    return (
        <Fragment>
            <header>
                <PrivateNavbar />
            </header>
            <main className="mx-5 md:mx-auto max-w-2xl">
                <div className=" my-5">
                    <Button variant={'ghost'} className="rounded-full">
                        <Icons.chevronsUpDown className="mr-2 h-4 w-4" />
                        Personalized
                    </Button>
                    <Button variant={'ghost'} className="rounded-full">
                        <Icons.chevronsUpDown className="mr-2 h-4 w-4" />
                        following
                    </Button>
                    <Button variant={'ghost'} className="rounded-full">
                        <Icons.chevronsUpDown className="mr-2 h-4 w-4" />
                        featured
                    </Button>
                </div>
                <div className="space-y-2">
                    <FeedItem />
                    <FeedItem />
                    <FeedItem />
                    <FeedItem />
                </div>
            </main>
        </Fragment>
    );
}
