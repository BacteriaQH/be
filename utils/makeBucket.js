import aws from 'aws-sdk';
import dotenv from 'dotenv';
dotenv.config({ path: '../.env' })

const REGION = process.env.AWS_REGION;
const AWS_BUCKET = process.env.AWS_BUCKET;
const AWS_ACCES_KEY_ID = process.env.AWS_ACCES_KEY_ID;
const AWS_SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY;

console.log('AWS_BUCKET', AWS_BUCKET);
console.log('test env', process.env.TEST_ENV);
aws.config.update({
    accessKeyId: AWS_ACCES_KEY_ID,
    secretAccessKey: AWS_SECRET_ACCESS_KEY,
    region: REGION,
})

var s3 = new aws.S3();
const params = {
    Bucket: AWS_BUCKET
};

const editBucketCORS = () =>
    s3.putBucketCors(
        {
            Bucket: AWS_BUCKET,
            CORSConfiguration: {
                CORSRules: [
                    {
                        AllowedHeaders: ["*"],
                        AllowedMethods: ["PUT", "POST", "DELETE"],
                        AllowedOrigins: ["*"]
                    },
                    {
                        AllowedMethods: ["GET"],
                        AllowedOrigins: ["*"]
                    }
                ]
            }
        },
        err => {
            if (err) console.log(err, err.stack);
            else console.log(`Edit Bucket CORS succeed!`);
        }
    );

s3.createBucket(params, (err, data) => {
    if (err) console.log(err, err.stack);
    else {
        console.log(data);
        editBucketCORS();
    }
});