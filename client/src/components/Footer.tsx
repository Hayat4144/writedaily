import React from 'react';
import { Heading3, Heading4, Paragraph } from './ui/typography';
import { Separator } from './ui/separator';
import { Copyright } from 'lucide-react';
import Link from 'next/link';

export default function Footer() {
    return (
        <footer className="pb-16 leading-6">
            <div className="mx-5 md:mx-auto md:w-[90%]">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-5 md:gap-10">
                    <div className="md:col-span-2">
                        <Heading3>Writedaily</Heading3>
                        <Paragraph className="dark:text-muted-foreground">
                            WriteDaily is a versatile writing platform designed
                            to inspire and facilitate creativity. With a
                            user-friendly interface, it empowers writers to
                            express their thoughts, ideas, and stories
                            effortlessly. Whether you're a seasoned author or a
                            budding writer, WriteDaily is your go-to space for
                            daily inspiration and literary exploration.{' '}
                        </Paragraph>
                    </div>
                    <div>
                        <Heading4>Quick Links</Heading4>
                        <ul className="space-y-1">
                            <li
                                className={
                                    'text-muted-foreground hover:underline border border-transparent px-2'
                                }
                            >
                                <Link href="/user/article">Articles</Link>
                            </li>
                            <li
                                className={
                                    'text-muted-foreground hover:underline border border-transparent px-2'
                                }
                            >
                                <Link href="/about">About</Link>
                            </li>
                            <li
                                className={
                                    'text-muted-foreground hover:underline border border-transparent px-2'
                                }
                            >
                                <Link href="/read">Read</Link>
                            </li>

                            <li
                                className={
                                    'text-muted-foreground hover:underline border border-transparent px-2 '
                                }
                            >
                                <Link href="/user/settings">Settings</Link>
                            </li>
                            <li
                                className={
                                    'text-muted-foreground hover:underline border border-transparent px-2 '
                                }
                            >
                                <Link href="/auth/signin">Signin</Link>
                            </li>
                        </ul>
                    </div>
                </div>
                <Separator className="mt-[3rem]" />
                <div className="md:flex md:item-center md:justify-between pt-10">
                    <div className="flex item-center space-x-1">
                        <Copyright />
                        <span> 2024</span>
                        <Link
                            href="/"
                            className="font-medium text-muted-foreground underline-offset-4 hover:underline px-1"
                        >
                            Writedaily.
                        </Link>
                        <p>All rights are reserved.</p>
                    </div>
                    <div className="flex item-center h-5 space-x-2">
                        <Link
                            href="/policy"
                            className=" text-muted-foreground font-medium underline-offset-4 hover:underline px-1"
                        >
                            Privacy Policy
                        </Link>
                        <Separator orientation="vertical" />
                        <Link
                            href="/term"
                            className=" text-muted-foreground font-medium underline-offset-4 hover:underline px-1"
                        >
                            Terms and condition
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
