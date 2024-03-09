import { httpStatusCode } from '@customtype/index';
import asyncHandler from '@utils/asynHandler';
import { NextFunction, Request, Response } from 'express';
import busboy from 'busboy';
import { UploadApiResponse, v2 as cloudinary } from 'cloudinary'
import { isCuid } from '@paralleldrive/cuid2';
import { isValidCuidArray, isValidJSONArray } from '@utils/index';
import ArticleService from '@service/ArticleService';
import { CustomError } from '@utils/CustomError';
import { Article } from '@db/schema';

const articleService = new ArticleService();

const publishArticle = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const validFields = ['articleId', 'topicsId', 'title', 'description'];
    const receivedFields: string[] = [];
    const fieldData = new Map()

    const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/jpg'];
    const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif'];

    const uploadedData: UploadApiResponse[] = []

    const bb = busboy({
        headers: req.headers,
        limits: {
            files: 1,
            fileSize: 1000000 * 2,
            fields: 5,
        },
    });

    const uploader = () => {
        try {
            return cloudinary.uploader.upload_stream(async (error, data) => {
                try {
                    if (error) return res.status(httpStatusCode.BAD_REQUEST).json({ error: error.message })
                    else if (data) {
                        uploadedData.push(data)
                        const updatedData: Partial<Article> = {
                            title: fieldData.get('title'),
                            description: fieldData.get('description'),
                            isPublished: true,
                        }
                        const published = await articleService.PublishArticle(fieldData.get('articleId'), fieldData.get('topicsId'), req.user_id, updatedData)

                        if (!published) {
                            return res.status(httpStatusCode.BAD_REQUEST).json({ error: "Something went wrong please try again." })
                        }
                        return res.status(httpStatusCode.OK).json({ data: `${published.data.title} has been published successfully.` })
                    }
                } catch (error) {
                    cloudinary.uploader.destroy(uploadedData[0].public_id)
                    if (error instanceof CustomError) {
                        return res.status(error.statusCode).json({ error: error.message })
                    } else {
                        return res.status(httpStatusCode.INTERNAL_SERVER_ERROR).json({ error: (error as any).message })
                    }

                }

            })
        } catch (error) {
            return res.status(httpStatusCode.BAD_REQUEST).json({ error: error })
        }

    }

    bb.on('field', (fieldname, value) => {
        receivedFields.push(fieldname)


        if (fieldname === 'articleId') {
            if (!isCuid(value)) {
                return res.status(httpStatusCode.BAD_REQUEST).json({ error: "ArticleId must be a cuid." })
            }
            fieldData.set(fieldname, value)
        }
        else if (fieldname === 'topicsId') {
            const topicsArray = JSON.parse(value)
            const topicsIdArray = isValidJSONArray(value);
            if (!topicsIdArray || !isValidCuidArray(topicsArray)) {
                return res.status(httpStatusCode.BAD_REQUEST).json({
                    error: 'topicsId must be a valid array of cuid',
                });
            }
            fieldData.set(fieldname, topicsArray)
        }
        else if (fieldname === 'title') {
            if (!value.length) {
                return res.status(httpStatusCode.BAD_REQUEST).json({
                    error: 'Title cannot be empty',
                });
            }
            fieldData.set(fieldname, value)
        }
        else if (fieldname === 'description') {
            if (!value.length) {
                return res.status(httpStatusCode.BAD_REQUEST).json({
                    error: 'Description cannot be empty',
                });
            }
            fieldData.set(fieldname, value)
        }
    })

    bb.on('file', (fieldName, file, info) => {
        if (fieldName !== 'publishedImage') {
            return res.status(httpStatusCode.BAD_REQUEST).json({ error: `Invalid field name: ${fieldName}` })
        }
        if (!allowedMimeTypes.includes(info.mimeType)) {
            return res.status(httpStatusCode.BAD_REQUEST).json({ error: "file type does not supported." })
        }
        const missingFields = validFields.filter(
            (field) => !receivedFields.includes(field),
        );
        if (!missingFields.length) {
            file.pipe(uploader())
        } else {
            file.resume()
        }
    })

    bb.on('error', (error) => {
        return res.status(httpStatusCode.BAD_REQUEST).json({ error })
    })

    bb.on('fieldsLimit', () => {
        return res.status(httpStatusCode.BAD_REQUEST).json({ error: "Unknown field is submited." })
    })

    bb.on('finish', () => {
        console.log('finished')
        const missingFields = validFields.filter(
            (field) => !receivedFields.includes(field),
        );

        if (missingFields.length > 0) {
            return res.status(httpStatusCode.BAD_REQUEST).json({
                error: `Missing fields: ${missingFields.join(', ')}`,
            });
        }
    })

    req.pipe(bb);

})
export default publishArticle;
