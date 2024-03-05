'use client';
import React, { Fragment, useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Heading3, Paragraph } from '@/components/ui/typography';
import { Icons } from '../icons';
import { AspectRatio } from '../ui/aspect-ratio';
import Image from 'next/image';

interface PublishedArticleFormProps {
    result: any;
}
export default function PublishedArticle({
    result,
}: PublishedArticleFormProps) {
    const [title, setTitle] = useState<string>(result.title);
    const [description, setDescription] = useState<string>(result.description);
    const [topic, setTopic] = useState<string>('');
    const [topicsArray, setTopicsArray] = useState<string[]>([]);
    const [file, setFile] = useState<File | null>(null);
    const [image, setImage] = useState<File | null>(null);

    const KeydownHandler = (e: React.KeyboardEvent) => {
        if (e.keyCode === 13 && topic.length > 0) {
            setTopicsArray((prevState) => [...prevState, topic]);
            setTopic('');
        }
    };

    const fileHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files) return;
        const [file] = Array.from(e.target.files);
        setFile(file);
    };

    useEffect(() => {
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImage(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    }, [file]);

    console.log(file);

    return (
        <Fragment>
            <div className="md:col-span-2">
                <Heading3>Article Preview</Heading3>
                <div className="space-y-2 my-5 md:my-0">
                    <Input
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Your article title"
                    />
                    <Textarea
                        className=""
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Your article description"
                    />
                    <div className="border bg-accent rounded-md border-input flex items-center px-2">
                        <div className="flex items-center space-x-1">
                            {topicsArray.map((item) => (
                                <button
                                    key={item}
                                    className="h-6 inline-flex items-center text-sm
                                border border-input space-x-1 px-1 bg-white"
                                >
                                    <span>{item}</span>
                                    <Icons.close size={14} />
                                </button>
                            ))}
                        </div>
                        <input
                            className="outline-none px-5 py-2 h-10 my-1 
                            text-sm bg-transparent
                            w-full placeholder:text-muted-foreground placeholder:text-sm"
                            placeholder="Add topics"
                            onKeyDown={KeydownHandler}
                            onChange={(e) => setTopic(e.target.value)}
                            id="topic"
                        />
                    </div>
                </div>
            </div>
            <section className="space-y-2 md:col-span-2">
                <Paragraph>
                    Add or change topics (up to 5) so readers know what your
                    story is about
                </Paragraph>
                <div className="flex items-center justify-center w-full">
                    <label
                        htmlFor="dropzone-file"
                        className="flex flex-col items-center justify-center w-full h-64 border-2                             border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700
                            hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500
                            dark:hover:bg-gray-600"
                    >
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <svg
                                className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400"
                                aria-hidden="true"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 20 16"
                            >
                                <path
                                    stroke="currentColor"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                                />
                            </svg>
                            <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                                <span className="font-semibold">
                                    Click to upload
                                </span>{' '}
                                or drag and drop
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                SVG, PNG, JPG or GIF (MAX. 800x400px)
                            </p>
                        </div>
                        <input
                            id="dropzone-file"
                            onChange={fileHandler}
                            type="file"
                            className="hidden"
                        />
                    </label>
                </div>
                {image ? (
                    <AspectRatio ratio={16 / 9} className="rounded-md">
                        <Image src={image} fill />
                    </AspectRatio>
                ) : null}

                <Button>Publish</Button>
            </section>
        </Fragment>
    );
}
