
const { Document, Ocr } = require('../business/models');
const logger = require('../logger');

const documentFacade = {}

documentFacade.insert = async (uuid, originalName, s3FilePath, to, from) => {
  const newDocument = new Document({ uuid: uuid, originalName: originalName, S3Path: s3FilePath, to: to, from: from });
  const savedDocument = await newDocument.save();
  return savedDocument;
};

documentFacade.get = async (uuid) => {
  const oneDocument = await Document.findOne({ uuid: uuid });
  logger.info(`Get document ${uuid} from mongoDB.`);
  return oneDocument;
};

documentFacade.tail = async (n) => {
  const sortedDocuments = await Document.find().sort({ updateTime: -1 }).limit(n);
  logger.info(`Get last ${n} documents from mongoDB.`);
  return sortedDocuments;
};

const ocrFacade = {}

ocrFacade.insert = async (uuid, rawOcr) => {
  const newOcr = new Ocr({ uuid: uuid, rawOcr: rawOcr });
  const savedOcr = await newOcr.save();
  logger.info(`Insert ocr ${uuid} into mongoDB.`);
  return savedOcr;
}

ocrFacade.get = async (uuid) => {
  const oneOcr = await Ocr.findOne({ uuid: uuid });
  logger.info(`Get ocr ${uuid} from mongoDB.`);
  return oneOcr;
};

ocrFacade.upsert = async (uuid, rawOcr) => {
  const updatedOcr = await Ocr.findOneAndUpdate({ uuid: uuid }, { rawOcr: rawOcr }, { upsert: true, new: true });
  logger.info(`Upsert ocr ${uuid} into mongoDB.`);
  return updatedOcr;
}

ocrFacade.findOneAndUpdate = async (uuid, rawOcr) => {
  const updatedOcr = await Ocr.findOneAndUpdate({ uuid: uuid }, { rawOcr: rawOcr });
  logger.info(`Update ocr ${uuid} into mongoDB.`);
  return updatedOcr;
}

ocrFacade.updateMistakes = async (uuid, mistakes) => {
  const result = await Ocr.findOneAndUpdate({ uuid: uuid }, { mistakes: mistakes });
  return result;
};

exports.document = documentFacade;
exports.ocr = ocrFacade;
