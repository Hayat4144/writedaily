import React from 'react';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
} from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Heading4 } from '@/components/ui/typography';
import Image from 'next/image';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Button } from '../ui/button';
import { Icons } from '../icons';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip';

export default function FeedItem() {
    return (
        <Card>
            <CardHeader className="flex flex-row items-center space-x-4 py-3">
                <Avatar>
                    <AvatarImage src="http://github.com/hayat4144.png"></AvatarImage>
                    <AvatarFallback>HI</AvatarFallback>
                </Avatar>
                <div>
                    <p className="font-bold leading-none">Hayat ilyas</p>
                    <CardDescription>
                        ihayat855@gmail.com . Jul 23
                    </CardDescription>
                </div>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div className="md:col-span-2">
                    <Heading4>
                        Building notes app in React using React Markdown
                    </Heading4>
                    <CardDescription>
                        Introduction when it come to web application
                        development, React provides developers with the
                        flexibility to create appli...
                    </CardDescription>
                </div>
                <div className="">
                    <AspectRatio ratio={10 / 5} className="rounded-md">
                        <Image
                            src="/image1.jpg"
                            alt="pic"
                            fill
                            className="w-full h-full rounded-md"
                        />
                    </AspectRatio>
                </div>
            </CardContent>
            <CardFooter className="py-2 w-full flex items-center justify-between">
                <div className="flex items-center">
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    variant={'ghost'}
                                    className="text-muted-foreground"
                                >
                                    <Icons.like className="mr-2 h-4 w-4" />
                                    246
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Like</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>

                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    variant={'ghost'}
                                    className="text-muted-foreground"
                                >
                                    <Icons.comment className="mr-2 h-4 w-4" />
                                    123
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Comment</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                    <p className="text-muted-foreground text-sm ml-2">
                        5 min read
                    </p>
                </div>
                <div className="flex item-center space-x-1">
                    <Button className="text-sm h-8" variant={'secondary'}>
                        React
                    </Button>
                    <Button className="text-sm h-8" variant={'default'}>
                        Node
                    </Button>
                </div>
            </CardFooter>
        </Card>
    );
}
