const express = require('express');
const router = express.Router();
const uploader = require('../middleware/uploader');

// Import user controller
const documentController = require('../controllers/documentController');

// Define routes
router.get('/documents', documentController.getDocuments);
router.get('/documents/:id', documentController.getDocument);
router.post('/documents', uploader.single('file'), documentController.uploadDocument);

module.exports = router;