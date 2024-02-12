import asyncHandler from '@utils/asynHandler';
import { Request, Response } from 'express';
import busboy from 'busboy';
import { v2 as cloudinary } from 'cloudinary';
import { UploadApiResponse } from 'cloudinary'
import { httpStatusCode } from '@customtype/index';


const uploadMedia = asyncHandler(async (req: Request, res: Response) => {

    const uploadPromise = async (): Promise<UploadApiResponse[]> => {

        return new Promise((resolve, reject) => {
            const bb = busboy({
                headers: req.headers
            });

            const uploads: UploadApiResponse[] = [];
            let filesCount = 0

            const uploader = () => {
                return cloudinary.uploader.upload_stream((error, data) => {
                    if (error) reject(error)
                    else if (data) {
                        uploads.push(data)
                        if (filesCount === uploads.length) resolve(uploads)
                    }
                })
            }

            bb.on('file', (name, file, info) => {
                file.pipe(uploader())
                file.on('end', () => (filesCount = filesCount + 1))
            })

            bb.on('error', (error) => {
                console.log(error)
                reject({ error })
            })

            req.pipe(bb)
        })

    }

    const uploaded = await uploadPromise();
    const data = uploaded.map(upload => ({ url: upload.secure_url, publicId: upload.public_id }))
    return res.status(httpStatusCode.OK).json(data)

});

export default uploadMedia;
