const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const pool = require('../database/config');

// Validation middleware
const validateContactSubmission = [
  body('name').isLength({ min: 1, max: 255 }).withMessage('Name must be between 1 and 255 characters'),
  body('email').isEmail().withMessage('Email must be a valid email address'),
  body('subject').optional().isLength({ max: 255 }).withMessage('Subject must be less than 255 characters'),
  body('message').isLength({ min: 1, max: 2000 }).withMessage('Message must be between 1 and 2000 characters'),
  body('case_type').optional().isLength({ max: 100 }).withMessage('Case type must be less than 100 characters'),
  body('urgency_level').optional().isIn(['low', 'medium', 'high', 'urgent']).withMessage('Invalid urgency level')
];

// GET - Retrieve all contact submissions
router.get('/submissions', async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;

    const countResult = await pool.query('SELECT COUNT(*) as total FROM contact_submissions');
    const total = parseInt(countResult.rows[0].total);

    const result = await pool.query(`
      SELECT * FROM contact_submissions 
      ORDER BY created_at DESC 
      LIMIT $1 OFFSET $2
    `, [parseInt(limit), offset]);
    
    const rows = result.rows || result;

    res.json({
      success: true,
      data: rows,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Error fetching contact submissions:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve contact submissions',
      message: error.message
    });
  }
});

// POST - Create new contact submission
router.post('/', validateContactSubmission, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const { v4: uuidv4 } = require('uuid');
    const {
      name,
      email,
      subject,
      message,
      caseType = 'general',
      urgency = 'medium'
    } = req.body;

    // Map frontend field names to backend field names
    const case_type = Array.isArray(caseType) ? caseType.join(', ') : caseType;
    const urgency_level = urgency;

    const submissionId = uuidv4();

    await pool.query(`
      INSERT INTO contact_submissions (
        id, name, email, subject, message, case_type, urgency_level, status, is_read
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, 'new', FALSE)
    `, [submissionId, name, email, subject, message, case_type, urgency_level]);

    const newSubmissionResult = await pool.query(
      'SELECT * FROM contact_submissions WHERE id = $1',
      [submissionId]
    );
    
    const newSubmission = newSubmissionResult.rows || newSubmissionResult;

    res.status(201).json({
      success: true,
      message: 'Contact submission created successfully',
      data: newSubmission[0]
    });

  } catch (error) {
    console.error('Error creating contact submission:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create contact submission',
      message: error.message
    });
  }
});

// PUT - Update contact submission status
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { status, is_read } = req.body;

    const result = await pool.query(`
      UPDATE contact_submissions 
      SET status = $1, is_read = $2, updated_at = NOW()
      WHERE id = $3
    `, [status, is_read ? 1 : 0, id]);

    if (result.rowCount === 0) {
      return res.status(404).json({
        success: false,
        error: 'Contact submission not found'
      });
    }

    const updatedResult = await pool.query(
      'SELECT * FROM contact_submissions WHERE id = $1',
      [id]
    );
    
    const updated = updatedResult.rows || updatedResult;

    res.json({
      success: true,
      message: 'Contact submission updated successfully',
      data: updated[0]
    });

  } catch (error) {
    console.error('Error updating contact submission:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update contact submission',
      message: error.message
    });
  }
});

// GET - Retrieve contact information
router.get('/info', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT key, label, value, contact_values, description, icon_key, display_order, contact_type
      FROM contact_info 
      WHERE is_active = TRUE 
      ORDER BY display_order ASC
    `);
    
    const rows = result.rows || result;

    res.json({
      success: true,
      data: rows
    });

  } catch (error) {
    console.error('Error fetching contact info:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve contact information',
      message: error.message
    });
  }
});

// PUT - Update contact information
router.put('/info/:key', async (req, res) => {
  try {
    const { key } = req.params;
    const { label, value, contact_values, description, icon_key, display_order } = req.body;

    const result = await pool.query(`
      UPDATE contact_info 
      SET label = $1, value = $2, contact_values = $3, description = $4, icon_key = $5, display_order = $6, updated_at = NOW()
      WHERE key = $7
    `, [label, value, contact_values, description, icon_key, display_order, key]);

    if (result.rowCount === 0) {
      return res.status(404).json({
        success: false,
        error: 'Contact info not found'
      });
    }

    const updatedResult = await pool.query(
      'SELECT * FROM contact_info WHERE key = $1',
      [key]
    );
    
    const updated = updatedResult.rows || updatedResult;

    res.json({
      success: true,
      message: 'Contact info updated successfully',
      data: updated[0]
    });

  } catch (error) {
    console.error('Error updating contact info:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update contact information',
      message: error.message
    });
  }
});

module.exports = router;