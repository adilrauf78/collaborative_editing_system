const express = require('express');
const router = express.Router();
const { addVersionController , getDocumentVersionsController, revertVersionController } = require('../controller/versionController');
const authMiddlewares = require('../middlewares/authMiddlewares');


// Add new version
router.post('/add', authMiddlewares, addVersionController);

// Get all versions for a document
router.get('/:documentId/versions', authMiddlewares, getDocumentVersionsController);

// Revert to a specific version
router.post('/revert/:versionId', authMiddlewares, revertVersionController);

module.exports = router;
