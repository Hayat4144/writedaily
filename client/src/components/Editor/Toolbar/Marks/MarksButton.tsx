import React from 'react';
import { Button } from '@/components/ui/button';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import { useSlate } from 'slate-react';
import editorUtility from '@/lib/editorUtility';
import { Marks } from '@/types';

interface MarkButtonsProps {
    item: Marks;
}

export default function MarkButtons({ item }: MarkButtonsProps) {
    const editor = useSlate();
    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger
                    asChild
                    onClick={() =>
                        editorUtility.toggleMark(editor, item.mark, true)
                    }
                >
                    <Button
                        variant={'ghost'}
                        size={'sm'}
                        className="hover:dark:bg-[#3b3b40] rounded-none"
                    >
                        {item.icon}
                    </Button>
                </TooltipTrigger>
                <TooltipContent>
                    <p>
                        <span className="capitalize">{item.mark}</span>
                        <span className="ml-1">{item.shortcut}</span>
                    </p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
}
