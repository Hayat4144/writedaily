import { RenderLeafProps } from 'slate-react';

const renderLeafs = (props: RenderLeafProps) => {
    let { leaf, children, attributes } = props;
    if ('bold' in leaf && leaf.bold) {
        children = <strong>{children}</strong>;
    }
    if ('italic' in leaf && leaf.italic) {
        children = <i>{children}</i>;
    }
    if ('underline' in leaf && leaf.underline) {
        children = <u>{children}</u>;
    }

    if ('superscript' in leaf && leaf.superscript) {
        children = <sup>{children}</sup>;
    }
    if ('subscript' in leaf && leaf.subscript) {
        children = <sub>{children}</sub>;
    }

    if ('highlight' in leaf && leaf.highlight) {
        children = (
            <span style={{ backgroundColor: leaf.highlight as any }}>
                {children}
            </span>
        );
    }
    if ('fontSize' in leaf && leaf.fontSize) {
        children = (
            <span style={{ fontSize: leaf.fontSize as any }}>{children}</span>
        );
    }
    if ('color' in leaf && leaf.color) {
        children = <span style={{ color: leaf.color as any }}>{children}</span>;
    }

    if ('fontFamily' in leaf && leaf.fontFamily) {
        children = (
            <span style={{ fontFamily: leaf.fontFamily as any }}>
                {children}
            </span>
        );
    }

    if ('fontWieght' in leaf && leaf.fontWieght) {
        children = (
            <span style={{ fontWeight: leaf.fontWieght as any }}>
                {children}
            </span>
        );
    }
    if ('strike' in leaf && leaf.strike) {
        children = <s>{children}</s>;
    }
    return (
        <span
            className={`${leaf.text === '' ? 'pr-[0.001em]' : null}`}
            {...attributes}
        >
            {children}
        </span>
    );
};

export default renderLeafs;
