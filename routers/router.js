const express = require('express');
const router = express.Router();
const uploader = require('../middleware/uploader');

const { body } = require('express-validator');
const { isOcrJsonValid } = require('../middleware/validators/ocrValidator');

//  Import controllers
const documentController = require('../controllers/documentController');
const metadataController = require('../controllers/metadataController');

//  Define routes
router.get('/documents', documentController.getDocuments);
router.get('/documents/:id', documentController.getDocument);
router.post('/documents', uploader.single('file'), documentController.uploadDocument);

router.post('/documents/:id/ocr', body('pages').custom(isOcrJsonValid), metadataController.ocr);


router.get('/ping', (req, res) => {
    res.send('pong');
});

module.exports = router;
