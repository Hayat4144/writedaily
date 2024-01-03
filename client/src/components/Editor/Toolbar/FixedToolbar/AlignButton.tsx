import React from 'react';
import { useSlate } from 'slate-react';
import { Button } from '@/components/ui/button';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import editorUtility from '@/lib/editorUtility';
import { AlignType } from '@/types';

interface AlignButtonProps {
    type: AlignType;
    icon: React.ReactNode;
}

export default function AlignButton({ type, icon }: AlignButtonProps) {
    const editor = useSlate();
    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <Button
                        size={'icon'}
                        variant={'ghost'}
                        className="h-8"
                        onMouseDown={(event) => {
                            event.preventDefault();
                            editorUtility.toggleAlignment(editor, type);
                        }}
                    >
                        {icon}
                    </Button>
                </TooltipTrigger>
                <TooltipContent className="space-x-1">
                    <span className="capitalize">{type}</span> align
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
}
