import { httpStatusCode } from '@customtype/index';
import UserService from '@service/UserService';
import asyncHandler from '@utils/asynHandler';
import busboy from 'busboy';
import { Request, Response } from 'express';
import { UploadApiResponse, v2 as cloudinary } from 'cloudinary';
import { User } from '@db/schema';

const userService = new UserService();

const userProfilePic = asyncHandler(async (req: Request, res: Response) => {
    const allowedMimeTypes = [
        'image/jpeg',
        'image/png',
        'image/gif',
        'image/jpg',
    ];

    const uploadPromise = async (): Promise<UploadApiResponse> => {
        return new Promise((resolve, reject) => {
            const bb = busboy({
                headers: req.headers,
                limits: {
                    files: 1,
                    fileSize: 1000000 * 2,
                },
            });

            const uploader = () => {
                return cloudinary.uploader.upload_stream((error, data) => {
                    if (error) reject(error);
                    else if (data) resolve(data);
                });
            };

            bb.on('file', (fieldName, file, info) => {
                if (fieldName !== 'profilePic') {
                    return res
                        .status(httpStatusCode.BAD_REQUEST)
                        .json({ error: `Invalid field name: ${fieldName}` });
                }
                if (!allowedMimeTypes.includes(info.mimeType)) {
                    return res
                        .status(httpStatusCode.BAD_REQUEST)
                        .json({ error: 'file type does not supported.' });
                }

                file.pipe(uploader());

                file.on('error', (error) => {
                    reject(error.message);
                });

                file.on('end', () => {
                    console.log('end');
                });
            });

            bb.on('filesLimit', () => {
                return res
                    .status(httpStatusCode.BAD_REQUEST)
                    .json({ error: "You can't upload more than 1 file." });
            });

            bb.on('error', (error) => {
                return res.status(httpStatusCode.BAD_REQUEST).json({ error });
            });

            req.pipe(bb);
        });
    };

    const uploadedData = await uploadPromise();
    const data: Partial<User> = {
        profilePic: uploadedData.secure_url,
        publicId: uploadedData.public_id,
    };
    const updatedProfile = await userService.updateProfile(req.user_id, data);
    return res
        .status(httpStatusCode.OK)
        .json({ data: updatedProfile.profilePic });
});

export default userProfilePic;
