const mongo = require('./aws/mongo');

async function ocr(uuidDoc, ocr) {
  const savedOcr = await mongo.ocr.insert(uuidDoc, ocr);
  return savedOcr;
}

module.exports = {
  ocr
};
