const AWS = require('aws-sdk');

const AWS_REGION = process.env.AWS_REGION || 'us-west-2';
const AWS_ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID;
const AWS_SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY;
const DEFAULT_BUCKET_NAME = process.env.BUCKET_NAME || 'notas-dev-s3';

AWS.config.update({region: AWS_REGION, accessKeyId: AWS_ACCESS_KEY_ID, secretAccessKey: AWS_SECRET_ACCESS_KEY});

exports.upload = async (key, buffer, contentType, bucket = DEFAULT_BUCKET_NAME) => {
    const s3 = new AWS.S3();
    const params = {
        Bucket: bucket,
        Key: key,
        Body: buffer,
        ContentType: contentType
    };
    await s3.upload(params).promise();
};

exports.download = async (key, bucket = DEFAULT_BUCKET_NAME) => {
    const s3 = new AWS.S3();
    console.log(`Downloading ${key}`);
    const params = {
        Bucket: bucket,
        Key: key
    };

    const result = await s3.getObject(params).promise();
    return result.Body;
};

exports.DEFAULT_BUCKET_NAME = DEFAULT_BUCKET_NAME;

exports.downloadJson = async (key, bucket = DEFAULT_BUCKET_NAME) => {
    const s3 = new AWS.S3();
    console.log(key);
    const params = {
        Bucket: bucket,
        Key: key
    };

    return new Promise((resolve, reject) => {
        s3.getObject(params, (err, data) => {
            if (err) {
                reject(err);
              } else {
                try {
                    console.log(data);
                    console.log(data.Body.toString());
                  const jsonContent = JSON.parse(data.Body.toString());
                  resolve(jsonContent);
                } catch (parseError) {
                  reject(parseError);
                }
              }
        });

    });

};


exports.uploadJson = async (json, key) => {
    const s3 = new AWS.S3();
    const params = {
        Bucket: BUCKET_NAME,
        Key: key,
        Body: JSON.stringify(json),
        ContentType: 'application/json'
    };
    return await s3.upload(params).promise();
};
