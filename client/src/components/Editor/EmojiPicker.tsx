import dynamic from 'next/dynamic';

import React, { Fragment, useEffect, useRef, useState } from 'react';
import { ReactEditor, useSlate } from 'slate-react';
import { Range } from 'slate';
import { Heading1 } from '../ui/typography';
import { Button } from '../ui/button';
import { findEmojis } from '@/lib/utils';
import editorUtility from '@/lib/editorUtility';

const Portal = dynamic(() => import('@/components/Portal'), { ssr: false });

interface EmojiPickerProps {
    searchString: string;
    emojiRange: Range | undefined;
    changeEmojiRange: (value: Range | undefined) => void;
}
export default function EmojiPicker({
    emojiRange,
    changeEmojiRange,
    searchString,
}: EmojiPickerProps) {
    const emojiRef = useRef<HTMLDivElement | null>(null);
    const [emojis, setemojis] = useState([]);
    const editor = useSlate();

    useEffect(() => {
        const el = emojiRef.current;
        const { selection } = editor;
        if (!el || !selection || !Range.isCollapsed(selection)) return;

        const domRange = ReactEditor.toDOMRange(editor, selection);
        const rect = domRange.getBoundingClientRect();
        const CARET_TOP_OFFSET = 15;
        el.style.opacity = '1';
        el.style.top = `${
            rect.top + rect.height + window.pageYOffset + CARET_TOP_OFFSET
        }px`;
        let calPos = rect.left - el.offsetWidth / 2;

        // calculate the endpoint of the modal
        const rightEndPos = calPos + el.offsetWidth;
        if (!el.parentElement) return;
        const containerWidth = el.parentElement.offsetWidth;

        // When the modal goes off the page from right side
        if (rightEndPos > containerWidth) {
            let diff = rightEndPos - containerWidth;
            // extra space of 10px on right side to look clean
            diff += 10;
            calPos -= diff;
        }

        el.style.left = `${calPos}px`;
    });

    useEffect(() => {
        const fetchEmojis = async (search: string) => {
            const getEmojis = await findEmojis(search);
            setemojis(getEmojis);
        };
        fetchEmojis(searchString);
    }, [searchString]);

    return (
        <Portal>
            <div
                ref={emojiRef}
                className="absolute z-50 opacity-0 bg-background border shadow-md rounded-md px-2 
        max-h-72 overflow-y-auto w-80 py-2 -left-[10000px] -top-[10000px]"
            >
                {emojis.length < 1 ? (
                    <Fragment>
                        <Heading1 className="text-center">
                            No emojis has found
                        </Heading1>
                    </Fragment>
                ) : (
                    emojis.map((item: any) => (
                        <Button
                            key={item.id}
                            size={'icon'}
                            onMouseDown={(e) => e.preventDefault()}
                            variant={'ghost'}
                            onClick={() => {
                                editorUtility.insertEmoji(
                                    editor,
                                    emojiRange,
                                    item.native,
                                );
                                changeEmojiRange(undefined);
                            }}
                        >
                            {item.native}
                        </Button>
                    ))
                )}
            </div>
        </Portal>
    );
}
