import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import { Icons } from '../icons';
import Link from 'next/link';
import dynamic from 'next/dynamic';

const SignOut = dynamic(() => import('./Signout'));
const Theme = dynamic(() => import('./Theme'));

export default function UserProfile() {
    return (
        <DropdownMenu>
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <DropdownMenuTrigger asChild>
                            <Avatar className="cursor-pointer">
                                <AvatarImage src="https://github.com/hayat4144.png" />
                                <AvatarFallback>HI</AvatarFallback>
                            </Avatar>
                        </DropdownMenuTrigger>
                    </TooltipTrigger>
                    <TooltipContent className="mr-5">
                        <p>Accounts</p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>

            <DropdownMenuContent side="bottom" className="w-56 mr-5 my-1">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <Link href={'/user/profile'}>
                    <DropdownMenuItem className="space-x-2 cursor-pointer">
                        <Icons.add size={20} />
                        <span>Profile</span>
                    </DropdownMenuItem>
                </Link>
                <Link href={'/user/articles'}>
                    <DropdownMenuItem className="space-x-2 my-2  cursor-pointer">
                        <Icons.article size={20} />
                        <span>Articles</span>
                    </DropdownMenuItem>
                </Link>
                <Link href={'/bookmars'}>
                    <DropdownMenuItem className="space-x-2 my-2 cursor-pointer">
                        <Icons.bookmark size={20} />
                        <span>Bookmarks</span>
                    </DropdownMenuItem>
                </Link>
                <Link href={'/settings'}>
                    <DropdownMenuItem className="space-x-2 my-2 cursor-pointer">
                        <Icons.settings size={20} />
                        <span>Settings</span>
                    </DropdownMenuItem>
                </Link>
                <DropdownMenuSeparator />
                <Theme />
                <DropdownMenuSeparator />
                <SignOut />
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
