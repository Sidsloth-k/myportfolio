const pool = require('../../database/config');
const { normalizeTechnologies } = require('../TechnologyProficiencyService');
const ProjectQueries = require('./ProjectQueries');

/**
 * Project Service
 * Handles all business logic for project operations
 */
class ProjectService {
  /**
   * Get all active projects with full details
   */
  async getAllProjects() {
    try {
      const query = ProjectQueries.getAllProjectsQuery();
      const { rows } = await pool.query(query);

      // Normalize technology proficiency
      const enriched = rows.map(r => ({
        ...r,
        technologies: normalizeTechnologies(r.technologies || []),
      }));

      return {
        success: true,
        data: enriched
      };
    } catch (error) {
      console.error('❌ Error fetching projects:', error);
      throw {
        status: 500,
        message: 'Failed to retrieve projects',
        details: error.message,
        sql: error.sql
      };
    }
  }

  /**
   * Get a single project by ID with full details
   */
  async getProjectById(projectId) {
    try {
      const query = ProjectQueries.getProjectByIdQuery();
      const { rows } = await pool.query(query, [projectId]);

      if (!rows || rows.length === 0) {
        return {
          success: false,
          status: 404,
          message: 'Project not found',
          details: `No project found with ID: ${projectId}`
        };
      }

      const project = rows[0];
      
      // Normalize technology proficiency
      const enriched = {
        ...project,
        technologies: normalizeTechnologies(project.technologies || []),
      };

      return {
        success: true,
        data: enriched
      };
    } catch (error) {
      console.error('❌ Error fetching project:', error);
      throw {
        status: 500,
        message: 'Failed to retrieve project',
        details: error.message,
        sql: error.sql,
        projectId
      };
    }
  }

  /**
   * Get project categories
   */
  async getCategories() {
    try {
      const query = ProjectQueries.getCategoriesQuery();
      const { rows: categories } = await pool.query(query);

      const categoryData = categories.map(cat => ({
        id: cat.category.toLowerCase(),
        name: cat.category,
        count: parseInt(cat.project_count),
        label: cat.category
      }));

      return {
        success: true,
        data: categoryData
      };
    } catch (error) {
      console.error('❌ Error fetching project categories:', error);
      throw {
        status: 500,
        message: 'Failed to retrieve project categories',
        details: error.message,
        sql: error.sql
      };
    }
  }

  /**
   * Create a new category
   */
  async createCategory(name) {
    try {
      if (!name || typeof name !== 'string' || name.trim().length === 0) {
        return {
          success: false,
          status: 400,
          message: 'Category name is required',
          details: 'Category name must be a non-empty string'
        };
      }

      const categoryName = name.trim();

      // Check if category already exists
      const { rows: existing } = await pool.query(
        `SELECT DISTINCT category FROM projects WHERE category = $1 LIMIT 1`,
        [categoryName]
      );

      if (existing.length > 0) {
        return {
          success: true,
          message: 'Category already exists',
          data: { name: categoryName }
        };
      }

      // Create placeholder project to establish category
      await pool.query(
        `INSERT INTO projects (title, category, type, description, is_active)
         VALUES ($1, $2, $3, $4, FALSE)`,
        [
          `_category_placeholder_${Date.now()}`,
          categoryName,
          'Category Placeholder',
          'This is a placeholder project to establish the category. You can delete this after creating a real project with this category.'
        ]
      );

      return {
        success: true,
        message: 'Category created successfully',
        data: { name: categoryName }
      };
    } catch (error) {
      console.error('❌ Error creating category:', error);
      throw {
        status: 500,
        message: 'Failed to create category',
        details: error.message,
        sql: error.sql,
        categoryName: name
      };
    }
  }

  /**
   * Get project types
   */
  async getTypes() {
    try {
      const query = ProjectQueries.getTypesQuery();
      const { rows: types } = await pool.query(query);

      const typeData = types.map(t => ({
        id: t.type.toLowerCase().replace(/\s+/g, '-'),
        name: t.type,
        count: parseInt(t.project_count)
      }));

      return {
        success: true,
        data: typeData
      };
    } catch (error) {
      console.error('❌ Error fetching project types:', error);
      throw {
        status: 500,
        message: 'Failed to retrieve project types',
        details: error.message,
        sql: error.sql
      };
    }
  }
}

module.exports = new ProjectService();



