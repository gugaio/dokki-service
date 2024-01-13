const documentService = require('../services/documentService');
const logger = require('../logger');
const DEFAULT_LIMIT = 10;

const getDocuments = (req, res) => {
    try {
        const limit = req.query.total || DEFAULT_LIMIT;
        console.log(`Dowload last ${limit} documents`);
        documentService.tail(limit).then((data) => {
            res.send(data);
        }).catch((err) => {
            res.status(500).send(err);
        });    
    } catch (error) {
        res.status(500).send(error);
    }
}


const getDocument = async (req, res) => {
    const id = req.params.id;
    console.log(`Dowload image request received for ${id}`);
    documentService.download(id).then((data) => {
        res.send(data);
    }).catch((err) => {
        res.json(err);
    });
};

const uploadDocument = async (req, res)  => {
    if (!req.file) {
        logger.warn('No file uploadmetadataServiceed');
        res.status(HTTP_CODE_BAD_REQUEST).json({ error: 'No file uploaded' });
        return;
    }

    const { buffer, originalname } = req.file;
    logger.info(`Uploading ${originalname}`);

    documentService.upload(originalname, buffer).then((data) => {
        console.log(`Upload request completed for ${originalname}. UUID: ${data.uuidKey}`);
        res.json({ id: data.uuidKey, s3Key: data.s3Key });
    }).catch((err) => {
        logger.error(`Upload failed for ${originalname}. Original error: ${err}`);
        res.status(HTTP_CODE_BAD_REQUEST).json(err);
    });
};

module.exports = {
    getDocuments,
    getDocument,
    uploadDocument
};
