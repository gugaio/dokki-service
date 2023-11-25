const dynamoDB = require('./aws/dynamo');

async function updateOCR(docid, docType, ocr, labels, textMistakes) {
  await dynamoDB.updateOCR(docid, docType, ocr, labels, textMistakes);  
}

async function getLabels(docid) {
  const result = await dynamoDB.get(docid);
  return {ocr: result.ocr, labels: result.labels, textMistakes: result.textMistakes, docType: result.docType};
}

module.exports = {
  updateOCR,
  getLabels
};
