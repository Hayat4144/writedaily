import React from 'react';
import HistoryButton from './HistoryButton';
import MarksComp from '../Marks';
import { Separator } from '@/components/ui/separator';
import ToolBarColor from '../toolbar-color';
import ToolbarColorHighligth from '../toolbar-color-highlight';
import BlockButton from './BlockButton';
import { Redo, Undo } from 'lucide-react';

export default function FixedToolbar() {
    return (
        <div
            className="flex items-center space-x-1 flex-wrap px-2 
               bg-background top-0 py-1 border-b z-50 my-5"
        >
            <HistoryButton type="undo" icon={<Undo size={17} />} />
            <HistoryButton type="redo" icon={<Redo size={17} />} />
            <Separator orientation="vertical" className="h-5 font-semibold" />
            <MarksComp isRounded={true} />
            <Separator orientation="vertical" className="h-5 font-semibold" />
            <ToolBarColor />
            <ToolbarColorHighligth />
            <Separator orientation="vertical" className="h-5 font-semibold" />
            <BlockButton />
        </div>
    );
}
