import { check } from 'express-validator';
import { isCuid } from '@paralleldrive/cuid2';

const validateCuid = (fieldName: string) => {
    return check(fieldName)
        .notEmpty()
        .withMessage(`${fieldName} cannot be empty.`)
        .custom((value) => {
            if (!isCuid(value)) {
                throw new Error(`${fieldName} is not a valid cuid.`);
            }
            return true;
        });
};

export default validateCuid;
