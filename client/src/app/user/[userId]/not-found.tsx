import { buttonVariants } from '@/components/ui/button';
import { Heading3, Paragraph } from '@/components/ui/typography';
import { cn } from '@/lib/utils';
import { FrownIcon } from 'lucide-react';
import Link from 'next/link';
import React from 'react';

export default function NoteFound() {
    return (
        <main className="flex h-full flex-col items-center justify-center gap-2 my-10">
            <FrownIcon className="w-10 text-gray-400" />
            <Heading3>404 Not Found</Heading3>
            <Paragraph>Could not find the requested user</Paragraph>
            <Link
                href="/user"
                className={cn(buttonVariants({ variant: 'default' }))}
            >
                Go Back
            </Link>
        </main>
    );
}
