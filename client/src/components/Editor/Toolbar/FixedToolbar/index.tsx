import React, { useState } from 'react';
import HistoryButton from './HistoryButton';
import MarksComp from '../Marks';
import { Separator } from '@/components/ui/separator';
import ToolBarColor from '../toolbar-color';
import ToolbarColorHighligth from '../toolbar-color-highlight';
import BlockButton from './BlockButton';
import { Redo, Undo } from 'lucide-react';
import AlignButton from './AlignButton';
import { Icons } from '@/components/icons';
import TurnBlockDropDown from '../TurnBlockDropDown';
import InsertBlockComp from './InsertBlockComp';

export default function FixedToolbar() {
    return (
        <div
            className="flex items-center space-x-1 flex-wrap px-2 
               bg-background top-0 py-1 border-b z-50 md:px-10"
        >
            <HistoryButton type="undo" icon={<Undo size={17} />} />
            <HistoryButton type="redo" icon={<Redo size={17} />} />
            <Separator orientation="vertical" className="h-5 font-semibold" />
            <MarksComp isRounded={true} />
            <Separator orientation="vertical" className="h-5 font-semibold" />
            <ToolBarColor isRounded />
            <ToolbarColorHighligth isRounded />
            <Separator orientation="vertical" className="h-5 font-semibold" />
            <BlockButton />
            <Separator orientation="vertical" className="h-5 font-semibold" />

            <AlignButton type="right" icon={<Icons.alignRight size={17} />} />
            <AlignButton type="left" icon={<Icons.alignLeft size={17} />} />
            <AlignButton type="center" icon={<Icons.alignCenter size={17} />} />
            <AlignButton
                type="justify"
                icon={<Icons.alignJustify size={17} />}
            />
            <Separator orientation="vertical" className="h-5 font-semibold" />
            <TurnBlockDropDown blockType="paragraph" />
            <Separator orientation="vertical" className="h-5 font-semibold" />
            <InsertBlockComp componentType="image" />
            <InsertBlockComp componentType="link" />
        </div>
    );
}
