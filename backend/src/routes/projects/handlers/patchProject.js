const pool = require('../../../database/config');
const projectUpdateService = require('../../../services/projects/ProjectUpdateService');
const cacheService = require('../../../services/CacheService');

/**
 * PATCH /api/projects/:id
 * Partially update a project. Only provided fields/sections are updated.
 */
async function patchProject(req, res) {
  const { id } = req.params;
  if (!id || isNaN(parseInt(id))) {
    return res.status(400).json({ success: false, error: 'Invalid project ID' });
  }

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const projectId = parseInt(id);
    const { rows: existing } = await client.query('SELECT id FROM projects WHERE id = $1', [projectId]);
    if (!existing.length) {
      await client.query('ROLLBACK');
      return res.status(404).json({ success: false, error: 'Project not found' });
    }

    const data = req.body || {};

    // Validate provided data subset
    const validation = projectUpdateService.validateUpdateData(data);
    if (!validation.isValid) {
      await client.query('ROLLBACK');
      return res.status(400).json({ success: false, error: 'Validation failed', errors: validation.errors });
    }

    // Update main fields if any provided
    const mainFields = ['title','category','type','description','subtitle','long_description','timeline','team','role','budget','client','cover_image_url','highlight','highlight_background_color'];
    const hasMain = mainFields.some((k) => Object.prototype.hasOwnProperty.call(data, k));
    if (hasMain) {
      await projectUpdateService.updateMainProject(client, projectId, {
        title: data.title,
        category: data.category,
        type: data.type,
        description: data.description,
        subtitle: data.subtitle,
        long_description: data.long_description,
        timeline: data.timeline,
        team: data.team,
        role: data.role,
        budget: data.budget,
        client: data.client,
        cover_image_url: data.cover_image_url,
        highlight: data.highlight,
        highlight_background_color: data.highlight_background_color,
      });
    }

    // Update sections only if present in payload
    if (Object.prototype.hasOwnProperty.call(data, 'links')) {
      await projectUpdateService.updateLinks(client, projectId, data.links || {});
    }
    if (Object.prototype.hasOwnProperty.call(data, 'technologies')) {
      await projectUpdateService.updateTechnologies(client, projectId, Array.isArray(data.technologies) ? data.technologies : []);
    }
    if (Object.prototype.hasOwnProperty.call(data, 'images')) {
      await projectUpdateService.updateImages(client, projectId, Array.isArray(data.images) ? data.images : []);
    }
    if (Object.prototype.hasOwnProperty.call(data, 'features')) {
      await projectUpdateService.updateFeatures(client, projectId, Array.isArray(data.features) ? data.features : []);
    }
    if (Object.prototype.hasOwnProperty.call(data, 'roadmap')) {
      await projectUpdateService.updateRoadmap(client, projectId, Array.isArray(data.roadmap) ? data.roadmap : []);
    }
    if (Object.prototype.hasOwnProperty.call(data, 'stats')) {
      await projectUpdateService.updateStats(client, projectId, Array.isArray(data.stats) ? data.stats : []);
    }
    if (Object.prototype.hasOwnProperty.call(data, 'metrics')) {
      await projectUpdateService.updateMetrics(client, projectId, Array.isArray(data.metrics) ? data.metrics : []);
    }
    if (Object.prototype.hasOwnProperty.call(data, 'testimonials')) {
      await projectUpdateService.updateTestimonials(client, projectId, Array.isArray(data.testimonials) ? data.testimonials : []);
    }
    if (Object.prototype.hasOwnProperty.call(data, 'skills')) {
      await projectUpdateService.updateSkills(client, projectId, Array.isArray(data.skills) ? data.skills : []);
    }

    await client.query('COMMIT');
    await cacheService.invalidateProjectsCache();
    await cacheService.invalidateProjectDetailCache(projectId);

    return res.json({ success: true, message: 'Project updated' });

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('❌ Error patching project:', error);
    return res.status(error.status || 500).json({ success: false, error: error.message || 'Failed to patch project' });
  } finally {
    client.release();
  }
}

module.exports = { patchProject };



