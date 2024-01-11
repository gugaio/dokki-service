
const { Document, Ocr } = require('../../business/models');


const document = {}

document.insert = async (uuid, originalName, s3FilePath) => {
  const documentData = new Document({ uuid: uuid, originalName: originalName, S3Path: s3FilePath});
  const savedDocument = await documentData.save();
  return savedDocument;
};

document.get = async (uuid) => {
  const result = await Document.findOne({ uuid: uuid });
  return result;
};

document.last = async (n) => {
  const result = await Document.find().sort({ updateTime: -1 }).limit(n);
  return result;
};


const ocr = {}

ocr.insert = async (uuid, rawOcr) => {
  const ocrData = new Ocr({ uuid: uuid, rawOcr: rawOcr});
  const savedOcr = await ocrData.save();
  return savedOcr;
}

ocr.get = async (uuid) => {
  const result = await Ocr.findOne({ uuid: uuid });
  return result;
};

ocr.findOneAndUpdate = async (uuid, rawOcr) => {
  const result = await Ocr.findOneAndUpdate({ uuid: uuid }, { rawOcr: rawOcr });
  return result;
}

ocr.updateMistakes = async (uuid, mistakes) => {
  const result = await Ocr.findOneAndUpdate({ uuid: uuid }, { mistakes: mistakes });
  return result;
};

exports.document = document;
exports.ocr = ocr;
