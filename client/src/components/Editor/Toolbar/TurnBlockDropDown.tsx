import React, { Fragment, useEffect, useState } from 'react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    Tooltip,
    TooltipProvider,
    TooltipTrigger,
    TooltipContent,
} from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';
import { Icons } from '@/components/icons';
import Iconwithtext from '@/components/IconwithText';
import {
    Command,
    CommandGroup,
    CommandItem,
    CommandList,
} from '@/components/ui/command';
import { cn } from '@/lib/utils';
import editorUtility from '@/lib/editorUtility';
import { useSlate } from 'slate-react';
import {
    ELEMENT_BLOCKQUOTE,
    ELEMENT_CODE_BLOCK,
    ELEMENT_H1,
    ELEMENT_H2,
    ELEMENT_H3,
    ELEMENT_H4,
    ELEMENT_H5,
    ELEMENT_H6,
    ELEMENT_IMAGE,
    ELEMENT_OL,
    ELEMENT_TODO_LIST,
    ELEMENT_UL,
} from '@/lib/constant';

interface TurnIntoDropDownProps {
    blockType: string;
    isFloatingtoolbar?: boolean;
}

export interface BlockType {
    id: string;
    icon: React.ReactNode;
    type: string;
    lable: string;
    shortcut?: string;
}

const blockTypes: BlockType[] = [
    {
        id: '1',
        icon: <Icons.paragraph size={20} />,
        type: 'paragraph',
        lable: 'Paragraph',
    },
    {
        id: '2',
        icon: <Icons.h1 size={20} />,
        type: ELEMENT_H1,
        lable: 'Heading 1',
    },
    {
        id: '3',
        lable: 'Heading 2',
        icon: <Icons.h2 size={20} />,
        type: ELEMENT_H2,
    },
    {
        id: '4',
        lable: 'Heading 3',
        icon: <Icons.h3 size={20} />,
        type: ELEMENT_H3,
    },
    {
        id: '5',
        lable: 'Heading 4',
        icon: <Icons.h4 size={20} />,
        type: ELEMENT_H4,
    },
    {
        id: '6',
        lable: 'Heading 5',
        icon: <Icons.h5 size={20} />,
        type: ELEMENT_H5,
    },
    {
        id: '7',
        lable: 'Heading 6',
        icon: <Icons.h6 size={20} />,
        type: ELEMENT_H6,
    },
    {
        id: '8',
        lable: 'codeblock',
        icon: <Icons.code size={20} />,
        type: ELEMENT_CODE_BLOCK,
    },
    {
        id: '10',
        lable: 'Bulleted List',
        icon: <Icons.ul size={20} />,
        type: ELEMENT_UL,
    },
    {
        id: '11',
        lable: 'Number List',
        icon: <Icons.ol size={20} />,
        type: ELEMENT_OL,
    },
    {
        id: '12',
        lable: 'Quote',
        icon: <Icons.blockquote size={20} />,
        type: ELEMENT_BLOCKQUOTE,
    },
    {
        id: '13',
        lable: 'Image',
        icon: <Icons.image size={20} />,
        type: ELEMENT_IMAGE,
    },
    {
        id: '20',
        lable: ELEMENT_TODO_LIST,
        icon: <Icons.todo size={20} />,
        type: 'checkList',
    },
];

export default function TurnBlockDropDown({
    blockType,
    isFloatingtoolbar,
}: TurnIntoDropDownProps) {
    const [open, setOpen] = React.useState(false);
    const [selectedBlock, setselectedBlock] = useState('paragraph');
    const editor = useSlate();

    useEffect(() => {
        const { selection } = editor;
        if (!selection) return;
        const block = editorUtility.getActiveBlock(editor);
        if (!block) return;
        setselectedBlock(block?.type);
    }, [editor.selection]);
    return (
        <Fragment>
            <TooltipProvider>
                {' '}
                <Tooltip>
                    <DropdownMenu open={open} onOpenChange={setOpen}>
                        <DropdownMenuTrigger
                            onClick={(e) => e.preventDefault()}
                            className="mr-2 hover:dark:bg-[#3b3b40 hover:bg-accent"
                            asChild
                        >
                            <TooltipTrigger asChild>
                                <Button
                                    variant={'ghost'}
                                    size={'sm'}
                                    className={`${
                                        isFloatingtoolbar
                                            ? 'hover:dark:bg-[#3b3b40] rounded-none mx-0 space-x-1'
                                            : 'rounded-md space-x-2'
                                    }`}
                                >
                                    <span>
                                        {selectedBlock.charAt(0).toUpperCase() +
                                            selectedBlock.slice(1)}
                                    </span>
                                    {open ? (
                                        <Icons.chevronsUpDown
                                            size={16}
                                            className="translate-y-1 h-4 w-4"
                                        />
                                    ) : (
                                        <Icons.arrowDown
                                            size={16}
                                            className="translate-y-1 h-4 w-4"
                                        />
                                    )}
                                </Button>
                            </TooltipTrigger>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-[13em]" align="start">
                            <Command>
                                <CommandList>
                                    <CommandGroup>
                                        {blockTypes.map((block) => (
                                            <CommandItem
                                                key={block.id}
                                                value={block.type}
                                                onMouseDown={() => {
                                                    editorUtility.toggleBlock(
                                                        editor,
                                                        block.type,
                                                    );
                                                    setOpen(false);
                                                }}
                                            >
                                                {blockType === block.type ? (
                                                    <Iconwithtext
                                                        icons={block.icon}
                                                        className="space-x-3"
                                                        text={block.lable}
                                                    />
                                                ) : null}
                                                {blockType !== block.type ? (
                                                    <Iconwithtext
                                                        icons={block.icon}
                                                        className="space-x-3"
                                                        text={block.lable}
                                                    />
                                                ) : null}
                                                <Icons.check
                                                    className={cn(
                                                        'ml-auto h-4 w-4',
                                                        selectedBlock ===
                                                            block.lable
                                                            ? 'opacity-100'
                                                            : 'opacity-0',
                                                    )}
                                                />
                                            </CommandItem>
                                        ))}
                                    </CommandGroup>
                                </CommandList>
                            </Command>
                        </DropdownMenuContent>
                    </DropdownMenu>
                    <TooltipContent>Turn into</TooltipContent>
                </Tooltip>
            </TooltipProvider>
        </Fragment>
    );
}
