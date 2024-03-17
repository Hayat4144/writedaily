import { Heading3 } from '@/components/ui/typography';
import Link from 'next/link';
import React from 'react';
import { buttonVariants } from '../ui/button';
import { cn } from '@/lib/utils';

export default function PublicNavbar() {
    return (
        <nav className="flex items-center justify-between h-16 border-b px-5">
            <Link href="/">
                <Heading3>Writedaily</Heading3>
            </Link>
            <div className="flex items-center justify-between space-x-2">
                <div className="hidden md:flex md:items-center md:justify-between md:space-x-5 md:mx-5">
                    <Link href="/about">Our Story</Link>
                    <Link href="/read">Read</Link>
                    <Link href="/auth/signin">Sign in</Link>
                </div>
                <Link
                    href={'/auth/signup'}
                    className={cn(buttonVariants(), 'rounded-full')}
                >
                    Get started
                </Link>
            </div>
        </nav>
    );
}
