const express = require('express');
const router = express.Router();

// GET - Retrieve analytics data
router.get('/', (req, res) => {
  try {
    // Mock analytics data
    const analyticsData = {
      pageViews: [
        { id: "pv-1", page: "home", views: 15420, uniqueViews: 3247, date: "2024-01-15" }
      ],
      userInteractions: [
        { id: "ui-1", type: "click", element: "project-card", count: 856, date: "2024-01-15" }
      ]
    };
    
    res.json({
      success: true,
      data: analyticsData
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve analytics data',
      message: error.message
    });
  }
});

module.exports = router; 