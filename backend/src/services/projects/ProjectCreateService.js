const pool = require('../../database/config');
const cacheService = require('../CacheService');

/**
 * Project Create Service
 * Handles project creation with all related data
 */
class ProjectCreateService {
  /**
   * Validate project creation data
   */
  validateProjectData(data) {
    const errors = [];

    if (!data.title || typeof data.title !== 'string' || data.title.trim().length === 0) {
      errors.push('Title is required and must be a non-empty string');
    }
    if (!data.category || typeof data.category !== 'string' || data.category.trim().length === 0) {
      errors.push('Category is required and must be a non-empty string');
    }
    if (!data.type || typeof data.type !== 'string' || data.type.trim().length === 0) {
      errors.push('Type is required and must be a non-empty string');
    }
    if (!data.description || typeof data.description !== 'string' || data.description.trim().length === 0) {
      errors.push('Description is required and must be a non-empty string');
    }

    // Validate URLs if provided
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
   * Create a new project with all related data
   */
  async createProject(projectData) {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      // Validate required fields
      const validation = this.validateProjectData(projectData);
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

      // Insert main project
      const { rows: projectRows } = await client.query(
        `INSERT INTO projects (title, category, type, description, subtitle, long_description,
           timeline, team, role, budget, client, cover_image_url, highlight, highlight_background_color)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
         RETURNING id`,
        [
          title, category, type, description,
          subtitle || null, long_description || null, timeline || null, team || null,
          role || null, budget || null, projectClient || null, cover_image_url || null, highlight || null, highlight_background_color || null
        ]
      );

      const projectId = projectRows[0].id;

      // Insert related data
      await this.insertLinks(client, projectId, links);
      await this.insertTechnologies(client, projectId, technologies);
      await this.insertImages(client, projectId, images);
      await this.insertFeatures(client, projectId, features);
      await this.insertRoadmap(client, projectId, roadmap);
      await this.insertStats(client, projectId, stats);
      await this.insertMetrics(client, projectId, metrics);
      await this.insertTestimonials(client, projectId, testimonials);
      await this.insertSkills(client, projectId, skills);

      await client.query('COMMIT');

      return {
        success: true,
        message: 'Project created successfully',
        data: { id: projectId }
      };

    } catch (error) {
      await client.query('ROLLBACK');
      console.error('❌ Error creating project:', error);
      throw {
        status: 500,
        message: 'Failed to create project',
        details: error.message,
        sql: error.sql,
        constraint: error.constraint,
        code: error.code
      };
    } finally {
      client.release();
    }
  }

  async insertLinks(client, projectId, links) {
    if (!links) return;
    
    try {
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
          links.live || null,
          links.github || null,
          links.documentation || null,
          links.case_study || null,
          links.demo || null
        ]
      );
    } catch (error) {
      throw new Error(`Failed to insert links: ${error.message}`);
    }
  }

  async insertTechnologies(client, projectId, technologies) {
    if (!Array.isArray(technologies) || technologies.length === 0) return;

    try {
      for (const tech of technologies) {
        if (tech.skill_id) {
          await client.query(
            `INSERT INTO project_technologies (project_id, skill_id, level)
             VALUES ($1, $2, $3)
             ON CONFLICT (project_id, skill_id) DO UPDATE SET level = EXCLUDED.level`,
            [projectId, tech.skill_id, tech.level || null]
          );
        }
      }
    } catch (error) {
      throw new Error(`Failed to insert technologies: ${error.message}`);
    }
  }

  async insertImages(client, projectId, images) {
    if (!Array.isArray(images) || images.length === 0) return;

    try {
      for (const img of images) {
        if (img.url && img.caption && img.type) {
          await client.query(
            `INSERT INTO project_images (project_id, url, caption, type, "order", alt)
             VALUES ($1, $2, $3, $4, $5, $6)`,
            [projectId, img.url, img.caption, img.type, img.order || 0, img.alt_text || img.alt || null]
          );
        }
      }
    } catch (error) {
      throw new Error(`Failed to insert images: ${error.message}`);
    }
  }

  async insertFeatures(client, projectId, features) {
    if (!Array.isArray(features) || features.length === 0) return;

    try {
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
    } catch (error) {
      throw new Error(`Failed to insert features: ${error.message}`);
    }
  }

  async insertRoadmap(client, projectId, roadmap) {
    if (!Array.isArray(roadmap) || roadmap.length === 0) return;

    try {
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
    } catch (error) {
      throw new Error(`Failed to insert roadmap phases: ${error.message}`);
    }
  }

  async insertStats(client, projectId, stats) {
    if (!Array.isArray(stats) || stats.length === 0) return;

    try {
      for (const stat of stats) {
        if (stat.key && stat.value) {
          await client.query(
            `INSERT INTO project_stats (project_id, key, value, is_list_stat, "order")
             VALUES ($1, $2, $3, $4, $5)`,
            [projectId, stat.key, stat.value, stat.is_list_stat || false, stat.order || 0]
          );
        }
      }
    } catch (error) {
      throw new Error(`Failed to insert stats: ${error.message}`);
    }
  }

  async insertMetrics(client, projectId, metrics) {
    if (!Array.isArray(metrics) || metrics.length === 0) return;

    try {
      for (const metric of metrics) {
        if (metric.key && metric.value) {
          await client.query(
            `INSERT INTO project_metrics (project_id, key, value, "order")
             VALUES ($1, $2, $3, $4)`,
            [projectId, metric.key, metric.value, metric.order || 0]
          );
        }
      }
    } catch (error) {
      throw new Error(`Failed to insert metrics: ${error.message}`);
    }
  }

  async insertTestimonials(client, projectId, testimonials) {
    if (!Array.isArray(testimonials) || testimonials.length === 0) return;

    try {
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
    } catch (error) {
      throw new Error(`Failed to insert testimonials: ${error.message}`);
    }
  }

  async insertSkills(client, projectId, skills) {
    if (!Array.isArray(skills) || skills.length === 0) return;

    try {
      for (const skill of skills) {
        if (skill.skill_id) {
          await client.query(
            `INSERT INTO skill_projects (skill_id, project_id, contribution, complexity)
             VALUES ($1, $2, $3, $4)
             ON CONFLICT (skill_id, project_id) DO UPDATE SET
               contribution = EXCLUDED.contribution,
               complexity = EXCLUDED.complexity`,
            [skill.skill_id, projectId, skill.contribution || null, skill.complexity || null]
          );
        }
      }
    } catch (error) {
      throw new Error(`Failed to insert skills: ${error.message}`);
    }
  }
}

module.exports = new ProjectCreateService();



