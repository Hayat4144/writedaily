import { getServerSession } from 'next-auth';
import React, { Fragment } from 'react';
import { authOptions } from '../api/auth/[...nextauth]/route';
import PrivateNavbar from '@/components/Navbar/PrivateNavbar';
import PublicNavbar from '@/components/Navbar/PublicNavbar';
import Footer from '@/components/Footer';
import { Separator } from '@/components/ui/separator';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'About Us - WriteDaily',
    description:
        'Discover WriteDaily: Your creative sanctuary for immersive writing experiences and seamless collaboration.',
};

type props = {
    children: React.ReactNode;
};

export default async function layout({ children }: props) {
    const session = await getServerSession(authOptions);
    return (
        <Fragment>
            <header>{session ? <PrivateNavbar /> : <PublicNavbar />}</header>
            <main className="mb-16 md:mb-18 lg:mb-20"> {children}</main>
            <Separator className="mb-10" />
            <Footer />
        </Fragment>
    );
}
