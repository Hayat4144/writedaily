import { getServerSession } from 'next-auth';
import React, { Fragment } from 'react';
import { authOptions } from '../api/auth/[...nextauth]/route';
import PrivateNavbar from '@/components/Navbar/PrivateNavbar';
import PublicNavbar from '@/components/Navbar/PublicNavbar';
import Footer from '@/components/Footer';
import { Separator } from '@/components/ui/separator';

interface LayoutProps {
    children: React.ReactNode;
}

export default async function layout({ children }: LayoutProps) {
    const session = await getServerSession(authOptions);
    return (
        <Fragment>
            <header>{session ? <PrivateNavbar /> : <PublicNavbar />}</header>
            <main className="mx-5 md:mx-auto max-w-2xl mb-16 md:mb-20 lg:mb-28 ">
                {children}
            </main>
            <Separator className="mb-10" />
            <Footer />
        </Fragment>
    );
}
