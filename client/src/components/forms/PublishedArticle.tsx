'use client';
import React, {
    Fragment,
    useState,
    useEffect,
    useCallback,
    useMemo,
} from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Heading3, Paragraph } from '@/components/ui/typography';
import { Icons } from '../icons';
import { AspectRatio } from '../ui/aspect-ratio';
import Image from 'next/image';
import debounce from 'lodash.debounce';
import searchTopic, { Addtopic } from '@/externalapi/Topics';
import { toast } from '../ui/use-toast';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
    DropdownMenuItem,
} from '../ui/dropdown-menu';
import { useSession } from 'next-auth/react';
import { Loader2 } from 'lucide-react';
import { publishArticleAction } from '@/app/action';
import { redirect, useRouter } from 'next/navigation';

interface PublishedArticleFormProps {
    result: any;
}

interface topicObject {
    id: string;
    name: string;
}

export default function PublishedArticle({
    result,
}: PublishedArticleFormProps) {
    const [title, setTitle] = useState<string>(result.title);
    const [description, setDescription] = useState<string>(result.description);
    const [topic, setTopic] = useState<string>('');
    const [topicsArray, setTopicsArray] = useState<topicObject[]>([]);
    const [file, setFile] = useState<File | null>(null);
    const [image, setImage] = useState<string | ArrayBuffer | null>(null);
    const [topicsData, setTopicsData] = useState<[]>([]);
    const [open, setOpen] = useState<boolean>(false);
    const session = useSession();
    const [isLoading, setisLoading] = useState<boolean>(false);
    const [removedImage, setremovedImage] = useState<boolean>(false);
    const { push } = useRouter();

    const removeImageHandler = () => {
        setremovedImage((prevState) => !removedImage);
        setImage(null);
    };

    useEffect(() => {
        if (result.publishedImage) {
            setImage(result.publishedImage);
        }
        if (result.topics) {
            setTopicsData(result.topics);
            setTopicsArray(result.topics);
        }
    }, [result]);

    const token = session.data?.user.AccessToken as string;

    const KeydownHandler = async (e: React.KeyboardEvent) => {
        if (e.keyCode === 13 && topic.length > 0) {
            const id = Math.random().toString();
            addTopic(id, topic);
            const { data, error } = await Addtopic(topic);
            removeTopic(id);
            if (error) {
                return toast({ title: error, variant: 'destructive' });
            }
            addTopic(data.id, data.name);
        }
    };

    const fileHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files) return;
        const [file] = Array.from(e.target.files);
        setFile(file);
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();

        const droppedFiles = e.dataTransfer.files;

        if (droppedFiles.length > 0) {
            const [file] = Array.from(droppedFiles);

            // Check if the dropped file is an image
            if (file.type.startsWith('image/')) {
                setFile(file);
            } else {
                toast({
                    title: 'Invalid file type. Please drop an image.',
                    variant: 'destructive',
                });
            }
        }
    };

    useEffect(() => {
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImage(reader.result);
            };
            reader.readAsDataURL(file);
        }
    }, [file]);

    const sendRequest = useCallback(async (value: string) => {
        const { data, error } = await searchTopic(value);
        setOpen((prevState) => !prevState);
        if (error) {
            return toast({ title: error, variant: 'destructive' });
        }
        setTopicsData(data);
    }, []);

    const debouncedSendRequest = useMemo(() => {
        return debounce(sendRequest, 300);
    }, [sendRequest]);

    const changeHandler = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setTopic(value);
        debouncedSendRequest(value);
    };

    const removeTopic = (id: string) => {
        const updatedTopics = topicsArray.filter((item) => item.id !== id);
        setTopicsArray(updatedTopics);
    };

    const addTopic = (id: string, name: string) => {
        const isTopicExist = topicsArray.filter((item) => item.id === id);
        if (isTopicExist.length) {
            return toast({
                title: `${isTopicExist[0].name} is already exist.`,
            });
        }
        setTopicsArray((prevState) => [...prevState, { id, name }]);
        setTopic('');
    };

    const SubmitHandler = async (e: React.FormEvent) => {
        e.preventDefault();
        setisLoading((prevState) => !prevState);
        if (!result.publishedImage && !file) {
            setisLoading((prevState) => !prevState);
            return toast({ title: 'Please add an image.' });
        }
        const publishedData = new FormData();
        publishedData.append('articleId', result.id);
        publishedData.append(
            'topicsId',
            JSON.stringify(topicsArray.map((item) => item.id)),
        );
        publishedData.append('title', title);
        publishedData.append('description', description);
        publishedData.append('removedImage', JSON.stringify(removedImage));
        if (file) {
            publishedData.append('publishedImage', file);
        }
        const config = {
            Authorization: `Bearer ${token}`,
        };
        const { data, error } = await publishArticleAction(
            publishedData,
            config,
        );
        setisLoading((prevState) => !prevState);
        if (error) return toast({ title: error, variant: 'destructive' });
        toast({ title: data });
        push('/user/article');
    };

    return (
        <form
            onSubmit={SubmitHandler}
            encType={'multipart/form-data'}
            className="grid grid-col-1 md:grid-cols-2 gap-5"
        >
            <div>
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
                    <DropdownMenu open={open} onOpenChange={setOpen}>
                        <DropdownMenuTrigger></DropdownMenuTrigger>
                        <DropdownMenuContent side="top" className="mx-5 w-20">
                            {topicsData.length < 1 ? (
                                <Paragraph className="px-2">
                                    No topic has been found.{' '}
                                </Paragraph>
                            ) : null}
                            {topicsData.length > 0
                                ? topicsData.map((item: any) => (
                                      <DropdownMenuItem
                                          key={item.id}
                                          onClick={() =>
                                              addTopic(item.id, item.name)
                                          }
                                      >
                                          {item.name}
                                      </DropdownMenuItem>
                                  ))
                                : null}
                        </DropdownMenuContent>
                    </DropdownMenu>
                    <Paragraph>
                        Add or change topics (up to 5) so readers know what your
                        story is about
                    </Paragraph>

                    <div className="border bg-accent rounded-md border-input flex items-center px-2">
                        <div className="flex items-center space-x-1">
                            {topicsArray.map((item) => (
                                <button
                                    type="button"
                                    key={item.id}
                                    className="h-6 inline-flex items-center text-sm
                                border border-input space-x-1 px-1 bg-white"
                                >
                                    <span>{item.name}</span>
                                    <Icons.close
                                        onClick={() => removeTopic(item.id)}
                                        size={14}
                                    />
                                </button>
                            ))}
                        </div>
                        <input
                            type="text"
                            className="outline-none px-5 py-2 h-10 my-1 
                            text-sm bg-transparent
                            w-full placeholder:text-muted-foreground placeholder:text-sm"
                            placeholder="Add topics"
                            value={topic}
                            disabled={topicsArray.length >= 5}
                            onKeyDown={KeydownHandler}
                            onChange={changeHandler}
                        />
                    </div>
                    <Button
                        disabled={isLoading}
                        className="hidden md:flex"
                        type="submit"
                    >
                        {isLoading ? (
                            <Fragment>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Please wait
                            </Fragment>
                        ) : (
                            'Publish'
                        )}
                    </Button>
                </div>
            </div>
            <section className="space-y-2">
                <div
                    className="flex items-center justify-center w-full"
                    onDragOver={(e) => {
                        e.preventDefault();
                    }}
                    onDrop={handleDrop}
                >
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
                        <Image src={image} fill alt={'publishedImage'} />
                        <Button
                            className="absolute top-5 right-5"
                            onClick={removeImageHandler}
                        >
                            <Icons.close size={'18'} />
                        </Button>
                    </AspectRatio>
                ) : null}

                <Button disabled={isLoading} className="md:hidden">
                    {isLoading ? (
                        <Fragment>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Please wait
                        </Fragment>
                    ) : (
                        'Publish'
                    )}
                </Button>
            </section>
        </form>
    );
}
