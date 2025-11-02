const projectUpdateService = require('../../../services/projects/ProjectUpdateService');
const cacheService = require('../../../services/CacheService');

/**
 * PUT /api/projects/:id
 * Update a project with full data
 */
async function updateProject(req, res) {
  try {
    const { id } = req.params;

    if (!id || isNaN(parseInt(id))) {
      return res.status(400).json({
        success: false,
        error: 'Invalid project ID',
        details: 'Project ID must be a valid number'
      });
    }

    const result = await projectUpdateService.updateProject(parseInt(id), req.body);

    if (result.success) {
      // Invalidate cache after updating project
      await cacheService.invalidateProjectsCache();
      await cacheService.invalidateProjectDetailCache(id);

      res.json({
        success: true,
        message: result.message
      });
    } else {
      res.status(result.status || 404).json({
        success: false,
        error: result.message,
        errors: result.errors,
        details: result.details
      });
    }

  } catch (error) {
    console.error('❌ Error updating project:', error);
    res.status(error.status || 500).json({
      success: false,
      error: error.message || 'Failed to update project',
      details: error.details || error.message,
      sql: error.sql || undefined,
      constraint: error.constraint || undefined,
      code: error.code || undefined,
      projectId: error.projectId || req.params.id
    });
  }
}

module.exports = {
  updateProject
};



