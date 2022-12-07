import aws from 'aws-sdk'
import { generateRandomString } from '../utils/random.js'

const AWS_BUCKET = process.env.TEZA_SERVER_AWS_BUCKET
const AWS_ACCESS_KEY_ID = process.env.TEZA_SERVER_AWS_ACCESS_KEY_ID
const AWS_REGION = process.env.TEZA_SERVER_AWS_REGION
const AWS_SECRET_ACCESS_KEY = process.env.TEZA_SERVER_AWS_SECRET_KEY


const s3 = new aws.S3({
    accessKeyId: AWS_ACCESS_KEY_ID,
    secretAccessKey: AWS_SECRET_ACCESS_KEY,
    region: AWS_REGION
});

export const UploadFileController = (req, res) => {
    const { fileName, fileType } = req.query;
    const key = `TeZa/${fileName.replaceAll(' ', '_').split('.')[0]}_${generateRandomString(10)}.${fileName.split('.')[1]}`
    const s3Params = {
        Bucket: AWS_BUCKET,
        Key: key,
        Expires: 60,
        ContentType: fileType,
        ACL: 'public-read',
    }
    s3.getSignedUrl('putObject', s3Params, (err, data) => {
        if (err) {
            console.log(err);
            return res.status(404).json({ code: 404, message: 'Error in getting signed url' })
        }
        return res.status(200).json({
            code: 200,
            message: 'Signed url generated successfully',
            data: {
                url: `https://${AWS_BUCKET}.s3.amazonaws.com/${key}`,
                signedRequest: data,
            }
        })
    })
}

export const DeleteFileController = (req, res) => {
    const { key } = req.query;
    const s3Params = {
        Bucket: AWS_BUCKET,
        Key: `TeZa/${key}`,
    }
    s3.deleteObject(s3Params, (err, data) => {
        if (err) {
            console.log(err);
            return res.status(404).json({ code: 404, message: 'Error in deleting file' })
        }
        return res.status(200).json({
            code: 200,
            message: 'File deleted successfully',
            data: data
        })
    })
}