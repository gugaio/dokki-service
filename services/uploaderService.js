const uuid = require('uuid').v4;
const s3 = require('./aws/s3');
const dynamoDB = require('./aws/dynamo');

async function upload(originalName, buffer, prefix='dataset') {
  const {uuidKey,s3Key, contentType} = _generateS3Key(originalName);

  console.log(`Upload request received for ${originalName} with key ${uuidKey}`);

  function _generateS3Key(originalName) {
    const originalNameExtension = originalName.split('.')[1];
    const uuidFile = uuid();
    const key = `${prefix}/${uuidFile}.${originalNameExtension}`;
    return {uuidKey: uuidFile, s3Key:key, contentType: `image/${originalNameExtension}`};
  }

  await s3.upload(s3Key, buffer, contentType);
  await dynamoDB.insert(uuidKey, originalName, s3Key);
  return {uuidKey:uuidKey};
}

module.exports = {
  upload
};
