const uuid = require('uuid').v4;
const s3 = require('./aws/s3');
const dynamoDB = require('./aws/dynamo');

async function downloadDocument(key) {
  let item = await dynamoDB.get(key);
  let s3Key = item.filepath;
  let result = await s3.download(s3Key);
  return result;
}

module.exports = {
  downloadDocument
};
