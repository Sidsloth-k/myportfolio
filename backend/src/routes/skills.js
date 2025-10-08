const express = require('express');
const router = express.Router();
const pool = require('../database/config');
const cacheService = require('../services/CacheService');

// GET - Retrieve all skills organized by categories
router.get('/', async (req, res) => {
  try {
    // Get all categories that have skills, using skill_categories table for proper categories
    // and "Others" for skills without matching categories
    const { rows: categoryData } = await pool.query(`
      SELECT DISTINCT 
        CASE 
          WHEN sc.name IS NOT NULL THEN sc.name
          ELSE 'Others'
        END as category,
        CASE 
          WHEN sc.color IS NOT NULL THEN sc.color
          ELSE '#6B7280'
        END as color,
        CASE 
          WHEN sc.description IS NOT NULL THEN sc.description
          ELSE 'Various skills and technologies'
        END as description,
        CASE 
          WHEN sc.display_order IS NOT NULL THEN sc.display_order
          ELSE 999
        END as display_order,
        CASE 
          WHEN sc.icon IS NOT NULL THEN sc.icon
          ELSE 'Code'
        END as icon
      FROM skills s
      LEFT JOIN skill_categories sc ON s.category = sc.name
      WHERE s.is_active = TRUE
    `);

    // Sort categories after fetching
    categoryData.sort((a, b) => {
      const orderA = a.display_order || 999;
      const orderB = b.display_order || 999;
      if (orderA !== orderB) return orderA - orderB;
      return a.category.localeCompare(b.category);
    });

    const categories = [];
    for (let categoryInfo of categoryData) {
      // Build the WHERE clause based on category type
      let whereClause = 's.is_active = TRUE';
      let params = [];
      
      if (categoryInfo.category === 'Others') {
        // For "Others" category, include skills that don't have matching skill_categories
        whereClause += ` AND NOT EXISTS (SELECT 1 FROM skill_categories sc WHERE sc.name = s.category)`;
      } else {
        // For specific categories, match exactly
        whereClause += ` AND s.category = $1`;
        params.push(categoryInfo.category);
      }
      
      const { rows: skills } = await pool.query(`
        SELECT DISTINCT s.*
        FROM skills s
        WHERE ${whereClause}
        ORDER BY s.display_order ASC, s.name ASC
      `, params);

      // Get project count for each skill
      for (let skill of skills) {
        const { rows: projectCount } = await pool.query(`
          SELECT COUNT(DISTINCT project_id) as count FROM (
            SELECT sp.project_id FROM skill_projects sp
            JOIN projects p ON p.id = sp.project_id
            WHERE sp.skill_id = $1 AND p.is_active = TRUE
            UNION
            SELECT pt.project_id FROM project_technologies pt
            JOIN projects p ON p.id = pt.project_id
            WHERE pt.skill_id = $1 AND p.is_active = TRUE
          ) combined_projects
        `, [skill.id]);
        skill.project_count = projectCount[0].count;
        skill.category_name = categoryInfo.category;
        skill.category_color = categoryInfo.color || '#3B82F6';
        skill.category_description = categoryInfo.description || `${categoryInfo.category} skills`;
        
        // Ensure arrays are never null for frontend compatibility
        skill.technologies = skill.technologies || [];
        skill.key_achievements = skill.key_achievements || [];

        // Preserve the original icon from technologies table (stored in 'icon' field)
        // Use the icon field as icon_key if icon_key is null but icon exists
        if (!skill.icon_key && skill.icon) {
          skill.icon_key = skill.icon;
        }
        
        // Ensure other fields have proper defaults for migrated skills (only if null)
        skill.color = skill.color || '#6B7280';
        skill.icon_key = skill.icon_key || 'Code';
        skill.proficiency_level = skill.proficiency_level || 0;
        skill.years_experience = skill.years_experience || '0+ years';
        skill.description = skill.description || `${skill.name} skill and technology`;
        skill.overview = skill.overview || `Experience with ${skill.name}`;
        
        // Additional null safety for all fields that might cause slice errors
        skill.name = skill.name || 'Unknown Skill';
        skill.category = skill.category || 'Others';
        skill.level = skill.level || '0';
        skill.display_order = skill.display_order || 999;
        skill.is_active = skill.is_active !== null ? skill.is_active : true;
        skill.created_at = skill.created_at || new Date().toISOString();
        skill.updated_at = skill.updated_at || new Date().toISOString();
        skill.project_count = skill.project_count || '0';
        skill.category_name = skill.category_name || 'Others';
        skill.category_color = skill.category_color || '#6B7280';
        skill.category_description = skill.category_description || 'Various skills and technologies';
      }

      // Only include categories that have skills with projects
      if (skills.length > 0) {
        categories.push({
          id: categoryInfo.category.toLowerCase(),
          name: categoryInfo.category,
          description: categoryInfo.description || `${categoryInfo.category} skills`,
          color: categoryInfo.color || '#3B82F6',
          icon: categoryInfo.icon || 'Code',
          display_order: categoryInfo.display_order || 999,
          is_active: true,
          skills: skills,
          skill_count: skills.length
        });
      }
    }

    res.json({
      success: true,
      data: categories
    });

  } catch (error) {
    console.error('Error fetching skills:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve skills',
      message: error.message
    });
  }
});

// GET - Retrieve skills with their linked projects
router.get('/with-projects', async (req, res) => {
  try {
    const { rows: skills } = await pool.query(`
      SELECT 
        s.*,
        s.category as category_name,
        COALESCE(sc.color, '#3B82F6') as category_color,
        COALESCE(sc.description, s.category || ' skills') as category_description,
        jsonb_agg(
          jsonb_build_object(
            'id', p.id,
            'title', p.title,
            'description', p.description,
            'cover_image_url', p.cover_image_url,
            'contribution', sp.contribution,
            'complexity', sp.complexity
          ) FILTER (WHERE p.id IS NOT NULL)
        ) as projects
      FROM skills s
      LEFT JOIN skill_categories sc ON s.category = sc.name
      INNER JOIN skill_projects sp ON s.id = sp.skill_id
      INNER JOIN projects p ON p.id = sp.project_id AND p.is_active = TRUE
      WHERE s.is_active = TRUE 
        AND (sc.is_active = TRUE OR sc.is_active IS NULL)
      GROUP BY s.id, s.category, sc.color, sc.description
      ORDER BY s.display_order ASC, s.name ASC
    `);

    // Transform the data to match frontend expectations
    const skillsWithProjects = skills.map(skill => ({
      ...skill,
      projects: skill.projects || [],
      project_count: skill.projects ? skill.projects.length : 0
    }));

    res.json({
      success: true,
      data: skillsWithProjects
    });

  } catch (error) {
    console.error('Error fetching skills with projects:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve skills with projects',
      message: error.message
    });
  }
});

// GET - Retrieve a specific skill with full details
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const { rows: skillRows } = await pool.query(`
      SELECT 
        s.*,
        s.category as category_name,
        COALESCE(sc.color, '#3B82F6') as category_color,
        COALESCE(sc.description, s.category || ' skills') as category_description
      FROM skills s
      LEFT JOIN skill_categories sc ON s.category = sc.name
      WHERE s.id = $1 AND s.is_active = TRUE 
        AND (sc.is_active = TRUE OR sc.is_active IS NULL)
    `, [id]);

    if (skillRows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Skill not found'
      });
    }

    const skill = skillRows[0];

    // Get related projects through skill_projects table
    const { rows: relatedProjects } = await pool.query(`
      SELECT 
        p.id, 
        p.title, 
        p.description as short_description, 
        p.cover_image_url as featured_image_url,
        sp.contribution,
        sp.complexity
      FROM skill_projects sp
      JOIN projects p ON p.id = sp.project_id
      WHERE sp.skill_id = $1 AND p.is_active = TRUE
      ORDER BY p.id ASC
    `, [id]);

    // Get skill statistics
    const { rows: stats } = await pool.query(`
      SELECT 
        COUNT(DISTINCT p.id) as total_projects,
        COUNT(DISTINCT p.client) as unique_clients
      FROM projects p
      WHERE p.is_active = TRUE
    `);

    const skillStats = {
      total_projects: stats[0].total_projects,
      avg_completion_rate: 0,
      unique_clients: stats[0].unique_clients
    };

    // Ensure all fields are properly set for frontend compatibility
    const skillWithDetails = {
      ...skill,
      projects: relatedProjects || [],
      statistics: skillStats,
      // Ensure arrays are never null
      technologies: skill.technologies || [],
      key_achievements: skill.key_achievements || [],
      // Ensure other fields have defaults
      name: skill.name || 'Unknown Skill',
      category: skill.category || 'Others',
      level: skill.level || '0',
      color: skill.color || '#6B7280',
      icon_key: skill.icon_key || 'Code',
      proficiency_level: skill.proficiency_level || 0,
      years_experience: skill.years_experience || '0+ years',
      description: skill.description || `${skill.name} skill and technology`,
      overview: skill.overview || `Experience with ${skill.name}`,
      display_order: skill.display_order || 999,
      is_active: skill.is_active !== null ? skill.is_active : true,
      created_at: skill.created_at || new Date().toISOString(),
      updated_at: skill.updated_at || new Date().toISOString()
    };

    res.json({
      success: true,
      data: skillWithDetails
    });

  } catch (error) {
    console.error('Error fetching skill:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve skill',
      message: error.message
    });
  }
});

// POST - Create a new skill
router.post('/', async (req, res) => {
  try {
    const {
      name,
      description,
      proficiency_level,
      category,
      icon_key,
      years_experience,
      overview,
      technologies,
      key_achievements,
      color
    } = req.body;

    const { rows: result } = await pool.query(`
      INSERT INTO skills (
        name, description, proficiency_level, category, icon_key,
        years_experience, overview, technologies, key_achievements, color, is_active
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, TRUE)
      RETURNING *
    `, [
      name, description, proficiency_level, category, icon_key,
      years_experience, overview, 
      JSON.stringify(technologies || []), 
      JSON.stringify(key_achievements || []),
      color
    ]);

    // Invalidate cache after creating skill
    await cacheService.invalidateSkillsCache();
    
    res.status(201).json({
      success: true,
      message: 'Skill created successfully',
      data: result[0]
    });

  } catch (error) {
    console.error('❌ Error creating skill:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create skill',
      message: error.message
    });
  }
});

// PUT - Update a skill
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Build dynamic update query
    const updateFields = [];
    const updateValues = [];
    let paramCount = 1;

    Object.keys(updateData).forEach(key => {
      if (updateData[key] !== undefined && key !== 'id') {
        updateFields.push(`${key} = $${paramCount}`);
        if ((key === 'technologies' || key === 'key_achievements') && Array.isArray(updateData[key])) {
          updateValues.push(JSON.stringify(updateData[key]));
        } else {
          updateValues.push(updateData[key]);
        }
        paramCount++;
      }
    });

    if (updateFields.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'No valid fields to update'
      });
    }

    updateFields.push(`updated_at = NOW()`);
    updateValues.push(id);

    const { rowCount } = await pool.query(`
      UPDATE skills 
      SET ${updateFields.join(', ')}
      WHERE id = $${paramCount}
    `, updateValues);

    if (rowCount === 0) {
      return res.status(404).json({
        success: false,
        error: 'Skill not found'
      });
    }

    // Get the updated skill
    const { rows: updatedSkill } = await pool.query('SELECT * FROM skills WHERE id = $1', [id]);

    // Invalidate cache after updating skill
    await cacheService.invalidateSkillsCache();

    res.json({
      success: true,
      message: 'Skill updated successfully',
      data: updatedSkill[0]
    });

  } catch (error) {
    console.error('❌ Error updating skill:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update skill',
      message: error.message
    });
  }
});

// DELETE - Soft delete a skill
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const { rowCount } = await pool.query(`
      UPDATE skills 
      SET is_active = FALSE, updated_at = NOW()
      WHERE id = $1
    `, [id]);

    if (rowCount === 0) {
      return res.status(404).json({
        success: false,
        error: 'Skill not found'
      });
    }

    // Invalidate cache after deleting skill
    await cacheService.invalidateSkillsCache();

    res.json({
      success: true,
      message: 'Skill deleted successfully'
    });

  } catch (error) {
    console.error('❌ Error deleting skill:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete skill',
      message: error.message
    });
  }
});

module.exports = router;
