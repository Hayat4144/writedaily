import React from 'react';
import { Input } from '../ui/input';
import { Icons } from '../icons';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '../ui/button';
import Link from 'next/link';
import WriteDrawer from './WriteDrawer';

export default function PrivateNavbar() {
    return (
        <nav className="flex justify-between border-b pb-3 h-10">
            <h1>Writedaily</h1>

            <div className="flex items-center justify-between space-x-2">
                <Input className="hidden md:block" />
                <Link href={'/search'} className="md:hidden">
                    <Icons.search size={20} />
                </Link>
                <WriteDrawer />
                <Avatar>
                    <AvatarImage src="https://github.com/hayat4144.png" />
                    <AvatarFallback>HI</AvatarFallback>
                </Avatar>
            </div>
        </nav>
    );
}
