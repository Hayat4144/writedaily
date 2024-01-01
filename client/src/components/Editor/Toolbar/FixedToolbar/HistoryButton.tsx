import React from 'react';
import { Button } from '@/components/ui/button';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import { useSlate } from 'slate-react';

interface HistoryButtonProps {
    icon: React.ReactNode;
    type: 'undo' | 'redo';
}

export default function HistoryButton({ icon, type }: HistoryButtonProps) {
    const editor = useSlate();
    const historyHanlder = () =>
        type === 'undo' ? editor.undo() : editor.redo();
    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <Button
                        size={'icon'}
                        variant={'ghost'}
                        className="h-8"
                        onClick={historyHanlder}
                    >
                        {icon}
                    </Button>
                </TooltipTrigger>
                <TooltipContent className="capitalize">
                    {type}
                    {type === 'undo' ? (
                        <span>(Ctrl+Z)</span>
                    ) : (
                        <span>(Ctrl+Y)</span>
                    )}
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
}
