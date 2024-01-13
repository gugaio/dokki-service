const { ExpressValidator, validationResult } = require('express-validator');

const metadataService = require('../services/metadataService');

const HTTP_CODE_UNPROCESSABLE_ENTITY = 422;

const ocr = async (req, res) => {

    const validationErros = validationResult(req);
    if (!validationErros.isEmpty()) {
        const errors = validationErros.array();
        return res.status(HTTP_CODE_UNPROCESSABLE_ENTITY).json(errors);
    }

    const uuidDoc = req.params.id;
    const ocrJson = req.body;
    metadataService.ocr(uuidDoc, ocrJson).then((savedOcr) => {
        res.send(savedOcr);
    }).catch((err) => {
        res.json(err);
    });
};

module.exports = {
    ocr,
};
