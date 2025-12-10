const express = require("express");
const {
  createDocumentController,
  getDocumentController,
  updateDocumentController,
  getUserDocumentsController,
} = require("../controller/documentController");

const authMiddlewares = require('../middlewares/authMiddlewares');

const router = express.Router();

// Create document
router.post("/create", authMiddlewares, createDocumentController);

// Get all documents of user
router.get("/getall", authMiddlewares, getUserDocumentsController);

// Get single document
router.get("/:id", authMiddlewares, getDocumentController);

// Update document
router.put("/:id", authMiddlewares, updateDocumentController);


module.exports = router;
