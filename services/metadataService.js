const mongo = require('./aws/mongo');

async function ocr(uuidDoc, ocr) {
  const savedOcr = await mongo.ocr.insert(uuidDoc, ocr);
  return savedOcr;
}

async function getOcr(uuidDoc) {
  const ocr = await mongo.ocr.get(uuidDoc);
  return ocr;
}

module.exports = {
  ocr,
  getOcr
};
