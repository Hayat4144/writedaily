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
            {children}
        </Fragment>
    );
}
