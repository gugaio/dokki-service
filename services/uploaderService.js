const uuid = require('uuid').v4;
const s3 = require('./aws/s3');
const dynamoDB = require('./aws/dynamo');

async function upload(originalName, buffer, prefix='dataset') {
  const {uuidKey,s3Key} = _generateS3Key(originalName);

  function _generateS3Key(originalName) {
    const originalNameExtension = originalName.split('.')[1];
    const uuidFile = uuid();
    const key = `${prefix}/${uuidFile}.${originalNameExtension}`;
    return {uuidKey: uuidFile, s3Key:key};
  }

  await s3.upload(s3Key, buffer);
  await dynamoDB.insert(uuidKey, s3Key);
  return {uuidKey:uuidKey, s3Key:s3Key};
}

module.exports = {
  upload
};