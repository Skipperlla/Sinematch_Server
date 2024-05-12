import { Types } from 'mongoose';
import multer from 'multer';
import aws from 'aws-sdk';
import fs from 'fs';
import { v4 } from 'uuid';
import { DeleteObjectOutput } from 'aws-sdk/clients/s3';
import { BAD_REQUEST } from 'http-status';

import { Config } from '@config/index';
import { UserSchema } from '@schemas/index';

import customError from './error/customError';

const spacesEndpoint = new aws.Endpoint(Config.s3.endPoint);

const s3 = new aws.S3({
  endpoint: spacesEndpoint,
  accessKeyId: Config.s3.accessKeyId,
  secretAccessKey: Config.s3.secretAccessKey,
  s3ForcePathStyle: true,
  signatureVersion: 'v4',
  region: Config.s3.region,
});

const uploadAvatarFilter = multer({
  storage: multer.diskStorage({}),
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpg', 'image/jpeg', 'image/png'];
    if (!allowedTypes.includes(file.mimetype))
      return cb(new customError('errors.multerTypeError', BAD_REQUEST));
    return cb(null, true);
  },
});
const avatarUpload = async (
  file: { path: fs.PathLike; mimetype: string },
  userId: string,
  bucketPath: string,
): Promise<aws.S3.ManagedUpload.SendData> => {
  const Bucket = `${userId}/${bucketPath}`;
  const fileStream = fs.createReadStream(file.path);

  const uploadParams = {
    Bucket,
    Key: v4(),
    ACL: 'public-read',
    Body: fileStream,
    ContentType: file.mimetype,
  };

  return s3.upload(uploadParams).promise();
};
const removeAvatar = async (
  Key: string,
  Bucket: string,
): Promise<DeleteObjectOutput> => {
  const params = {
    Bucket,
    Key,
  };
  return await s3.deleteObject(params).promise();
};
export default { uploadAvatarFilter, avatarUpload, removeAvatar };
