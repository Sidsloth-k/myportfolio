const projectService = require('../../../services/projects/ProjectService');
const cacheService = require('../../../services/CacheService');

/**
 * GET /api/projects/categories
 * Retrieve project categories for filtering
 */
async function getCategories(req, res) {
  try {
    const result = await projectService.getCategories();

    if (result.success) {
      res.json({
        success: true,
        data: result.data
      });
    } else {
      res.status(result.status || 500).json({
        success: false,
        error: result.message,
        details: result.details
      });
    }

  } catch (error) {
    console.error('❌ Error fetching project categories:', error);
    res.status(error.status || 500).json({
      success: false,
      error: error.message || 'Failed to retrieve project categories',
      details: error.details || error.message,
      sql: error.sql || undefined
    });
  }
}

/**
 * POST /api/projects/categories
 * Create a new project category
 */
async function createCategory(req, res) {
  try {
    const result = await projectService.createCategory(req.body.name);

    if (result.success) {
      // Invalidate cache after creating category
      await cacheService.invalidateProjectsCache();

      res.json({
        success: true,
        message: result.message,
        data: result.data
      });
    } else {
      res.status(result.status || 400).json({
        success: false,
        error: result.message,
        details: result.details
      });
    }

  } catch (error) {
    console.error('❌ Error creating category:', error);
    res.status(error.status || 500).json({
      success: false,
      error: error.message || 'Failed to create category',
      details: error.details || error.message,
      sql: error.sql || undefined,
      categoryName: error.categoryName || req.body.name
    });
  }
}

/**
 * GET /api/projects/types
 * Retrieve project types for filtering
 */
async function getTypes(req, res) {
  try {
    const result = await projectService.getTypes();

    if (result.success) {
      res.json({
        success: true,
        data: result.data
      });
    } else {
      res.status(result.status || 500).json({
        success: false,
        error: result.message,
        details: result.details
      });
    }

  } catch (error) {
    console.error('❌ Error fetching project types:', error);
    res.status(error.status || 500).json({
      success: false,
      error: error.message || 'Failed to retrieve project types',
      details: error.details || error.message,
      sql: error.sql || undefined
    });
  }
}

module.exports = {
  getCategories,
  createCategory,
  getTypes
};



