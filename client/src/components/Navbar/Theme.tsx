'use client';
import React, { Fragment } from 'react';
import { DropdownMenuItem } from '../ui/dropdown-menu';
import { Icons } from '../icons';

export default function Theme() {
    return (
        <Fragment>
            <DropdownMenuItem className="my-2 cursor-pointer space-x-2">
                <Icons.light size={20} />
                <span>Light</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="my-2 cursor-pointer space-x-2">
                <Icons.dark size={20} />
                <span>Dark</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="my-2 cursor-pointer space-x-2">
                <Icons.system size={20} />
                <span>System</span>
            </DropdownMenuItem>
        </Fragment>
    );
}
