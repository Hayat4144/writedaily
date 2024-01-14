import React, { useEffect, useRef, useState } from 'react';
import Portal from '../Portal';
import { useSlate } from 'slate-react';
import { BaseSelection } from 'slate';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuSeparator,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Icons } from '@/components/icons';
import editorUtiliy from '@/lib/editorUtility';
import Iconwithtext from '@/components/IconwithText';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
    ELEMENT_BLOCKQUOTE,
    ELEMENT_CODE_BLOCK,
    ELEMENT_H1,
    ELEMENT_H2,
    ELEMENT_H3,
    ELEMENT_H4,
    ELEMENT_H5,
    ELEMENT_H6,
    ELEMENT_OL,
    ELEMENT_TODO_LIST,
    ELEMENT_UL,
} from '@/lib/constant';

interface CommandMenuProps {
    isCommandMenu: boolean;
    CommandMenuToggle: (value: boolean) => void;
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
        lable: 'Bullet List',
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
    ,
    {
        id: '20',
        lable: ELEMENT_TODO_LIST,
        icon: <Icons.todo size={20} />,
        type: 'checkList',
    },
];

export default function CommandMenu({
    isCommandMenu,
    CommandMenuToggle,
}: CommandMenuProps) {
    const CommandMenuRef = useRef<HTMLDivElement | null>(null);
    const [originalSelection, setOriginalSelection] =
        useState<BaseSelection | null>(null);
    const editor = useSlate();
    useEffect(() => {
        const { selection } = editor;
        const el = CommandMenuRef.current;
        if (!el || !selection || !isCommandMenu) {
            el?.removeAttribute('style');
            return;
        }
        const domSelection = getSelection();
        const domRange = domSelection?.getRangeAt(0);
        const rect = domRange?.getBoundingClientRect();
        if (rect) {
            el.style.opacity = '1';
            const loc = rect.bottom + window.scrollY;
            if (loc > 500) {
                el.style.top = `${
                    rect.bottom + window.scrollY - el.offsetHeight - 40
                }px`;
            } else {
                el.style.top = `${
                    rect.top + window.scrollY - el.offsetHeight
                }px`;
            }
            el.style.left = `${rect.left}px`;
        }
    }, [editor, isCommandMenu]);

    useEffect(() => {
        if (isCommandMenu) {
            setOriginalSelection(editor.selection);
            const x = window.scrollX;
            const y = window.scrollY;
            window.scrollTo(x, y);
        }
    }, [editor, isCommandMenu]);

    return (
        <Portal>
            <div
                ref={CommandMenuRef}
                className="absolute opacity-0 -left-[10000px] -top-[10000px]"
            >
                <DropdownMenu
                    open={isCommandMenu}
                    onOpenChange={CommandMenuToggle}
                >
                    <DropdownMenuTrigger></DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="w-[20rem]">
                        <ScrollArea className="h-56">
                            <h3 className="text-muted-foreground px-2 py-1">
                                Basic blocks
                            </h3>
                            <DropdownMenuSeparator />
                            {blockTypes.map((block) => (
                                <DropdownMenuItem
                                    key={block.id}
                                    onMouseDown={() => {
                                        editorUtiliy.toggleBlock(
                                            editor,
                                            block.type,
                                        );
                                        editorUtiliy.emptyNode(editor);
                                    }}
                                >
                                    <Iconwithtext
                                        icons={block.icon}
                                        className="space-x-3"
                                        text={block.lable}
                                    />
                                </DropdownMenuItem>
                            ))}
                        </ScrollArea>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </Portal>
    );
}
