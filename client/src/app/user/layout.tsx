import PrivateNavbar from '@/components/Navbar/PrivateNavbar';
import React, { Fragment } from 'react';

interface LayoutProps {
    children: React.ReactNode;
}

export default function layout({ children }: LayoutProps) {
    return (
        <Fragment>
            <header>
                <PrivateNavbar />
            </header>
            {children}
        </Fragment>
    );
}
