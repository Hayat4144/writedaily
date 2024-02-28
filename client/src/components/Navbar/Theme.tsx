'use client';
import React, { Fragment } from 'react';
import { DropdownMenuItem } from '../ui/dropdown-menu';
import { Icons } from '../icons';
import { useTheme } from 'next-themes';

export default function Theme() {
    const { setTheme } = useTheme();
    return (
        <Fragment>
            <DropdownMenuItem
                className="my-2 cursor-pointer space-x-2"
                onClick={() => setTheme('light')}
            >
                <Icons.light size={20} />
                <span>Light</span>
            </DropdownMenuItem>
            <DropdownMenuItem
                className="my-2 cursor-pointer space-x-2"
                onClick={() => setTheme('dark')}
            >
                <Icons.dark size={20} />
                <span>Dark</span>
            </DropdownMenuItem>
            <DropdownMenuItem
                className="my-2 cursor-pointer space-x-2"
                onClick={() => setTheme('system')}
            >
                <Icons.system size={20} />
                <span>System</span>
            </DropdownMenuItem>
        </Fragment>
    );
}
