import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import PrivateNavbar from '@/components/Navbar/PrivateNavbar';
import PublicNavbar from '@/components/Navbar/PublicNavbar';
import { getServerSession } from 'next-auth';
import React, { Fragment } from 'react';

interface layoutProps {
    children: React.ReactNode;
}

export default async function layout({ children }: layoutProps) {
    const session = await getServerSession(authOptions);
    return (
        <Fragment>
            {session ? <PrivateNavbar /> : <PublicNavbar />}
            <main className="mx-5 flex flex-col md:mx-auto md:max-w-4xl my-5">
                {children}
            </main>
        </Fragment>
    );
}
