const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const pool = require('../database/config');
const FileUploadService = require('../services/FileUploadService');
const { auth } = require('../auth/middleware');
const { upload, fileValidationMiddleware, uploadRateLimit } = require('../middleware/fileValidation');
const path = require('path');

const fileUploadService = new FileUploadService();

// Validation middleware
const validateMediaFile = [
  body('alt_text').optional().isLength({ max: 255 }).withMessage('Alt text must be less than 255 characters'),
  body('caption').optional().isLength({ max: 500 }).withMessage('Caption must be less than 500 characters'),
  body('tags').optional().custom((value) => {
    // Handle both string and array formats
    if (typeof value === 'string') {
      try {
        const parsed = JSON.parse(value);
        if (Array.isArray(parsed)) {
          return true;
        }
      } catch (e) {
        // If JSON parsing fails, treat as comma-separated string
        const tags = value.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);
        return true; // We'll handle the conversion in the route
      }
    }
    if (Array.isArray(value)) {
      return true;
    }
    throw new Error('Tags must be an array or valid JSON string');
  })
];

// GET - Retrieve all media files with pagination
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 20, search, mimeType, storageProvider } = req.query;
    
    const result = await fileUploadService.listFiles({
      page: parseInt(page),
      limit: parseInt(limit),
      search,
      mimeType,
      storageProvider
    });

    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Error fetching media files:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve media files',
      message: error.message
    });
  }
});

// GET - Retrieve single media file by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const mediaFile = await fileUploadService.getFileById(id);

    if (!mediaFile) {
      return res.status(404).json({
        success: false,
        error: 'Media file not found'
      });
    }

    res.json({
      success: true,
      data: {
        ...mediaFile,
        url: fileUploadService.getFileUrlWithFallback(mediaFile),
        backupUrls: fileUploadService.getBackupUrls(mediaFile)
      }
    });
  } catch (error) {
    console.error('Error fetching media file:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve media file',
      message: error.message
    });
  }
});

// POST - Upload new media file
router.post('/', 
  auth, 
  uploadRateLimit(5, 60 * 1000), // 5 uploads per minute
  upload.single('file'), 
  fileValidationMiddleware,
  validateMediaFile, 
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          error: 'Validation failed',
          details: errors.array()
        });
      }

      // Debug logging
      console.log('Upload request user:', req.user);
      console.log('Upload request body:', req.body);
      
      // Convert user ID to UUID format if it's a number
      let uploadedBy = null;
      if (req.user?.id) {
        // If ID is a number (from admin_users table), we need to either:
        // 1. Keep it as null (uploaded_by is nullable)
        // 2. Or use a default UUID
        // Since admin_users uses integer IDs and media_files expects UUID, use null for now
        // TODO: Consider creating a mapping table or changing uploaded_by to accept integer IDs
        uploadedBy = null; // Set to null since we can't convert integer ID to UUID directly
      }
      
      // Save file using service (includes database save)
      const fileInfo = await fileUploadService.saveFile(req.file, {
        secureFilename: req.fileValidation.secureFilename,
        alt_text: req.body.alt_text,
        caption: req.body.caption,
        tags: (() => {
          if (!req.body.tags) return [];
          if (Array.isArray(req.body.tags)) return req.body.tags;
          if (typeof req.body.tags === 'string') {
            try {
              return JSON.parse(req.body.tags);
            } catch (e) {
              // If JSON parsing fails, treat as comma-separated string
              return req.body.tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);
            }
          }
          return [];
        })(),
        uploadedBy: uploadedBy, // null is allowed (column is nullable)
        customMetadata: {
          category: req.fileValidation.category,
          originalName: req.fileValidation.originalName
        }
      });

      res.status(201).json({
        success: true,
        message: 'File uploaded successfully',
        data: {
          id: fileInfo.id,
          filename: fileInfo.filename,
          originalFilename: fileInfo.originalFilename,
          url: fileInfo.url,
          size: fileInfo.size,
          mimeType: fileInfo.mimeType,
          storageProvider: fileInfo.storageProvider,
          backupStorageProvider: fileInfo.backupStorageProvider,
          r2Url: fileInfo.r2Url,
          supabaseUrl: fileInfo.supabaseUrl,
          altText: fileInfo.altText,
          caption: fileInfo.caption,
          tags: fileInfo.tags,
          createdAt: fileInfo.createdAt
        }
      });
    } catch (error) {
      console.error('Error uploading file:', error);
      console.error('Error stack:', error.stack);
      console.error('Error details:', {
        message: error.message,
        code: error.code,
        constraint: error.constraint,
        detail: error.detail,
        sql: error.sql,
        table: error.table
      });
      res.status(500).json({
        success: false,
        error: 'Failed to upload file',
        message: error.message,
        details: error.detail || error.message,
        code: error.code,
        constraint: error.constraint,
        table: error.table
      });
    }
  }
);

// PUT - Update media file metadata
router.put('/:id', auth, validateMediaFile, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const { id } = req.params;
    const { alt_text, caption, tags } = req.body;

    const query = `
      UPDATE media_files 
      SET alt_text = $1, caption = $2, tags = $3, updated_at = NOW()
      WHERE id = $4 AND is_active = true
      RETURNING *
    `;
    
    const result = await pool.query(query, [
      alt_text || '',
      caption || '',
      tags || [],
      id
    ]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Media file not found'
      });
    }

    const updatedFile = result.rows[0];

    res.json({
      success: true,
      message: 'Media file updated successfully',
      data: {
        ...updatedFile,
        url: fileUploadService.getFileUrl(updatedFile.filename, updatedFile.storage_provider)
      }
    });
  } catch (error) {
    console.error('Error updating media file:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update media file',
      message: error.message
    });
  }
});

// DELETE - Soft delete media file
router.delete('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;

    // Get file info before deletion
    const fileInfo = await fileUploadService.getFileById(id);
    if (!fileInfo) {
      return res.status(404).json({
        success: false,
        error: 'Media file not found'
      });
    }

    // Soft delete from database
    const query = `
      UPDATE media_files 
      SET is_active = false, updated_at = NOW()
      WHERE id = $1
    `;
    
    const result = await pool.query(query, [id]);

    if (result.rowCount === 0) {
      return res.status(404).json({
        success: false,
        error: 'Media file not found'
      });
    }

    // Optionally delete from storage (uncomment if you want hard delete)
    // await fileUploadService.deleteFile(fileInfo.filename, fileInfo.storage_provider);

    res.json({
      success: true,
      message: 'Media file deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting media file:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete media file',
      message: error.message
    });
  }
});

// GET - Download media file
router.get('/:id/download', async (req, res) => {
  try {
    const { id } = req.params;
    const mediaFile = await fileUploadService.getFileById(id);

    if (!mediaFile) {
      return res.status(404).json({
        success: false,
        error: 'Media file not found'
      });
    }

    // For cloud storage, redirect to the public URL
    if (mediaFile.storage_provider !== 'local') {
      const fileUrl = fileUploadService.getFileUrl(mediaFile.filename, mediaFile.storage_provider);
      return res.redirect(fileUrl);
    }

    // For local files, check if file exists and stream it
    const fs = require('fs');
    const filePath = path.join(__dirname, '../../uploads', mediaFile.filename);
    
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        success: false,
        error: 'File not found on disk'
      });
    }

    // Set headers for download
    res.setHeader('Content-Type', mediaFile.mime_type);
    res.setHeader('Content-Disposition', `attachment; filename="${mediaFile.original_filename}"`);
    
    // Stream file to response
    res.sendFile(filePath);
  } catch (error) {
    console.error('Error downloading file:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to download file',
      message: error.message
    });
  }
});

module.exports = router;
