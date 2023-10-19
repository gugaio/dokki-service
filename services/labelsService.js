const dynamoDB = require('./aws/dynamo');

async function updateOCR(docid, ocr, labels) {
  await dynamoDB.updateOCR(docid, ocr, labels);  
}

async function getLabels(docid) {
  const result = await dynamoDB.get(docid);
  return {ocr: result.ocr, labels: result.labels};
}

module.exports = {
  updateOCR,
  getLabels
};
