const DocumentVersion = require("../models/versionModel");

// Add new version
const addVersionController = async (req, res) => {
  try {
    const userId = req.user.id;
    const { documentId, content, notes } = req.body;

    if (!documentId || !content) {
      return res.status(400).send({
        success: false,
        message: "Document ID and content are required",
      });
    }

    // Find latest version number
    const latestVersion = await DocumentVersion.find({ documentId })
      .sort({ versionNumber: -1 })
      .limit(1);

    const versionNumber = latestVersion.length > 0 ? latestVersion[0].versionNumber + 1 : 1;

    const version = await DocumentVersion.create({
      documentId,
      content,
      versionNumber,
      editedBy: userId,
      notes,
    });

    res.status(201).send({
      success: true,
      message: "New version added successfully",
      version,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error adding version",
      error,
    });
  }
};

// Get all versions of a document
const getDocumentVersionsController = async (req, res) => {
  try {
    const { documentId } = req.params;

    const versions = await DocumentVersion.find({ documentId })
      .sort({ versionNumber: -1 })
      .populate("editedBy", "userName email");

    res.status(200).send({
      success: true,
      versions,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error fetching versions",
      error,
    });
  }
};

// Revert to a specific version
const revertVersionController = async (req, res) => {
  try {
    const userId = req.user.id;
    const { versionId } = req.params;

    const version = await DocumentVersion.findById(versionId);
    if (!version) {
      return res.status(404).send({
        success: false,
        message: "Version not found",
      });
    }

    // Create new version identical to old one
    const newVersion = await DocumentVersion.create({
      documentId: version.documentId,
      content: version.content,
      versionNumber: version.versionNumber + 1,
      editedBy: userId,
      notes: `Reverted to version ${version.versionNumber}`,
    });

    res.status(200).send({
      success: true,
      message: "Document reverted to selected version",
      version: newVersion,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error reverting version",
      error,
    });
  }
};

module.exports = {
  addVersionController,
  getDocumentVersionsController,
  revertVersionController,
};
