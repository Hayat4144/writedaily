import PrivateNavbar from '@/components/Navbar/PrivateNavbar';
import React, { Fragment } from 'react';

export default function layout({ children }: { children: React.ReactNode }) {
    return (
        <Fragment>
            <header>
                <PrivateNavbar />
            </header>
            {children}
        </Fragment>
    );
}
