const pool = require('../../../database/config');
const cacheService = require('../../../services/CacheService');

/**
 * DELETE /api/projects/:id
 * Soft delete a project
 */
async function deleteProject(req, res) {
  try {
    const { id } = req.params;

    if (!id || isNaN(parseInt(id))) {
      return res.status(400).json({
        success: false,
        error: 'Invalid project ID',
        details: 'Project ID must be a valid number'
      });
    }

    const { rowCount } = await pool.query(
      `UPDATE projects SET is_active = FALSE, updated_at = NOW() WHERE id = $1`,
      [id]
    );

    if (!rowCount || rowCount === 0) {
      return res.status(404).json({
        success: false,
        error: 'Project not found',
        details: `No project found with ID: ${id}`
      });
    }

    // Invalidate cache after deleting project
    await cacheService.invalidateProjectsCache();
    await cacheService.invalidateProjectDetailCache(id);

    res.json({
      success: true,
      message: 'Project deleted successfully',
      details: `Project ${id} has been soft deleted (marked as inactive)`
    });

  } catch (error) {
    console.error('❌ Error deleting project:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete project',
      details: error.message,
      sql: error.sql || undefined,
      projectId: req.params.id
    });
  }
}

module.exports = {
  deleteProject
};

