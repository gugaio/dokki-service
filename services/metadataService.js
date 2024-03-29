const mongo = require('./aws/mongo');

async function saveOcr(uuidDoc, ocr) {
  console.log(`Inserting OCR for ${uuidDoc}`);
  const savedOcr = await mongo.ocr.upsert(uuidDoc, ocr);
  return savedOcr;
}

async function getOcr(uuidDoc) {
  const ocr = await mongo.ocr.get(uuidDoc);
  return ocr;
}

module.exports = {
  saveOcr,
  getOcr
};
