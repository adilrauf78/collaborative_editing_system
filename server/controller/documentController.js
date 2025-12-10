const Document = require("../models/documentModel");

// Create new document
const createDocumentController = async (req, res) => {
  try {
    const userId = req.user.id;
    const { title, content } = req.body;

    if (!title) {
      return res.status(400).send({
        success: false,
        message: "Title is required",
      });
    }

    const document = await Document.create({
      title,
      content,
      owner: userId,
      collaborators: [userId],
    });

    res.status(201).send({
      success: true,
      message: "Document created successfully",
      document,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error creating document",
      error,
    });
  }
};

// Get single document
const getDocumentController = async (req, res) => {
  try {
    const documentId = req.params.id;

    const document = await Document.findById(documentId).populate(
      "owner collaborators",
      "userName email"
    );

    if (!document) {
      return res.status(404).send({
        success: false,
        message: "Document not found",
      });
    }

    res.status(200).send({
      success: true,
      document,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error fetching document",
      error,
    });
  }
};

// Update/Edit document
const updateDocumentController = async (req, res) => {
  try {
    const documentId = req.params.id;
    const { title, content } = req.body;

    const document = await Document.findByIdAndUpdate(
      documentId,
      { title, content },
      { new: true, runValidators: true }
    );

    if (!document) {
      return res.status(404).send({
        success: false,
        message: "Document not found",
      });
    }

    res.status(200).send({
      success: true,
      message: "Document updated successfully",
      document,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error updating document",
      error,
    });
  }
};

// Get all documents for authenticated user
const getUserDocumentsController = async (req, res) => {
  try {
    const userId = req.user.id;

    const documents = await Document.find({
      collaborators: { $in: [userId] },
    }).sort({ updatedAt: -1 });

    res.status(200).send({
      success: true,
      documents,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error fetching user documents",
      error,
    });
  }
};

module.exports = {
  createDocumentController,
  getDocumentController,
  updateDocumentController,
  getUserDocumentsController,
};
