import { RenderElementProps } from 'slate-react';

const LinkBlock = ({ element, children, attributes }: RenderElementProps) => {
    return (
        <a
            {...attributes}
            href={element.type === 'link' ? element.url : '#'}
            className="underline cursor-pointer"
        >
            {children}
        </a>
    );
};

export default LinkBlock;
