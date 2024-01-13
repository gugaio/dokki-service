const express = require('express');
const router = express.Router();
const uploader = require('../middleware/uploader');

const {ExpressValidator} = require('express-validator');
const {body} = new ExpressValidator({
    isOcrJsonValid: pages => {
        if (!pages || !Array.isArray(pages) || pages.length == 0) {
            throw new Error('OCR Json must have at least one page');
        }
        pages.forEach(page => {
            if (!page.blocks || !Array.isArray(page.blocks)) {
                throw new Error('Each OCR page must have the blocks field');
            }
        });
        return true;
    },
});

//  Import controllers
const documentController = require('../controllers/documentController');
const metadataController = require('../controllers/metadataController');

//  Define routes
router.get('/documents', documentController.getDocuments);
router.get('/documents/:id', documentController.getDocument);
router.post('/documents', uploader.single('file'), documentController.uploadDocument);

router.post('/documents/:id/ocr', body('pages').isOcrJsonValid(), metadataController.ocr);

module.exports = router;
