import React from 'react';
import { Input } from '../ui/input';
import { Icons } from '../icons';
import Link from 'next/link';
import WriteDrawer from './WriteDrawer';
import UserProfile from './UserProfile';
import { Heading3 } from '../ui/typography';

export default function PrivateNavbar() {
    return (
        <nav className="flex justify-between border-b px-5 h-16 items-center">
            <Link href="/">
                <Heading3>Writedaily</Heading3>
            </Link>

            <div className="flex items-center justify-between space-x-2">
                <Input
                    className="hidden md:block rounded-full w-56"
                    placeholder="Search for the article"
                />
                <Link href={'/search'} className="md:hidden">
                    <Icons.search size={20} />
                </Link>
                <WriteDrawer />
                <UserProfile />
            </div>
        </nav>
    );
}
