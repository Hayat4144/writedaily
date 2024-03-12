import BulletedList from '@/components/Editor/Blocks/BulletedList';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Heading3, Paragraph } from '@/components/ui/typography';
import Image from 'next/image';
import React from 'react';

export default function page() {
    return (
        <div className="mt-8">
            <div className="md:mx-auto md:w-1/2 mx-5">
                <div className="mb-5 md:mb-10 md:text-center">
                    <Heading3>About Us</Heading3>
                    <Paragraph>
                        Empowering writers with a robust Slate.js editor,
                        Markdown support, and seamless table integration tools
                    </Paragraph>
                </div>
            </div>
            <div className="mx-5 md:mx-auto md:w-[90%]">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-10">
                    <AspectRatio ratio={16 / 9}>
                        <Image
                            src="/image1.jpg"
                            alt="pic"
                            className="rounded-md"
                            fill
                        />
                    </AspectRatio>
                    <div className="space-y-2">
                        <Paragraph className="leading-relaxed">
                            Welcome to WriteDaily, your haven for creative
                            expression and immersive writing experiences.
                            Whether you're a seasoned author with a treasure
                            trove of stories or an aspiring writer taking your
                            first steps, our platform is meticulously crafted to
                            elevate your daily writing ritual.{' '}
                        </Paragraph>
                        <Paragraph>
                            Immerse yourself in the power of words with our
                            robust Slate.js-based editor, offering unparalleled
                            flexibility and Markdown support. From crafting
                            intricate narratives to seamlessly integrating
                            images, links, and code blocks, WriteDaily empowers
                            you to bring your ideas to life effortlessly.{' '}
                        </Paragraph>
                        <Paragraph>
                            Join a thriving community of writers, where
                            inspiration flows freely, and collaboration is woven
                            into the fabric of every keystroke. Transform your
                            writing journey into a joyous exploration of
                            imagination and creativity. WriteDaily: Where every
                            word finds its home.
                        </Paragraph>
                    </div>
                </div>
                <Heading3 className="my-3">
                    What make us different from other blogging plateforms?
                </Heading3>
                <BulletedList className="px-3">
                    <li>Powerful Slate.js based editor.</li>
                    <li>Markdown support.</li>
                    <li>Insert images, links, and code blocks</li>
                    <li>Create and manage lists effortlessly</li>
                    <li>Manage todo list directly in the editor.</li>
                    <li>Intuitive interface for a smooth writing experience</li>
                    <li>Add tables</li>
                    <li>
                        Marks are supported e.g Bold, Underline, Italic,Color
                        highlight , superscript , subscript and many more.
                    </li>
                    <li>
                        Manage your editor histroy by Undo and Redo with
                        shortcuts.
                    </li>
                </BulletedList>
            </div>
        </div>
    );
}
