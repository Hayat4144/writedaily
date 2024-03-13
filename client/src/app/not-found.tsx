import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Paragraph } from '@/components/ui/typography';
import { getServerSession } from 'next-auth';
import Image from 'next/image';
import React, { Fragment } from 'react';
import { authOptions } from './api/auth/[...nextauth]/route';
import PrivateNavbar from '@/components/Navbar/PrivateNavbar';
import PublicNavbar from '@/components/Navbar/PublicNavbar';
import BackButton from '@/components/BackButton';

export default async function Notfound() {
    const session = await getServerSession(authOptions);
    return (
        <Fragment>
            <header> {session ? <PrivateNavbar /> : <PublicNavbar />}</header>
            <div className="mx-5 my-10 md:h-screen md:mx-auto md:w-[80%] lg:w-[70%]  md:flex md:items-center md:justify-center">
                <AspectRatio ratio={16 / 9}>
                    <div className="w-full h-full">
                        <Image src="/404.jpg" fill alt="404 pic" />
                    </div>
                </AspectRatio>
                <div className="space-y-2">
                    <Paragraph>
                        The link you clicked may be broken or the page may have
                        been removed or renamed.
                    </Paragraph>
                    <BackButton />
                </div>
            </div>
        </Fragment>
    );
}
