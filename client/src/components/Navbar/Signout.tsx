'use client';
import { signOut } from 'next-auth/react';
import { DropdownMenuItem } from '../ui/dropdown-menu';
import { Icons } from '../icons';

const SignOut = () => {
    return (
        <DropdownMenuItem
            className="space-x-2 my-2 cursor-pointer"
            onClick={() => {
                signOut({ callbackUrl: '/auth/signin' });
            }}
        >
            <Icons.logout size={20} />
            <span>Sign out</span>
        </DropdownMenuItem>
    );
};

export default SignOut;
