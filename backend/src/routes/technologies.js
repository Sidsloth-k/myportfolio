const express = require('express');
const router = express.Router();
const Technology = require('../models/technology');
const { auth } = require('../auth/middleware');

// Apply authentication middleware to all routes
router.use(auth);

// GET /api/technologies - Get all technologies
router.get('/', async (req, res) => {
  try {
    console.log('🔍 GET /api/technologies called');
    const technologies = await Technology.getAllTechnologies();
    console.log('📊 Technologies from model:', technologies);
    console.log('📊 Technologies type:', typeof technologies);
    console.log('📊 Technologies length:', Array.isArray(technologies) ? technologies.length : 'not an array');
    
    const response = {
      success: true,
      data: technologies,
      message: 'Technologies retrieved successfully'
    };
    
    console.log('📤 Sending response:', JSON.stringify(response, null, 2));
    res.json(response);
  } catch (error) {
    console.error('Error getting technologies:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve technologies',
      message: error.message
    });
  }
});

// GET /api/technologies/:id - Get technology by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const technology = await Technology.getTechnologyById(id);
    
    if (!technology) {
      return res.status(404).json({
        success: false,
        error: 'Technology not found'
      });
    }
    
    res.json({
      success: true,
      data: technology,
      message: 'Technology retrieved successfully'
    });
  } catch (error) {
    console.error('Error getting technology by ID:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve technology',
      message: error.message
    });
  }
});

// POST /api/technologies - Create new technology
router.post('/', async (req, res) => {
  try {
    const technologyData = req.body;
    
    // Validate required fields
    if (!technologyData.name || !technologyData.name.trim()) {
      return res.status(400).json({
        success: false,
        error: 'Technology name is required'
      });
    }
    
    // Check if technology with same name already exists
    const existingTech = await Technology.getTechnologyByName(technologyData.name.trim());
    if (existingTech) {
      return res.status(409).json({
        success: false,
        error: 'Technology with this name already exists'
      });
    }
    
    // Create the technology
    const result = await Technology.createTechnology(technologyData);
    
    if (result.success) {
      // Get the created technology
      const createdTech = await Technology.getTechnologyById(result.id);
      
      res.status(201).json({
        success: true,
        data: createdTech,
        message: 'Technology created successfully'
      });
    } else {
      res.status(400).json({
        success: false,
        error: result.error
      });
    }
  } catch (error) {
    console.error('Error creating technology:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create technology',
      message: error.message
    });
  }
});

// PUT /api/technologies/:id - Update technology
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const technologyData = req.body;
    
    // Validate required fields
    if (!technologyData.name || !technologyData.name.trim()) {
      return res.status(400).json({
        success: false,
        error: 'Technology name is required'
      });
    }
    
    // Check if technology exists
    const existingTech = await Technology.getTechnologyById(id);
    if (!existingTech) {
      return res.status(404).json({
        success: false,
        error: 'Technology not found'
      });
    }
    
    // Check if name is being changed and if new name already exists
    if (technologyData.name !== existingTech.name) {
      const techWithNewName = await Technology.getTechnologyByName(technologyData.name.trim());
      if (techWithNewName && techWithNewName.id !== id) {
        return res.status(409).json({
          success: false,
          error: 'Technology with this name already exists'
        });
      }
    }
    
    // Update the technology
    const result = await Technology.updateTechnology(id, technologyData);
    
    if (result.success) {
      // Get the updated technology
      const updatedTech = await Technology.getTechnologyById(id);
      
      res.json({
        success: true,
        data: updatedTech,
        message: 'Technology updated successfully'
      });
    } else {
      res.status(400).json({
        success: false,
        error: result.error
      });
    }
  } catch (error) {
    console.error('Error updating technology:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update technology',
      message: error.message
    });
  }
});

// DELETE /api/technologies/:id - Delete technology (soft delete)
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if technology exists
    const existingTech = await Technology.getTechnologyById(id);
    if (!existingTech) {
      return res.status(404).json({
        success: false,
        error: 'Technology not found'
      });
    }
    
    // Delete the technology
    const result = await Technology.deleteTechnology(id);
    
    if (result.success) {
      res.json({
        success: true,
        message: 'Technology deleted successfully'
      });
    } else {
      res.status(400).json({
        success: false,
        error: result.error
      });
    }
  } catch (error) {
    console.error('Error deleting technology:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete technology',
      message: error.message
    });
  }
});

// GET /api/technologies/category/:category - Get technologies by category
router.get('/category/:category', async (req, res) => {
  try {
    const { category } = req.params;
    const technologies = await Technology.getTechnologiesByCategory(category);
    
    res.json({
      success: true,
      data: technologies,
      message: `Technologies in category '${category}' retrieved successfully`
    });
  } catch (error) {
    console.error('Error getting technologies by category:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve technologies by category',
      message: error.message
    });
  }
});

// GET /api/technologies/search/:term - Search technologies
router.get('/search/:term', async (req, res) => {
  try {
    const { term } = req.params;
    const technologies = await Technology.searchTechnologies(term);
    
    res.json({
      success: true,
      data: technologies,
      message: `Technologies matching '${term}' retrieved successfully`
    });
  } catch (error) {
    console.error('Error searching technologies:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to search technologies',
      message: error.message
    });
  }
});

// GET /api/technologies/stats/count - Get technology count
router.get('/stats/count', async (req, res) => {
  try {
    const count = await Technology.getTechnologyCount();
    
    res.json({
      success: true,
      data: { count },
      message: 'Technology count retrieved successfully'
    });
  } catch (error) {
    console.error('Error getting technology count:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get technology count',
      message: error.message
    });
  }
});

module.exports = router;
