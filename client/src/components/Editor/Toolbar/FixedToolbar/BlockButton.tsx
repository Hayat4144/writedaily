import React, { Fragment } from 'react';
import { Button } from '@/components/ui/button';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import { useSlate } from 'slate-react';
import editorUtility from '@/lib/editorUtility';
import { ELEMENT_UL, ELEMENT_OL, ELEMENT_TODO_LIST } from '@/lib/constant';
import { Icons } from '@/components/icons';

interface BlockButtonProps {
    format: string;
    icons: React.ReactNode;
    tooltipContent: string;
}

interface BlocksType {
    id: string;
    type: typeof ELEMENT_UL | typeof ELEMENT_OL | typeof ELEMENT_TODO_LIST;
    icons: React.ReactNode;
    tooltipContent: string;
}

const Blocks: BlocksType[] = [
    {
        id: '1',
        type: 'bulleted_list',
        icons: <Icons.ul size={18} />,
        tooltipContent: 'convert into bulleted list',
    },
    {
        id: '2',
        type: 'number_list',
        icons: <Icons.ol size={17} />,
        tooltipContent: 'convert into number list',
    },
    {
        id: '3',
        icons: <Icons.todo size={17} />,
        tooltipContent: 'convert into todo list',
        type: 'todo_list',
    },
];

export default function BlockButtons() {
    return (
        <Fragment>
            {Blocks.map((item) => (
                <BlockItem
                    format={item.type}
                    icons={item.icons}
                    tooltipContent={item.tooltipContent}
                    key={item.id}
                />
            ))}
        </Fragment>
    );
}

function BlockItem({ format, icons, tooltipContent }: BlockButtonProps) {
    const editor = useSlate();
    const toggleBlock = () => {
        editorUtility.toggleBlock(editor, format);
    };
    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <Button
                        size={'icon'}
                        variant={'ghost'}
                        className="h-8"
                        disabled={editor.selection ? false : true}
                        onClick={toggleBlock}
                    >
                        {icons}
                    </Button>
                </TooltipTrigger>
                <TooltipContent className="space-x-1">
                    <span className="capitalize">{tooltipContent}</span>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
}
