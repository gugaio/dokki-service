const uuid = require('uuid').v4;
const s3 = require('./aws/s3');
const dynamoDB = require('./aws/dynamo');

async function downloadDocument(key) {
  let item = await dynamoDB.get(key);
  let s3Key = item.S3Path;
  console.log(`Downloading ${s3Key}`);
  let result = await s3.download(s3Key);
  return result;
}

async function listDataset() {
  let items = await dynamoDB.scan('labels');
  return items;
}

async function listOcrMistakes() {
  let items = await dynamoDB.scanTextMistakes();
  return items; 
}

module.exports = {
  downloadDocument,
  listDataset,
  listOcrMistakes
};
