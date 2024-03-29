const {validationResult} = require('express-validator');

const metadataService = require('../services/metadataService');
const documentService = require('../services/documentService');
const ocrService = require('../services/ocrService');

const HTTP_CODE_UNPROCESSABLE_ENTITY = 422;
const HTTP_CODE_INTERNAL_SERVER_ERROR = 500;

const ocr = async (req, res) => {
    try {
        const uuid = req.params.id;
        const info = await documentService.info(uuid);
        const ocrJson = await ocrService.ocr(info.S3Path);
        await metadataService.saveOcr(uuid, ocrJson)
        res.send()
    } catch (error) {
        console.error('OCR error');
        res.status(HTTP_CODE_INTERNAL_SERVER_ERROR).send(error);
    }    
};

const getOcr = async (req, res) => {
    const uuidDoc = req.params.id;
    metadataService.getOcr(uuidDoc).then((ocr) => {
        res.json(ocr.rawOcr);
    }).catch((err) => {
        console.error('Get OCR error');
        res.json(err);
    });
};

module.exports = {
    ocr,
    getOcr
};
