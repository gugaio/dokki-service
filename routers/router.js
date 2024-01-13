const express = require('express');
const router = express.Router();

// Import user controller
const documentController = require('../controllers/documentController');

// Define routes
router.get('/documents', documentController.getDocuments);
router.post('/documents', documentController.uploadDocument);

module.exports = router;