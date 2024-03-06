import { httpStatusCode } from '@customtype/index';
import asyncHandler from '@utils/asynHandler';
import { Request, Response } from 'express';
import busboy from 'busboy';
import { v2 as cloudinary } from 'cloudinary';
import { UploadApiResponse } from 'cloudinary';
import { isCuid } from '@paralleldrive/cuid2';

const uploadPromise = async (
    bb: busboy.Busboy,
): Promise<UploadApiResponse[]> => {
    return new Promise((resolve, reject) => {
        const uploads: UploadApiResponse[] = [];

        const uploader = () => {
            return cloudinary.uploader.upload_stream((error, data) => {
                if (error) reject(error);
                else if (data) {
                    uploads.push(data);
                    resolve(uploads);
                }
            });
        };

        bb.on('file', (name, file, info) => {
            if (name === 'articleImage') file.pipe(uploader());
            else reject({ error: 'Invalid file field' });
        });

        bb.on('error', (error) => {
            reject({ error });
        });
    });
};

function isValidCuidArray(value: any) {
    return Array.isArray(value) && value.every(isCuid);
}

function isValidJSONArray(str: string) {
    try {
        const array = JSON.parse(str);
        return Array.isArray(array);
    } catch (error) {
        return false;
    }
}

const publishArticle = asyncHandler(async (req: Request, res: Response) => {
    const bb = busboy({
        headers: req.headers,
    });

    let articleId;
    let topicsId;
    let title;
    let description;
    let isValidRequest = false;
    const validFields = ['articleId', 'topicsId', 'title', 'description'];
    const receivedFields: string[] = [];

    bb.on('field', (fieldname, val) => {
        console.log('fieldname', fieldname);
        receivedFields.push(fieldname);

        switch (fieldname) {
            case 'articleId':
                if (!isCuid(val)) {
                    return res.status(httpStatusCode.BAD_REQUEST).send({
                        error: 'articleId must be a valid cuid',
                    });
                }
                articleId = val;
                break;
            case 'topicsId':
                const topicsIdArray = isValidJSONArray(val);
                if (!topicsIdArray || !isValidCuidArray(JSON.parse(val))) {
                    return res.status(httpStatusCode.BAD_REQUEST).json({
                        error: 'topicsId must be a valid array of cuid',
                    });
                }
                topicsId = topicsIdArray;
                break;
            case 'title':
                if (val.length < 1) {
                    return res.status(httpStatusCode.BAD_REQUEST).json({
                        error: 'Title cannot be empty',
                    });
                }
                title = val;
                break;
            case 'description':
                if (val.length < 1) {
                    return res.status(httpStatusCode.BAD_REQUEST).json({
                        error: 'Description cannot be empty',
                    });
                }
                description = val;
                break;
            default:
                break;
        }
    });

    bb.on('finish', () => {
        console.log('finished');
        const missingFields = validFields.filter(
            (field) => !receivedFields.includes(field),
        );

        if (missingFields.length > 0) {
            return res.status(httpStatusCode.BAD_REQUEST).send({
                error: `Missing fields: ${missingFields.join(', ')}`,
            });
        }

        // Continue processing or respond to the client
    });
    // const uploaded = await uploadPromise();
    // const uploadedData = uploaded.map((upload) => ({
    //     url: upload.secure_url,
    //     publicId: upload.public_id,
    // }));
    //
    // return res.status(httpStatusCode.OK).json({
    //     data: `${uploadedData[0].url} has been published successfully.`,
    //});
    //
    bb.on('file', (name, file) => {
        console.log(name, receivedFields);
    });

    req.pipe(bb);
});

export default publishArticle;
