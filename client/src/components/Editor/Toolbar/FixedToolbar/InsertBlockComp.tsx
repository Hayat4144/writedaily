import React from 'react';
import { Tooltip, TooltipProvider } from '@/components/ui/tooltip';
import DrawerComponent from './DrawerComponent';

type Component = 'link' | 'image';

interface InsertBlockCompProps {
    componentType: Component;
}

export default function InsertBlockComp({
    componentType,
}: InsertBlockCompProps) {
    return (
        <TooltipProvider>
            <Tooltip>
                <DrawerComponent comp={componentType} />
            </Tooltip>
        </TooltipProvider>
    );
}
