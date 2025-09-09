const express = require('express');
const router = express.Router();

// Mock admin credentials (in real app, this would use proper authentication)
const adminCredentials = {
  username: 'admin',
  password: 'detective2024'
};

// POST - Admin login
router.post('/login', (req, res) => {
  try {
    const { username, password } = req.body;
    
    if (username === adminCredentials.username && password === adminCredentials.password) {
      res.json({
        success: true,
        message: 'Login successful',
        data: {
          token: 'mock-jwt-token-' + Date.now(),
          user: { username, role: 'admin' }
        }
      });
    } else {
      res.status(401).json({
        success: false,
        error: 'Invalid credentials'
      });
    }
  } catch (error) {
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

module.exports = router; 