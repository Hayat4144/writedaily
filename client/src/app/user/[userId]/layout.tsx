import PrivateNavbar from '@/components/Navbar/PrivateNavbar';
import React, { Fragment } from 'react';

interface layoutProps {
    children: React.ReactNode;
}

export default function layout({ children }: layoutProps) {
    return (
        <Fragment>
            <PrivateNavbar />
            {children}
        </Fragment>
    );
}
