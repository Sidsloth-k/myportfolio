const pool = require('../../database/config');
const cacheService = require('../CacheService');

/**
 * Project Update Service
 * Handles project updates with all related data
 */
class ProjectUpdateService {
  /**
   * Validate project update data
   */
  validateUpdateData(data) {
    const errors = [];

    // If title is provided, validate it
    if (data.title !== undefined && (!data.title || typeof data.title !== 'string' || data.title.trim().length === 0)) {
      errors.push('Title must be a non-empty string if provided');
    }
    if (data.category !== undefined && (!data.category || typeof data.category !== 'string' || data.category.trim().length === 0)) {
      errors.push('Category must be a non-empty string if provided');
    }
    if (data.type !== undefined && (!data.type || typeof data.type !== 'string' || data.type.trim().length === 0)) {
      errors.push('Type must be a non-empty string if provided');
    }
    if (data.description !== undefined && (!data.description || typeof data.description !== 'string' || data.description.trim().length === 0)) {
      errors.push('Description must be a non-empty string if provided');
    }

    // Validate URLs
    const urlFields = {
      'cover_image_url': data.cover_image_url,
      'links.live': data.links?.live,
      'links.github': data.links?.github,
      'links.documentation': data.links?.documentation,
      'links.case_study': data.links?.case_study,
      'links.demo': data.links?.demo
    };

    for (const [field, url] of Object.entries(urlFields)) {
      if (url && typeof url === 'string' && url.trim().length > 0) {
        try {
          new URL(url);
        } catch {
          errors.push(`${field} must be a valid URL`);
        }
      }
    }

    // Validate testimonials ratings
    if (Array.isArray(data.testimonials)) {
      data.testimonials.forEach((tm, index) => {
        if (tm.rating !== undefined) {
          const rating = parseInt(tm.rating);
          if (isNaN(rating) || rating < 1 || rating > 5) {
            errors.push(`Testimonial ${index + 1}: Rating must be between 1 and 5`);
          }
        }
      });
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Update a project with all related data
   */
  async updateProject(projectId, projectData) {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      // Check if project exists
      const { rows: existingProject } = await client.query(
        'SELECT id, is_active FROM projects WHERE id = $1',
        [projectId]
      );

      if (!existingProject.length) {
        await client.query('ROLLBACK');
        return {
          success: false,
          status: 404,
          message: 'Project not found',
          details: `No project found with ID: ${projectId}`
        };
      }

      // Validate update data
      const validation = this.validateUpdateData(projectData);
      if (!validation.isValid) {
        await client.query('ROLLBACK');
        return {
          success: false,
          status: 400,
          message: 'Validation failed',
          errors: validation.errors,
          details: 'Please fix the validation errors before submitting'
        };
      }

      const {
        title, category, type, description,
        subtitle, long_description, timeline, team, role, budget, client: projectClient,
        cover_image_url, highlight, highlight_background_color,
        links, technologies, images, features, roadmap, stats, metrics, testimonials, skills
      } = projectData;

      // Update main project fields - only update if provided
      if (title !== undefined || category !== undefined || type !== undefined || description !== undefined) {
        await this.updateMainProject(client, projectId, {
          title, category, type, description,
          subtitle, long_description, timeline, team, role, budget,
          client: projectClient, cover_image_url, highlight, highlight_background_color
        });
      }

      // Update related data - always provide empty arrays if undefined to clear existing data
      try {
        await this.updateLinks(client, projectId, links || {});
        await this.updateTechnologies(client, projectId, technologies || []);
        await this.updateImages(client, projectId, images || []);
        await this.updateFeatures(client, projectId, features || []);
        await this.updateRoadmap(client, projectId, roadmap || []);
        await this.updateStats(client, projectId, stats || []);
        await this.updateMetrics(client, projectId, metrics || []);
        await this.updateTestimonials(client, projectId, testimonials || []);
        await this.updateSkills(client, projectId, skills || []);
      } catch (relatedError) {
        console.error('Error updating related data:', relatedError);
        throw new Error(`Failed to update related data: ${relatedError.message}`);
      }

      await client.query('COMMIT');

      return {
        success: true,
        message: 'Project updated successfully'
      };

    } catch (error) {
      await client.query('ROLLBACK');
      console.error('❌ Error updating project:', error);
      console.error('Error stack:', error.stack);
      console.error('Project data:', JSON.stringify(projectData, null, 2));
      throw {
        status: 500,
        message: 'Failed to update project',
        details: error.message || 'Unknown error occurred',
        sql: error.sql,
        constraint: error.constraint,
        code: error.code,
        projectId,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      };
    } finally {
      client.release();
    }
  }

  async updateMainProject(client, projectId, fields) {
    const updateFields = [];
    const updateValues = [];
    let paramIndex = 1;

    if (fields.title !== undefined) { updateFields.push(`title = $${paramIndex++}`); updateValues.push(fields.title || null); }
    if (fields.category !== undefined) { updateFields.push(`category = $${paramIndex++}`); updateValues.push(fields.category || null); }
    if (fields.type !== undefined) { updateFields.push(`type = $${paramIndex++}`); updateValues.push(fields.type || null); }
    if (fields.description !== undefined) { updateFields.push(`description = $${paramIndex++}`); updateValues.push(fields.description || null); }
    if (fields.subtitle !== undefined) { updateFields.push(`subtitle = $${paramIndex++}`); updateValues.push(fields.subtitle || null); }
    if (fields.long_description !== undefined) { updateFields.push(`long_description = $${paramIndex++}`); updateValues.push(fields.long_description || null); }
    if (fields.timeline !== undefined) { updateFields.push(`timeline = $${paramIndex++}`); updateValues.push(fields.timeline || null); }
    if (fields.team !== undefined) { updateFields.push(`team = $${paramIndex++}`); updateValues.push(fields.team || null); }
    if (fields.role !== undefined) { updateFields.push(`role = $${paramIndex++}`); updateValues.push(fields.role || null); }
    if (fields.budget !== undefined) { updateFields.push(`budget = $${paramIndex++}`); updateValues.push(fields.budget || null); }
    if (fields.client !== undefined) { updateFields.push(`client = $${paramIndex++}`); updateValues.push(fields.client || null); }
    if (fields.cover_image_url !== undefined) { updateFields.push(`cover_image_url = $${paramIndex++}`); updateValues.push(fields.cover_image_url || null); }
    if (fields.highlight !== undefined) { updateFields.push(`highlight = $${paramIndex++}`); updateValues.push(fields.highlight || null); }
    if (fields.highlight_background_color !== undefined) { updateFields.push(`highlight_background_color = $${paramIndex++}`); updateValues.push(fields.highlight_background_color || null); }

    if (updateFields.length > 0) {
      updateFields.push(`updated_at = NOW()`);
      updateValues.push(projectId);
      await client.query(
        `UPDATE projects SET ${updateFields.join(', ')} WHERE id = $${paramIndex}`,
        updateValues
      );
    }
  }

  async updateLinks(client, projectId, links) {
    await client.query(
      `INSERT INTO project_links (project_id, live, github, documentation, case_study, demo)
       VALUES ($1, $2, $3, $4, $5, $6)
       ON CONFLICT (project_id) DO UPDATE SET
         live = EXCLUDED.live,
         github = EXCLUDED.github,
         documentation = EXCLUDED.documentation,
         case_study = EXCLUDED.case_study,
         demo = EXCLUDED.demo`,
      [
        projectId,
        links?.live || null,
        links?.github || null,
        links?.documentation || null,
        links?.case_study || null,
        links?.demo || null
      ]
    );
  }

  async updateTechnologies(client, projectId, technologies) {
    await client.query('DELETE FROM project_technologies WHERE project_id = $1', [projectId]);
    if (Array.isArray(technologies) && technologies.length > 0) {
      for (const tech of technologies) {
        // Skip if skill_id is missing, 0, or invalid
        if (tech.skill_id && parseInt(tech.skill_id) > 0) {
          await client.query(
            `INSERT INTO project_technologies (project_id, skill_id, level)
             VALUES ($1, $2, $3)`,
            [projectId, parseInt(tech.skill_id), tech.level || null]
          );
        }
      }
    }
  }

  async updateImages(client, projectId, images) {
    await client.query('DELETE FROM project_images WHERE project_id = $1', [projectId]);
    if (Array.isArray(images) && images.length > 0) {
      for (const img of images) {
        if (img.url && img.caption && img.type) {
          await client.query(
            `INSERT INTO project_images (project_id, url, caption, type, "order", alt)
             VALUES ($1, $2, $3, $4, $5, $6)`,
            [projectId, img.url, img.caption, img.type, img.order || 0, img.alt_text || img.alt || null]
          );
        }
      }
    }
  }

  async updateFeatures(client, projectId, features) {
    await client.query('DELETE FROM project_features WHERE project_id = $1', [projectId]);
    if (Array.isArray(features) && features.length > 0) {
      for (const feat of features) {
        if (feat.title && feat.description && feat.status) {
          await client.query(
            `INSERT INTO project_features (project_id, title, description, icon_key, status, impact, "order")
             VALUES ($1, $2, $3, $4, $5, $6, $7)`,
            [
              projectId,
              feat.title,
              feat.description,
              feat.icon_key || null,
              feat.status,
              feat.impact || null,
              feat.order || 0
            ]
          );
        }
      }
    }
  }

  async updateRoadmap(client, projectId, roadmap) {
    await client.query('DELETE FROM project_roadmap_phases WHERE project_id = $1', [projectId]);
    if (Array.isArray(roadmap) && roadmap.length > 0) {
      for (const phase of roadmap) {
        if (phase.phase && phase.description && phase.duration && phase.status) {
          await client.query(
            `INSERT INTO project_roadmap_phases (project_id, phase, description, duration, status, deliverables, challenges, solutions, "order")
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
            [
              projectId,
              phase.phase,
              phase.description,
              phase.duration,
              phase.status,
              Array.isArray(phase.deliverables) ? phase.deliverables : [],
              Array.isArray(phase.challenges) ? phase.challenges : [],
              Array.isArray(phase.solutions) ? phase.solutions : [],
              phase.order || 0
            ]
          );
        }
      }
    }
  }

  async updateStats(client, projectId, stats) {
    await client.query('DELETE FROM project_stats WHERE project_id = $1', [projectId]);
    if (Array.isArray(stats) && stats.length > 0) {
      for (const stat of stats) {
        if (stat.key && stat.value) {
          await client.query(
            `INSERT INTO project_stats (project_id, key, value, is_list_stat, "order")
             VALUES ($1, $2, $3, $4, $5)`,
            [projectId, stat.key, stat.value, stat.is_list_stat || false, stat.order || 0]
          );
        }
      }
    }
  }

  async updateMetrics(client, projectId, metrics) {
    await client.query('DELETE FROM project_metrics WHERE project_id = $1', [projectId]);
    if (Array.isArray(metrics) && metrics.length > 0) {
      for (const metric of metrics) {
        if (metric.key && metric.value) {
          await client.query(
            `INSERT INTO project_metrics (project_id, key, value, "order")
             VALUES ($1, $2, $3, $4)`,
            [projectId, metric.key, metric.value, metric.order || 0]
          );
        }
      }
    }
  }

  async updateTestimonials(client, projectId, testimonials) {
    await client.query('DELETE FROM project_testimonials WHERE project_id = $1', [projectId]);
    if (Array.isArray(testimonials) && testimonials.length > 0) {
      for (const tm of testimonials) {
        if (tm.name && tm.role && tm.company && tm.quote) {
          const rating = parseInt(tm.rating);
          if (isNaN(rating) || rating < 1 || rating > 5) {
            throw new Error(`Testimonial rating must be between 1 and 5, got: ${tm.rating}`);
          }

          await client.query(
            `INSERT INTO project_testimonials (project_id, name, role, company, quote, rating, "order")
             VALUES ($1, $2, $3, $4, $5, $6, $7)`,
            [projectId, tm.name, tm.role, tm.company, tm.quote, rating, tm.order || 0]
          );
        }
      }
    }
  }

  async updateSkills(client, projectId, skills) {
    await client.query('DELETE FROM skill_projects WHERE project_id = $1', [projectId]);
    if (Array.isArray(skills) && skills.length > 0) {
      for (const skill of skills) {
        // Skip if skill_id is missing, 0, or invalid
        if (skill.skill_id && parseInt(skill.skill_id) > 0) {
          await client.query(
            `INSERT INTO skill_projects (skill_id, project_id, contribution, complexity)
             VALUES ($1, $2, $3, $4)`,
            [parseInt(skill.skill_id), projectId, skill.contribution || null, skill.complexity || null]
          );
        }
      }
    }
  }
}

module.exports = new ProjectUpdateService();

