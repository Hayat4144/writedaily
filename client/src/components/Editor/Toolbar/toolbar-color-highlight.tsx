import React from 'react';
import { Button } from '@/components/ui/button';
import editorUtiliy from '@/lib/editorUtility';
import { useSlate } from 'slate-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    TooltipProvider,
    TooltipTrigger,
    Tooltip,
    TooltipContent,
} from '@/components/ui/tooltip';
import Iconwithtext from '@/components/IconwithText';
import { ScrollArea } from '@/components/ui/scroll-area';
import editorUtility from '@/lib/editorUtility';
import { Icons } from '@/components/icons';

export interface ColorsBackground {
    id: string;
    icon: React.ReactNode;
    value: string;
}

export const colorArray: ColorsBackground[] = [
    {
        id: '1',
        icon: <Icons.color size={20} color="red" />,
        value: 'red',
    },
    {
        id: '2',
        icon: <Icons.color size={20} color="yellow" />,
        value: 'yellow',
    },
    {
        id: '3',
        icon: <Icons.color size={20} color="indigo" />,
        value: 'Indigo',
    },
    {
        id: '4',
        icon: <Icons.color size={20} color="orange" />,
        value: 'orange',
    },
    {
        id: '5',
        icon: <Icons.color size={20} color="gray" />,
        value: 'gray',
    },
    {
        id: '6',
        icon: <Icons.color size={20} color="purple" />,
        value: 'purple',
    },
    {
        id: '7',
        icon: <Icons.color size={20} color="green" />,
        value: 'green',
    },
    {
        id: '8',
        icon: <Icons.color size={20} color="brown" />,
        value: 'brown',
    },
    {
        id: '9',
        icon: <Icons.color size={20} color="pink" />,
        value: 'pink',
    },
    {
        id: '10',
        icon: <Icons.color size={20} color="blue" />,
        value: 'blue',
    },
];

interface TextColorHighlightProps {
    format: string;
    icon: React.ReactNode;
    tooltipContent: string;
}

export default function ToolbarColorHighligth({
    format,
    icon,
    tooltipContent,
}: TextColorHighlightProps) {
    const editor = useSlate();
    const [open, setOpen] = React.useState(false);

    const isMarkActive = () => editorUtility.getActiveMark(editor).has(format);
    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger>
                    <DropdownMenu open={open} onOpenChange={setOpen}>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant={isMarkActive() ? 'secondary' : 'ghost'}
                                size={'icon'}
                                className="h-8"
                            >
                                {icon}
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-52">
                            <ScrollArea className="h-72">
                                <DropdownMenuLabel className="capitalize">
                                    {format}
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                    className="capitalize"
                                    onMouseDown={(e) => {
                                        setOpen(false);
                                        editorUtiliy.toggleMark(
                                            editor,
                                            format,
                                            false,
                                        );
                                    }}
                                >
                                    Remove {format}
                                </DropdownMenuItem>
                                {colorArray.map((item) => (
                                    <DropdownMenuItem
                                        key={item.id}
                                        onMouseDown={() => {
                                            setOpen(false);
                                            editorUtiliy.toggleMark(
                                                editor,
                                                format,
                                                item.value,
                                            );
                                        }}
                                    >
                                        <Iconwithtext
                                            icons={item.icon}
                                            className="space-x-3 capitalize"
                                            text={item.value}
                                        />
                                    </DropdownMenuItem>
                                ))}
                            </ScrollArea>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </TooltipTrigger>
                <TooltipContent className="capitalize">
                    {tooltipContent}
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
}
