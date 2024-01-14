import React, { useEffect, useRef, useState } from 'react';
import { useSlate } from 'slate-react';
import { Range, Editor } from 'slate';
import { Separator } from '@/components/ui/separator';
import MarksComp from '../Marks';
import ToggleLink from './ToogleLink';
import ToolBarColor from '../toolbar-color';
import ToolbarColorHighligth from '../toolbar-color-highlight';
import dynamic from 'next/dynamic';
import TurnBlockDropDown from '../TurnBlockDropDown';

const Portal = dynamic(() => import('@/components/Portal'), { ssr: false });

const FloatingToolbar = () => {
    const toolbarRef = useRef<HTMLDivElement | null>(null);
    const editor = useSlate();
    const [blocktype, setblocktype] = useState('paragraph');
    const { selection } = editor;

    useEffect(() => {
        const el = toolbarRef.current;
        const { selection } = editor;
        if (!el) return;
        if (
            !selection ||
            Range.isCollapsed(selection) ||
            Editor.string(editor, selection) === ''
        ) {
            el.removeAttribute('style');
            return;
        }
        const domSelection = getSelection();
        const domRange = domSelection?.getRangeAt(0);
        const rect = domRange?.getBoundingClientRect();
        if (rect) {
            el.style.opacity = '1';
            el.style.top = `${rect.top + window.scrollY - el.offsetHeight}px`;
            let calPos = rect.left - el.offsetWidth / 2;
            if (!el.parentElement) return;

            const ParentContainer = el.parentElement.offsetWidth;
            if (calPos < 0) {
                const diff = ParentContainer + calPos;
                calPos = ParentContainer - diff;
            }
            if (calPos + el.offsetWidth > ParentContainer) {
                const diff = calPos + el.offsetWidth - ParentContainer;
                calPos = ParentContainer - diff - el.offsetWidth;
            }
            el.style.left = `${calPos}px`;
        }
    }, [blocktype, selection]);
    return (
        <Portal>
            <div
                onMouseDown={(e) => {
                    e.preventDefault();
                }}
                ref={toolbarRef}
                className="rounded-md z-50 -top[10000px] opacity-0 -mt-2
      -left[10000px] absolute dark:bg-secondary transition-shadow
      border py-0 object-fill overflow-hidden bg-background"
            >
                <div className="marks flex items-center h-8">
                    <MarksComp isSeperator={true} />
                    <Separator orientation="vertical" />
                    <ToggleLink />
                    <Separator orientation="vertical" />
                    <TurnBlockDropDown
                        blockType={blocktype}
                        isFloatingtoolbar
                    />
                    <Separator orientation="vertical" />
                    <ToolBarColor />
                    <Separator orientation="vertical" />
                    <ToolbarColorHighligth />
                </div>
            </div>
        </Portal>
    );
};

export default FloatingToolbar;
