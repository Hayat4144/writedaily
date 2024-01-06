import { Ancestor, Editor, Node, NodeEntry, Path } from 'slate';
import { AlignType, MyCustomElement } from '.';

export interface editorUtility {
    LIST_TYPES: string[];
    TEXT_ALIGN_TYPES: string[];
    removeBlock(editor: Editor, path: Path): void;
    getActiveBlock(editor: Editor): null | MyCustomElement;
    isAlignmentActive(editor: Editor, type: AlignType): boolean;
    toggleAlignment(editor: Editor, type: AlignType): void;
    toggleBlock(editor: Editor, block: string): void;
    getActiveMark(editor: Editor): Set<string>;
    toggleMark(editor: Editor, format: string, value: string | boolean): void;
    HOT_KEYS: { [key: string]: string };
    onkeydown(event: React.KeyboardEvent, editor: Editor): void;
    isBlockActive(editor: Editor, format: string, blockType: string): boolean;
    getBlock(editor: Editor, block: string): NodeEntry;
    isBlockActive(editor: Editor, block: string): boolean;
    updateLink(editor: Editor, url: string): void;
    unwrapNodes(editor: Editor, node: string): void;
}
