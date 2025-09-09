const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const pool = require('../database/config');
const FileUploadService = require('../services/FileUploadService');
const { auth } = require('../auth/middleware');
const multer = require('multer');
const path = require('path');

// Configure multer for memory storage
const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  }
});

const fileUploadService = new FileUploadService();

// Validation middleware
const validateMediaFile = [
  body('alt_text').optional().isLength({ max: 255 }).withMessage('Alt text must be less than 255 characters'),
  body('caption').optional().isLength({ max: 500 }).withMessage('Caption must be less than 500 characters'),
  body('tags').optional().isArray().withMessage('Tags must be an array')
];

// GET - Retrieve all media files with pagination
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 20, search, tags, mime_type } = req.query;
    const offset = (page - 1) * limit;

    let whereClause = 'WHERE mf.is_active = 1';
    const params = [];

    if (search) {
      whereClause += ' AND (mf.original_filename LIKE ? OR mf.alt_text LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }

    if (mime_type) {
      whereClause += ' AND mf.mime_type = ?';
      params.push(mime_type);
    }

    // Get total count
    const countQuery = `SELECT COUNT(*) as count FROM media_files mf ${whereClause}`;
    const [countResult] = await pool.query(countQuery, params);
    const totalCount = parseInt(countResult[0].count);

    // Get media files
    const mediaQuery = `
      SELECT 
        mf.*,
        u.username as uploaded_by_name
      FROM media_files mf
      LEFT JOIN users u ON mf.uploaded_by = u.id
      ${whereClause}
      ORDER BY mf.created_at DESC 
      LIMIT ? OFFSET ?
    `;
    
    const [mediaFiles] = await pool.query(mediaQuery, [...params, limit, offset]);

    res.json({
      success: true,
      data: {
        files: mediaFiles,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: totalCount,
          pages: Math.ceil(totalCount / limit)
        }
      }
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
    const mediaFile = db.prepare(`
      SELECT 
        mf.*,
        u.username as uploaded_by_name
      FROM media_files mf
      LEFT JOIN users u ON mf.uploaded_by = u.id
      WHERE mf.id = ? AND mf.is_active = 1
    `).get(id);

    if (!mediaFile) {
      return res.status(404).json({
        success: false,
        error: 'Media file not found'
      });
    }

    res.json({
      success: true,
      data: mediaFile
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
router.post('/', auth, upload.single('file'), validateMediaFile, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: errors.array()
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: 'No file provided'
      });
    }

    // Save file using service
    const fileInfo = await fileUploadService.saveFile(req.file, {
      alt_text: req.body.alt_text,
      caption: req.body.caption,
      tags: req.body.tags ? JSON.parse(req.body.tags) : []
    });

    // Save file info to database
    const fileId = require('crypto').randomUUID();
    const insertStmt = db.prepare(`
      INSERT INTO media_files (
        id, filename, original_filename, file_path, file_size, mime_type,
        alt_text, caption, tags, uploaded_by
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    
    insertStmt.run(
      fileId,
      fileInfo.filename,
      fileInfo.original_filename,
      fileInfo.file_path,
      fileInfo.file_size,
      fileInfo.mime_type,
      fileInfo.alt_text,
      fileInfo.caption,
      JSON.stringify(fileInfo.tags),
      req.user?.id || null
    );

    const savedFile = db.prepare('SELECT * FROM media_files WHERE id = ?').get(fileId);

    res.status(201).json({
      success: true,
      message: 'File uploaded successfully',
      data: {
        ...savedFile,
        url: fileUploadService.getFileUrl(fileInfo.filename)
      }
    });
  } catch (error) {
    console.error('Error uploading file:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to upload file',
      message: error.message
    });
  }
});

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

    const updateStmt = db.prepare(`
      UPDATE media_files 
      SET alt_text = ?, caption = ?, tags = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ? AND is_active = 1
    `);
    
    const result = updateStmt.run(
      alt_text || '',
      caption || '',
      JSON.stringify(tags || []),
      id
    );

    if (result.changes === 0) {
      return res.status(404).json({
        success: false,
        error: 'Media file not found'
      });
    }

    const updatedFile = db.prepare('SELECT * FROM media_files WHERE id = ?').get(id);

    res.json({
      success: true,
      message: 'Media file updated successfully',
      data: updatedFile
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

    const result = db.prepare(`
      UPDATE media_files 
      SET is_active = 0, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(id);

    if (result.changes === 0) {
      return res.status(404).json({
        success: false,
        error: 'Media file not found'
      });
    }

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
    const mediaFile = db.prepare('SELECT * FROM media_files WHERE id = ? AND is_active = 1').get(id);

    if (!mediaFile) {
      return res.status(404).json({
        success: false,
        error: 'Media file not found'
      });
    }

    // Check if file exists on disk
    const fileInfo = await fileUploadService.getFileInfo(mediaFile.filename);
    if (!fileInfo.exists) {
      return res.status(404).json({
        success: false,
        error: 'File not found on disk'
      });
    }

    // Set headers for download
    res.setHeader('Content-Type', mediaFile.mime_type);
    res.setHeader('Content-Disposition', `attachment; filename="${mediaFile.original_filename}"`);
    
    // Stream file to response
    const filePath = path.join(__dirname, '../../uploads', mediaFile.filename);
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
