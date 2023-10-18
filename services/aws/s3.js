const AWS = require('aws-sdk');

const AWS_ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID;
const AWS_SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY;
const BUCKET_NAME = process.env.BUCKET_NAME || 'notas-dev-s3';

AWS.config.update({ region: 'us-west-2', accessKeyId: AWS_ACCESS_KEY_ID, secretAccessKey: AWS_SECRET_ACCESS_KEY });

exports.upload = async (key, buffer, contentType) => {
    const s3 = new AWS.S3();
    const params = {
        Bucket: BUCKET_NAME,
        Key: key,
        Body: buffer,
        ContentType: contentType
    };
    await s3.upload(params).promise();
};

exports.download = async (key) => {
    const s3 = new AWS.S3();
    console.log(`Downloading ${key}`);
    const params = {
        Bucket: BUCKET_NAME,
        Key: key
    };

    const result = await s3.getObject(params).promise();
    return result.Body;
};

exports.downloadJson = async (key) => {
    const s3 = new AWS.S3();
    console.log(key);
    const params = {
        Bucket: BUCKET_NAME,
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
        ContentType: "application/json"
    };
    return await s3.upload(params).promise();
};