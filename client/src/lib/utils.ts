import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import data from '@emoji-mart/data';
import { init, SearchIndex } from 'emoji-mart';

init({ data });

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export const findEmojis = async (search: string) => {
    const emojis = await SearchIndex.search(search);
    return emojis.map((item: any) => {
        return { id: item.id, native: item.skins[0].native };
    });
};

export const getFirstLetter = (str: string) => {
    const words = str.split(' ');

    const firstLetter = words.map((word) => word[0]);

    const combinedLetter = firstLetter.join('');
    return combinedLetter;
};
