const uuid = require('uuid').v4;
const s3 = require('./aws/s3');
const mongo = require('./aws/mongo');

const logger = require('../logger');

async function upload(originalName, buffer, prefix='dataset') {
  const {uuidKey, s3Key, contentType} = _generateS3Key(originalName, prefix);
  logger.info(`Generate uuid ${uuidKey} to ${originalName}. S3 full path: ${s3Key}`);
  await s3.upload(s3Key, buffer, contentType);
  await mongo.document.insert(uuidKey, originalName, s3Key);
  return {uuidKey: uuidKey, s3Key: s3Key};
}

async function download(key) {
  const item = await mongo.document.get(key);
  const s3Key = item.S3Path;
  console.log(`Downloading ${s3Key}`);
  const result = await s3.download(s3Key);
  return result;
}

async function info(key) {
  const item = await mongo.document.get(key);
  return item;
}

async function tail(limit) {
  const items = await mongo.document.tail(limit);
  return items;
}

function _generateS3Key(originalName, prefix) {
  const originalNameExtension = originalName.split('.')[1];
  const uuidFile = uuid();
  const key = `${prefix}/${uuidFile}.${originalNameExtension}`;
  return {uuidKey: uuidFile, s3Key: key, contentType: `image/${originalNameExtension}`};
}

module.exports = {
  upload,
  download,
  info,
  tail
};
