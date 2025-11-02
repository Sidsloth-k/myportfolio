const projectCreateService = require('../../../services/projects/ProjectCreateService');
const cacheService = require('../../../services/CacheService');

/**
 * POST /api/projects
 * Create a new project with full data (admin only)
 */
async function createProject(req, res) {
  try {
    const result = await projectCreateService.createProject(req.body);

    if (result.success) {
      // Invalidate cache after creating project
      await cacheService.invalidateProjectsCache();

      res.status(201).json({
        success: true,
        message: result.message,
        data: result.data
      });
    } else {
      res.status(result.status || 400).json({
        success: false,
        error: result.message,
        errors: result.errors,
        details: result.details
      });
    }

  } catch (error) {
    console.error('❌ Error creating project:', error);
    res.status(error.status || 500).json({
      success: false,
      error: error.message || 'Failed to create project',
      details: error.details || error.message,
      sql: error.sql || undefined,
      constraint: error.constraint || undefined,
      code: error.code || undefined
    });
  }
}

module.exports = {
  createProject
};



