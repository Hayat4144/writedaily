import { useMediaQuery } from '@/hooks/useMediaquery';
import React from 'react';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Icons } from '@/components/icons';
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerFooter,
    DrawerTrigger,
} from '@/components/ui/drawer';
import { TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import InsertImageTab from './InsertImageTab';
import InsertLinkForm from '@/components/forms/ImageLinkForm';

type compType = 'link' | 'image';
interface DrawerComponentProps {
    comp: compType;
}

export default function DrawerComponent({ comp }: DrawerComponentProps) {
    const [open, setOpen] = React.useState(false);
    const isDesktop = useMediaQuery('(min-width: 768px)');
    if (isDesktop) {
        return (
            <React.Fragment>
                <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>
                        <TooltipTrigger asChild>
                            <Button
                                className="h-8"
                                size={'icon'}
                                variant={'ghost'}
                            >
                                {comp === 'link' ? (
                                    <Icons.link size={17} />
                                ) : (
                                    <Icons.image size={17} />
                                )}
                            </Button>
                        </TooltipTrigger>
                    </PopoverTrigger>
                    <PopoverContent align="start" className="w-[320px] my-1">
                        {comp === 'image' ? (
                            <InsertImageTab />
                        ) : (
                            <InsertLinkForm compType="link" />
                        )}
                    </PopoverContent>
                </Popover>
                <TooltipContent>Insert {comp}</TooltipContent>
            </React.Fragment>
        );
    }
    return (
        <Drawer open={open} onOpenChange={setOpen}>
            <DrawerTrigger asChild>
                <Button className="h-8" size={'icon'} variant={'ghost'}>
                    {comp === 'link' ? (
                        <Icons.link size={17} />
                    ) : (
                        <Icons.image size={17} />
                    )}
                </Button>
            </DrawerTrigger>
            <DrawerContent className="w-full">
                <div className="p-4 my-2 w-full">
                    {comp === 'image' ? (
                        <InsertImageTab />
                    ) : (
                        <InsertLinkForm compType="link" />
                    )}
                </div>

                <DrawerFooter className="pt-2">
                    <DrawerClose asChild>
                        <Button variant="outline">Cancel</Button>
                    </DrawerClose>
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    );
}
