import React, { useEffect, useRef, useState } from 'react';
import Portal from '@/components/Portal';
import { useSlate } from 'slate-react';
import { Range, Editor } from 'slate';
import { Separator } from '@/components/ui/separator';
import MarksComp from '../Marks';
import ToggleLink from './ToogleLink';
import ToolBarColor from '../toolbar-color';
import ToolbarColorHighligth from '../toolbar-color-highlight';
import { Icons } from '@/components/icons';

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
        /*
        const blocktype = editorUtiliy.gettextBlockStyle(editor);
        if (blocktype) {
            setblocktype(blocktype);
        }
        */
        const domSelection = getSelection();
        const domRange = domSelection?.getRangeAt(0);
        const rect = domRange?.getBoundingClientRect();

        if (rect) {
            el.style.opacity = '1';
            el.style.top = `${
                rect.top + window.pageYOffset - el.offsetHeight
            }px`;
            el.style.left = `${
                rect.left +
                window.pageXOffset -
                el.offsetWidth / 2 +
                rect.width / 2
            }px`;
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
                    <ToolBarColor />
                    <Separator orientation="vertical" />
                    <ToolbarColorHighligth
                        format="highlight"
                        icon={<Icons.color />}
                        tooltipContent={'Highlight the text'}
                    />
                </div>
            </div>
        </Portal>
    );
};

export default FloatingToolbar;
