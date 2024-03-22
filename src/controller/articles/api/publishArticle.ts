import { httpStatusCode } from '@customtype/index';
import asyncHandler from '@utils/asynHandler';
import { NextFunction, Request, Response } from 'express';
import busboy from 'busboy';
import { UploadApiResponse, v2 as cloudinary } from 'cloudinary';
import { isCuid } from '@paralleldrive/cuid2';
import { isValidCuidArray, isValidJSONArray } from '@utils/index';
import ArticleService from '@service/ArticleService';
import { CustomError } from '@utils/CustomError';
import { Article } from '@db/schema';
import { EventEmitter } from 'events';
import logger from '@utils/logger';

type CallbackFunc = () => Promise<void>;

const articleService = new ArticleService();

const publishArticle = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const validFields = [
            'articleId',
            'topicsId',
            'title',
            'description',
            'removedImage',
        ];
        const receivedFields: string[] = [];
        const fieldData = new Map();
        const allowedMimeTypes = [
            'image/jpeg',
            'image/png',
            'image/gif',
            'image/jpg',
        ];
        const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif'];
        const uploadedData: UploadApiResponse[] = [];
        const emitter = new EventEmitter();

        const bb = busboy({
            headers: req.headers,
            limits: {
                files: 1,
                fileSize: 1000000 * 2,
                fields: 6,
            },
        });

        const checkMissingFields = () => {
            const missingFields = validFields.filter(
                (field) => !receivedFields.includes(field),
            );
            if (missingFields.length > 0) {
                const fields = missingFields.join(',');
                return { missing: true, message: `Missing fields: ${fields}` };
            } else {
                return { missing: false, message: 'Fullfilled' };
            }
        };

        async function handleError(fn: CallbackFunc) {
            try {
                await fn();
            } catch (e) {
                req.unpipe(bb);
                next(e);
            }
        }

        bb.on('error', (error) => {
            logger.error(error);
            throw new CustomError(error as string, httpStatusCode.BAD_REQUEST);
        });

        bb.on('field', (fieldname, value) => {
            receivedFields.push(fieldname);
            handleError(async () => {
                switch (fieldname) {
                    case 'articleId':
                        if (!isCuid(value)) {
                            throw new CustomError(
                                'Article id must be a valid cuid.',
                                httpStatusCode.BAD_REQUEST,
                            );
                        }
                        fieldData.set(fieldname, value);
                        break;
                    case 'topicsId':
                        const topicsArray = JSON.parse(value);
                        const topicsIdArray = isValidJSONArray(value);
                        if (!topicsIdArray || !isValidCuidArray(topicsArray)) {
                            throw new CustomError(
                                'topicsId must be a valid array of cuid',
                                httpStatusCode.BAD_REQUEST,
                            );
                        }
                        fieldData.set(fieldname, topicsArray);
                        break;
                    case 'title':
                        if (!value.length)
                            throw new CustomError(
                                'Title cannot be empty',
                                httpStatusCode.BAD_REQUEST,
                            );
                        fieldData.set(fieldname, value);
                        break;
                    case 'description':
                        if (!value.length) {
                            throw new CustomError(
                                'Description cannot be empty',
                                httpStatusCode.BAD_REQUEST,
                            );
                        }
                        fieldData.set(fieldname, value);
                        break;
                    case 'removedImage':
                        const parsedValue = value === 'true';
                        fieldData.set(fieldname, parsedValue);
                        break;
                }
            });
        });

        const uploader = () => {
            return cloudinary.uploader.upload_stream((error, data) => {
                if (error) {
                    return res
                        .status(httpStatusCode.BAD_REQUEST)
                        .json({ error: error.message });
                } else if (data) {
                    uploadedData.push(data);
                }
            });
        };

        bb.on('file', (filename, file, info) => {
            handleError(async () => {
                fieldData.set('fileExist', true);
                if (!allowedMimeTypes.includes(info.mimeType)) {
                    throw new CustomError(
                        `file type does not supported.`,
                        httpStatusCode.BAD_REQUEST,
                    );
                }
                const checkField = checkMissingFields();
                if (checkField.missing) {
                    throw new CustomError(
                        checkField.message,
                        httpStatusCode.BAD_REQUEST,
                    );
                }
                if (!checkField.missing) {
                    file.pipe(uploader());
                } else {
                    file.resume();
                }
            });
        });

        bb.on('fieldsLimit', () => {
            logger.info('fieldsLimit');
        });

        bb.on('finish', () => {
            logger.info('finished');
            handleError(async () => {
                const missingFields = validFields.filter(
                    (field) => !receivedFields.includes(field),
                );
                if (missingFields.length > 0) {
                    const fields = missingFields.join(',');
                    throw new CustomError(
                        `Missing fields: ${fields}`,
                        httpStatusCode.BAD_REQUEST,
                    );
                }
                const articleId = fieldData.get('articleId');
                const isExist = await articleService.isArticleExist(articleId);
                if (!isExist) {
                    throw new CustomError(
                        `Article does not exist`,
                        httpStatusCode.BAD_REQUEST,
                    );
                }
                if (isExist.isPublished) {
                    throw new CustomError(
                        `${isExist.title} is already published.`,
                        httpStatusCode.BAD_REQUEST,
                    );
                }
                const isFileExist = fieldData.get('fileExist');
                if (isFileExist && isExist.publishedImage && isExist.publicId) {
                    emitter.emit('removedImage', isExist);
                    emitter.emit('updateDatabase', isExist);
                } else if (isFileExist) {
                    emitter.emit('updateDatabase', isExist);
                } else if (!isFileExist) {
                    emitter.emit('updateDatabase', isExist);
                }
            });
        });

        emitter.on('removedImage', (isExist) => {
            logger.info('removedImage');
            cloudinary.uploader.destroy(isExist.publicId);
        });

        emitter.on('updateDatabase', async (isExist) => {
            try {
                const updatedData: Partial<Article> = {
                    title: fieldData.get('title'),
                    description: fieldData.get('description'),
                    isPublished: true,
                };
                if (uploadedData.length > 0) {
                    updatedData['publicId'] = uploadedData[0].public_id;
                    updatedData['publishedImage'] = uploadedData[0].secure_url;
                }
                const topicsId = fieldData.get('topicsId');
                const published = await articleService.PublishArticle(
                    isExist,
                    topicsId,
                    req.user_id,
                    updatedData,
                );
                if (!published) {
                    return res.status(httpStatusCode.BAD_REQUEST).json({
                        error: 'Something went wrong. please try again.',
                    });
                }
                return res
                    .status(httpStatusCode.OK)
                    .json({ data: published.data.title });
            } catch (error) {
                logger.error(error);
                if (error instanceof CustomError) {
                    return res
                        .status(error.statusCode)
                        .json({ error: error.message });
                }
                return res
                    .status(httpStatusCode.INTERNAL_SERVER_ERROR)
                    .json({ error: (error as any).message });
            }
        });

        req.pipe(bb);
    },
);
export default publishArticle;
