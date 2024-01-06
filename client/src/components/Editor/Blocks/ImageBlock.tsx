import React, { ChangeEvent, useRef, useState } from 'react';
import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
} from '@/components/ui/resizable';
import {
    ReactEditor,
    RenderElementProps,
    useFocused,
    useSelected,
    useSlateStatic,
} from 'slate-react';
import Image from 'next/image';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { ImperativePanelHandle } from 'react-resizable-panels';
import { Button } from '@/components/ui/button';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import { Icons } from '@/components/icons';
import editorUtility from '@/lib/editorUtility';
import { Transforms } from 'slate';
import { MyImageELement } from '@/types';
import { Input } from '@/components/ui/input';

type DragSide = 'left' | 'right';

interface Draging {
    isDraging: boolean;
    side: DragSide;
}

export default function ImageBlock({
    attributes,
    children,
    element,
}: RenderElementProps) {
    const selected = useSelected();
    const focused = useFocused();
    const editor = useSlateStatic();
    const path = ReactEditor.findPath(editor, element);
    const [dragSide, setDragSide] = useState<Draging>();
    const [captiontext, setCaptiontext] = useState(
        element.type === 'image' ? element.caption : '',
    );

    const leftPanelRef = useRef<ImperativePanelHandle>(null);
    const middlePanelRef = useRef<ImperativePanelHandle>(null);
    const rightPanelRef = useRef<ImperativePanelHandle>(null);

    const onLayout = (newSize: number[]) => {
        if (dragSide?.isDraging && dragSide.side === 'left') {
            rightPanelRef.current?.resize(newSize[0]);
        } else if (dragSide?.isDraging && dragSide.side === 'right') {
            leftPanelRef.current?.resize(newSize[2]);
        }
    };

    const CaptionChangeEvent = (e: ChangeEvent<HTMLInputElement>) => {
        const ImageElement: Partial<MyImageELement> = {
            caption: e.target.value,
        };
        Transforms.setNodes(editor, ImageElement);
        setCaptiontext(e.target.value);
    };

    return (
        <div {...attributes} contentEditable={false}>
            <ResizablePanelGroup
                direction="horizontal"
                className="max-h-[500px]"
                onLayout={onLayout}
            >
                <ResizablePanel
                    defaultSize={20}
                    id="left"
                    order={1}
                    minSize={5}
                    maxSize={40}
                    ref={leftPanelRef}
                />
                <ResizableHandle
                    withHandle
                    className="border-none bg-none"
                    onDragging={(value) =>
                        setDragSide((prevState) => ({
                            ...prevState,
                            side: 'left',
                            isDraging: value,
                        }))
                    }
                />
                <ResizablePanel
                    id="middle"
                    order={2}
                    defaultSize={60}
                    minSize={20}
                    ref={middlePanelRef}
                >
                    <div
                        className={`${
                            selected && focused ? 'border-2 rounded-md' : ''
                        } mx-2 px-1 py-1`}
                    >
                        <AspectRatio
                            ratio={10 / 4}
                            className={'flex h-full item-center justify-center'}
                        >
                            {element.type == 'image' ? (
                                <React.Fragment>
                                    <Image
                                        src={element.url}
                                        fill
                                        alt="image"
                                        className="rounded-md"
                                    />

                                    {selected && focused && (
                                        <TooltipProvider>
                                            <Tooltip>
                                                <TooltipTrigger
                                                    onMouseDown={(e) =>
                                                        e.preventDefault()
                                                    }
                                                    asChild
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        editorUtility.removeBlock(
                                                            editor,
                                                            path,
                                                        );
                                                    }}
                                                >
                                                    <Button
                                                        size={'icon'}
                                                        className="absolute top-2 left-3  hover:text-red-900"
                                                    >
                                                        <Icons.trash
                                                            size={17}
                                                        />
                                                    </Button>
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    <p>Delete image</p>
                                                </TooltipContent>
                                            </Tooltip>
                                        </TooltipProvider>
                                    )}
                                </React.Fragment>
                            ) : null}
                        </AspectRatio>
                    </div>
                    {selected && element.type === 'image' ? (
                        <div className="text-center my-2">
                            <input
                                value={captiontext}
                                placeholder="write your caption"
                                type="text"
                                onChange={CaptionChangeEvent}
                                autoFocus
                                className="border-none outline-none px-1"
                            />
                        </div>
                    ) : null}
                </ResizablePanel>
                <ResizableHandle
                    withHandle
                    onDragging={(value) =>
                        setDragSide((prevState) => ({
                            ...prevState,
                            side: 'right',
                            isDraging: value,
                        }))
                    }
                />
                <ResizablePanel
                    id="right"
                    order={3}
                    defaultSize={20}
                    minSize={5}
                    maxSize={40}
                    ref={rightPanelRef}
                />
            </ResizablePanelGroup>
            {children}
        </div>
    );
}
