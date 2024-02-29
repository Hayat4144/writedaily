import PrivateNavbar from '@/components/Navbar/PrivateNavbar';
import { SidebarNav } from '@/components/settings/SideNavbar';
import { Separator } from '@/components/ui/separator';
import React, { Fragment } from 'react';

interface layoutProps {
    children: React.ReactNode;
}

const sidebarNavItems = [
    {
        title: 'Profile',
        href: '/user/settings',
    },
    {
        title: 'Account',
        href: '/user/settings/account',
    },
    {
        title: 'Appearance',
        href: '/user/settings/apperance',
    },
    {
        title: 'Notifications',
        href: '/user/settings/notifications',
    },
];

export default function layout({ children }: layoutProps) {
    return (
        <Fragment>
            <header>
                <PrivateNavbar />
            </header>
            <main>
                <div className="">
                    <div className="space-y-0.5 px-5 py-2">
                        <h2 className="text-2xl font-bold tracking-tight">
                            Settings
                        </h2>
                        <p className="text-muted-foreground">
                            Manage your account settings and set e-mail
                            preferences.
                        </p>
                    </div>
                    <Separator />
                    <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0 my-5">
                        <aside className="mx-4 lg:w-1/5 ">
                            <SidebarNav items={sidebarNavItems} />
                        </aside>
                        <div className="flex-1 lg:max-w-2xl px-5 lg:px-0">
                            {children}
                        </div>
                    </div>
                </div>
            </main>
        </Fragment>
    );
}
