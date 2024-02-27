import React, { Fragment } from 'react';
import {
    Card,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import moment from 'moment';
import { Paragraph } from '@/components/ui/typography';
import { Button } from '@/components/ui/button';
import {
    Tooltip,
    TooltipProvider,
    TooltipContent,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Icons } from '@/components/icons';
import Link from 'next/link';
import dynamic from 'next/dynamic';

const DeleteArticle = dynamic(() => import('./DeleteArticle'));

export default function CardItem({ data }: { data: any }) {
    const relativeTime = moment(data.createdAt).fromNow();
    return (
        <Fragment>
            <Card className="border-b">
                <CardHeader className="py-2">
                    <div className="flex justify-between">
                        <CardTitle>{data.title}</CardTitle>
                        <DropdownMenu>
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <DropdownMenuTrigger asChild>
                                            <Button
                                                size={'sm'}
                                                className="p-2"
                                                variant={'secondary'}
                                            >
                                                <Icons.verticle size={17} />
                                            </Button>
                                        </DropdownMenuTrigger>
                                    </TooltipTrigger>
                                    <TooltipContent className="mr-5">
                                        <Paragraph>Menu</Paragraph>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                            <DropdownMenuContent
                                side="left"
                                className="space-y-1"
                            >
                                <Link href={`/user/article/edit/${data.id}`}>
                                    <DropdownMenuItem className="space-x-2 cursor-pointer">
                                        <Icons.editing size={20} />
                                        <span>Edit</span>
                                    </DropdownMenuItem>
                                </Link>
                                <DeleteArticle id={data.id} />
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                    <CardDescription>
                        {data.description || null}
                    </CardDescription>
                </CardHeader>
                <CardFooter className="pb-2">
                    <Paragraph>{relativeTime}</Paragraph>
                </CardFooter>
            </Card>
        </Fragment>
    );
}
