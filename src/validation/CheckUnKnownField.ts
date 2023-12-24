import { check } from 'express-validator';

const checkUnknownField = (expectedFields: string[]) => {
    return check().custom((value, { req }) => {
        const unexpectedFields = Object.keys(
            req.body || req.params || req.query,
        ).filter((field) => !expectedFields.includes(field));

        if (unexpectedFields.length > 0) {
            throw new Error(
                `Unexpected fields: ${unexpectedFields.join(', ')}`,
            );
        }

        return true;
    });
};

export default checkUnknownField;
