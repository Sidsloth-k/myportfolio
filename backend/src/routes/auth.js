const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const rateLimit = require('express-rate-limit');
const pool = require('../database/config');

// Rate limiting for login attempts
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 requests per windowMs
  message: 'Too many login attempts, please try again later.',
});

// POST - Admin login
router.post('/login', loginLimiter, async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        success: false,
        error: 'Username and password are required'
      });
    }

    // Fetch user from database
    const userResult = await pool.query(
      'SELECT id, username, password_hash, full_name, email, role, is_active FROM admin_users WHERE username = $1',
      [username]
    );

    if (userResult.rows.length === 0) {
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials'
      });
    }

    const user = userResult.rows[0];

    // Check if user is active
    if (!user.is_active) {
      return res.status(403).json({
        success: false,
        error: 'Account is deactivated'
      });
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password_hash);

    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials'
      });
    }

    // Update last login
    await pool.query(
      'UPDATE admin_users SET last_login = NOW(), updated_at = NOW() WHERE id = $1',
      [user.id]
    );

    // Generate JWT token
    const token = jwt.sign(
      { 
        id: user.id,
        username: user.username, 
        role: user.role 
      },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    // Set secure cookie
    // Use 'none' for sameSite to allow cross-origin requests (admin and backend on different domains)
    // Must use 'secure: true' when sameSite is 'none' (required by browsers)
    const isProduction = process.env.NODE_ENV === 'production';
    const sameSiteValue = isProduction ? 'none' : 'lax'; // 'none' for cross-origin in production
    const secureValue = sameSiteValue === 'none' ? true : isProduction; // Always secure when sameSite is 'none'
    
    res.cookie('adminToken', token, {
      httpOnly: true,
      secure: secureValue,
      sameSite: sameSiteValue,
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
      path: '/' // Ensure cookie is available for all paths
    });

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        token,
        user: {
          id: user.id,
          username: user.username,
          full_name: user.full_name,
          email: user.email,
          role: user.role
        }
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      error: 'Login failed',
      message: error.message
    });
  }
});

// POST - Admin logout
router.post('/logout', (req, res) => {
  try {
    // Clear cookie with same settings as login to ensure it's cleared properly
    const isProduction = process.env.NODE_ENV === 'production';
    const sameSiteValue = isProduction ? 'none' : 'lax';
    const secureValue = sameSiteValue === 'none' ? true : isProduction;
    
    res.clearCookie('adminToken', {
      httpOnly: true,
      secure: secureValue,
      sameSite: sameSiteValue,
      path: '/'
    });
    
    res.json({
      success: true,
      message: 'Logout successful'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Logout failed',
      message: error.message
    });
  }
});

// Verify admin token
router.get('/verify', async (req, res) => {
  try {
    const token = req.cookies.adminToken || req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    // Verify JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');

    // Fetch user from database to ensure they still exist and are active
    const userResult = await pool.query(
      'SELECT id, username, full_name, email, role, is_active FROM admin_users WHERE id = $1',
      [decoded.id]
    );

    if (userResult.rows.length === 0 || !userResult.rows[0].is_active) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    const user = userResult.rows[0];

    res.json({ 
      valid: true, 
      user: {
        id: user.id,
        username: user.username,
        full_name: user.full_name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
});

module.exports = router;