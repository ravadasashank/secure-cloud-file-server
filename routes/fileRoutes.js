const express = require('express');
const router = express.Router();
const fileController = require('../controllers/fileController');
const authMiddleware = require('../middleware/auth');
const uploadMiddleware = require('../middleware/upload');
const { validateFileUpload } = require('../middleware/validation');

/**
 * @route   POST /api/files/upload
 * @desc    Upload a file
 * @access  Private
 */
router.post('/upload', 
  authMiddleware, 
  uploadMiddleware.single('file'), 
  validateFileUpload, 
  fileController.uploadFile
);

/**
 * @route   GET /api/files
 * @desc    Get all files for the authenticated user
 * @access  Private
 */
router.get('/', authMiddleware, fileController.getUserFiles);

/**
 * @route   GET /api/files/:id
 * @desc    Get file metadata by ID
 * @access  Private
 */
router.get('/:id', authMiddleware, fileController.getFileById);

/**
 * @route   GET /api/files/:id/download
 * @desc    Download a file
 * @access  Private
 */
router.get('/:id/download', authMiddleware, fileController.downloadFile);

/**
 * @route   DELETE /api/files/:id
 * @desc    Delete a file
 * @access  Private
 */
router.delete('/:id', authMiddleware, fileController.deleteFile);

/**
 * @route   PUT /api/files/:id/share
 * @desc    Share file with another user
 * @access  Private
 */
router.put('/:id/share', authMiddleware, fileController.shareFile);

module.exports = router;
