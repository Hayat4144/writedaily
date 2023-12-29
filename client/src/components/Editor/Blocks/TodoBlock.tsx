import { Checkbox } from '@/components/ui/checkbox';
import React, { Fragment } from 'react';
import {
    ReactEditor,
    RenderElementProps,
    useReadOnly,
    useSlateStatic,
} from 'slate-react';
import { Transforms, Element } from 'slate';
import { CheckedState } from '@radix-ui/react-checkbox';

const TodoBlockElement = ({
    element,
    children,
    attributes,
}: RenderElementProps) => {
    const editor = useSlateStatic();
    const readOnly = useReadOnly();

    const TodoListToggle = (value: CheckedState) => {
        const path = ReactEditor.findPath(editor, element);
        const newProperties: Partial<Element> = {
            checked: value as boolean,
        };
        Transforms.setNodes(editor, newProperties, { at: path });
    };
    return (
        <Fragment>
            <div
                className="flex items-center space-x-2"
                {...attributes}
                {...element}
            >
                {element.type === 'todo_list' ? (
                    <Checkbox
                        contentEditable={false}
                        checked={element.checked}
                        onCheckedChange={TodoListToggle}
                    />
                ) : null}
                <label
                    contentEditable={!readOnly}
                    suppressContentEditableWarning
                    className={`${
                        (element as any).checked ? 'line-through' : ''
                    } font-medium leading-nonepeer-disabled:cursor-not-allowed peer-disabled:opacity-70`}
                >
                    {children}
                </label>
            </div>
        </Fragment>
    );
};

export default TodoBlockElement;
