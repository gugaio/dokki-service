const AWS = require('aws-sdk');

const AWS_ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID;
const AWS_SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY;
const BUCKET_NAME = process.env.BUCKET_NAME || 'notas-dev-s3';

AWS.config.update({ region: 'us-west-2', accessKeyId: AWS_ACCESS_KEY_ID, secretAccessKey: AWS_SECRET_ACCESS_KEY });

exports.upload = async (buffer, key) => {
    const s3 = new AWS.S3();
    const params = {
        Bucket: BUCKET_NAME,
        Key: key,
        Body: buffer
    };
    return await s3.upload(params).promise();
};

exports.downloadImage = async (agent, sender, filename) => {
    const s3 = new AWS.S3();
    const key = `${agent}/${sender}/${filename}`;
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
                  resolve(data.Body);
                } catch (parseError) {
                  reject(parseError);
                }
              }
        });

    });

};

exports.downloadJson = async (agent, sender, filename) => {
    const s3 = new AWS.S3();
    const key = `${agent}/${sender}/${filename}`;
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


exports.uploadJson = async (json, agent, sender, uuidFile) => {
    const s3 = new AWS.S3();
    const params = {
        Bucket: BUCKET_NAME,
        Key: `${agent}/${sender}/${uuidFile}.json`,
        Body: JSON.stringify(json),
        ContentType: "application/json"
    };
    return await s3.upload(params).promise();
};