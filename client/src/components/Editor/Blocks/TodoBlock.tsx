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
import { Label } from '@/components/ui/label';

interface TodoBlockElementProps extends RenderElementProps {
    style?: React.CSSProperties;
}

const TodoBlockElement = ({
    element,
    children,
    attributes,
    style,
}: TodoBlockElementProps) => {
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
                className="flex item-center space-x-3"
                style={style}
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
                <Label
                    contentEditable={!readOnly}
                    suppressContentEditableWarning
                    style={style}
                    className={`${
                        (element as any).checked ? 'line-through' : ''
                    } font-medium leading-nonepeer-disabled:cursor-not-allowed peer-disabled:opacity-70`}
                >
                    {children}
                </Label>
            </div>
        </Fragment>
    );
};

export default TodoBlockElement;
