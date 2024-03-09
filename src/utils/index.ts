import { isCuid } from '@paralleldrive/cuid2';

export function isValidCuidArray(value: any) {
    return Array.isArray(value) && value.every(isCuid);
}

export function isValidJSONArray(str: string) {
    try {
        const array = JSON.parse(str);
        return Array.isArray(array);
    } catch (error) {
        return false;
    }
}
