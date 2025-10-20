const FileService = require('../services/fileService');
const StorageService = require('../services/storageService');
const EncryptionService = require('../services/encryptionService');

/**
 * Upload a file
 */
exports.uploadFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const { originalname, mimetype, size, buffer } = req.file;
    const userId = req.user.userId;

    // Encrypt file
    const encryptedData = EncryptionService.encrypt(buffer);

    // Upload to cloud storage
    const storageResult = await StorageService.upload({
      filename: originalname,
      data: encryptedData,
      mimetype
    });

    // Save file metadata to database
    const file = await FileService.create({
      userId,
      filename: originalname,
      mimetype,
      size,
      storageKey: storageResult.key,
      encryptionKey: encryptedData.key,
      encryptionIV: encryptedData.iv
    });

    res.status(201).json({
      message: 'File uploaded successfully',
      file: {
        id: file.id,
        filename: file.filename,
        size: file.size,
        mimetype: file.mimetype,
        uploadedAt: file.createdAt
      }
    });
  } catch (error) {
    console.error('File upload error:', error);
    res.status(500).json({ message: 'Error uploading file' });
  }
};

/**
 * Get all files for a user
 */
exports.getUserFiles = async (req, res) => {
  try {
    const userId = req.user.userId;
    const files = await FileService.findByUserId(userId);

    res.json({
      files: files.map(file => ({
        id: file.id,
        filename: file.filename,
        size: file.size,
        mimetype: file.mimetype,
        uploadedAt: file.createdAt
      }))
    });
  } catch (error) {
    console.error('Get files error:', error);
    res.status(500).json({ message: 'Error retrieving files' });
  }
};

/**
 * Get file metadata by ID
 */
exports.getFileById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    const file = await FileService.findById(id);
    
    if (!file) {
      return res.status(404).json({ message: 'File not found' });
    }

    if (file.userId !== userId && !file.sharedWith?.includes(userId)) {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json({
      file: {
        id: file.id,
        filename: file.filename,
        size: file.size,
        mimetype: file.mimetype,
        uploadedAt: file.createdAt
      }
    });
  } catch (error) {
    console.error('Get file error:', error);
    res.status(500).json({ message: 'Error retrieving file' });
  }
};

/**
 * Download a file
 */
exports.downloadFile = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    const file = await FileService.findById(id);
    
    if (!file) {
      return res.status(404).json({ message: 'File not found' });
    }

    if (file.userId !== userId && !file.sharedWith?.includes(userId)) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Download from cloud storage
    const encryptedData = await StorageService.download(file.storageKey);

    // Decrypt file
    const decryptedData = EncryptionService.decrypt({
      data: encryptedData,
      key: file.encryptionKey,
      iv: file.encryptionIV
    });

    res.setHeader('Content-Type', file.mimetype);
    res.setHeader('Content-Disposition', `attachment; filename="${file.filename}"`);
    res.send(decryptedData);
  } catch (error) {
    console.error('File download error:', error);
    res.status(500).json({ message: 'Error downloading file' });
  }
};

/**
 * Delete a file
 */
exports.deleteFile = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    const file = await FileService.findById(id);
    
    if (!file) {
      return res.status(404).json({ message: 'File not found' });
    }

    if (file.userId !== userId) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Delete from cloud storage
    await StorageService.delete(file.storageKey);

    // Delete from database
    await FileService.delete(id);

    res.json({ message: 'File deleted successfully' });
  } catch (error) {
    console.error('File delete error:', error);
    res.status(500).json({ message: 'Error deleting file' });
  }
};

/**
 * Share file with another user
 */
exports.shareFile = async (req, res) => {
  try {
    const { id } = req.params;
    const { email } = req.body;
    const userId = req.user.userId;

    const file = await FileService.findById(id);
    
    if (!file) {
      return res.status(404).json({ message: 'File not found' });
    }

    if (file.userId !== userId) {
      return res.status(403).json({ message: 'Access denied' });
    }

    await FileService.shareWith(id, email);

    res.json({ message: 'File shared successfully' });
  } catch (error) {
    console.error('File share error:', error);
    res.status(500).json({ message: 'Error sharing file' });
  }
};
