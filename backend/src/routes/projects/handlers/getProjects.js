const { LRUCache } = require('lru-cache');
const projectService = require('../../../services/projects/ProjectService');

const cache = new LRUCache({
  max: 100,
  ttl: 1000 * 60, // 1 minute
});

/**
 * GET /api/projects
 * Retrieve all projects with full details
 */
async function getAllProjects(req, res) {
  try {
    const cacheKey = 'projects_full_list';
    const cached = cache.get(cacheKey);
    if (cached) {
      return res.json({ success: true, data: cached, cached: true });
    }

    const result = await projectService.getAllProjects();
    
    if (result.success) {
      cache.set(cacheKey, result.data);
      res.json({ success: true, data: result.data });
    } else {
      res.status(result.status || 500).json({
        success: false,
        error: result.message,
        details: result.details
      });
    }

  } catch (error) {
    console.error('❌ Error fetching projects:', error);
    res.status(error.status || 500).json({
      success: false,
      error: error.message || 'Failed to retrieve projects',
      details: error.details || error.message,
      sql: error.sql || undefined
    });
  }
}

/**
 * GET /api/projects/:id
 * Retrieve a single project with full details
 */
async function getProjectById(req, res) {
  try {
    const { id } = req.params;
    
    if (!id || isNaN(parseInt(id))) {
      return res.status(400).json({
        success: false,
        error: 'Invalid project ID',
        details: 'Project ID must be a valid number'
      });
    }

    const cacheKey = `project_full_${id}`;
    const cached = cache.get(cacheKey);
    if (cached) {
      return res.json({ success: true, data: cached, cached: true });
    }

    const result = await projectService.getProjectById(parseInt(id));

    if (result.success) {
      cache.set(cacheKey, result.data);
      res.json({ success: true, data: result.data });
    } else {
      res.status(result.status || 404).json({
        success: false,
        error: result.message,
        details: result.details
      });
    }

  } catch (error) {
    console.error('❌ Error fetching project:', error);
    res.status(error.status || 500).json({
      success: false,
      error: error.message || 'Failed to retrieve project',
      details: error.details || error.message,
      sql: error.sql || undefined,
      projectId: error.projectId || req.params.id
    });
  }
}

module.exports = {
  getAllProjects,
  getProjectById
};




