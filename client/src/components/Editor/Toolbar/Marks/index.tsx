import { Icons } from '@/components/icons';
import { Marks } from '@/types';
import React from 'react';
import MarkButtons from './MarksButton';
import { Separator } from '@/components/ui/separator';

const marks: Marks[] = [
    {
        id: '1',
        icon: <Icons.bold size={17} />,
        mark: 'bold',
        shortcut: '(Ctrl+B)',
    },
    {
        id: '2',
        icon: <Icons.italic size={17} />,
        mark: 'italic',
        shortcut: '(Ctrl+I)',
    },
    {
        id: '3',
        icon: <Icons.underline size={17} />,
        mark: 'underline',
        shortcut: '(Ctrl+U)',
    },
    {
        id: '4',
        icon: <Icons.superscript size={17} />,
        mark: 'superscript',
        shortcut: '(Ctrl+Shift+P)',
    },
    {
        id: '5',
        icon: <Icons.subscript size={17} />,
        mark: 'subscript',
        shortcut: '(Ctrl+Shift+B)',
    },
    {
        id: '6',
        icon: <Icons.strikethrough size={17} />,
        mark: 'strike',
        shortcut: '(Ctrl+Shift+X)',
    },
];

interface MarksProps {
    isSeperator?: boolean;
}

const MarksComp = ({ isSeperator }: MarksProps) => {
    return (
        <React.Fragment>
            {marks.map((mark) => (
                <React.Fragment key={mark.id}>
                    <MarkButtons item={mark} />
                    {isSeperator && Number(mark.id) !== marks.length ? (
                        <Separator orientation="vertical" />
                    ) : null}
                </React.Fragment>
            ))}
        </React.Fragment>
    );
};

export default MarksComp;
