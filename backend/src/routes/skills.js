const express = require('express');
const router = express.Router();
const pool = require('../database/config');

// GET - Retrieve all skills organized by categories
router.get('/', async (req, res) => {
  try {
    // Get categories that have both skills and projects
    const { rows: categoryData } = await pool.query(`
      SELECT DISTINCT 
        s.category,
        sc.color,
        sc.description,
        sc.display_order,
        sc.icon
      FROM skills s
      LEFT JOIN skill_categories sc ON s.category = sc.name
      INNER JOIN skill_projects sp ON sp.skill_id = s.id
      INNER JOIN projects p ON p.id = sp.project_id
      WHERE s.is_active = TRUE 
        AND p.is_active = TRUE
        AND (sc.is_active = TRUE OR sc.is_active IS NULL)
      ORDER BY COALESCE(sc.display_order, 999), s.category ASC
    `);

    const categories = [];
    for (let categoryInfo of categoryData) {
      const { rows: skills } = await pool.query(`
        SELECT s.*
        FROM skills s
        INNER JOIN skill_projects sp ON sp.skill_id = s.id
        INNER JOIN projects p ON p.id = sp.project_id
        WHERE s.category = $1 
          AND s.is_active = TRUE 
          AND p.is_active = TRUE
        GROUP BY s.id
        ORDER BY s.display_order ASC, s.name ASC
      `, [categoryInfo.category]);

      // Get project count for each skill
      for (let skill of skills) {
        const { rows: projectCount } = await pool.query(`
          SELECT COUNT(*) as count FROM skill_projects sp
          JOIN projects p ON p.id = sp.project_id
          WHERE sp.skill_id = $1 AND p.is_active = TRUE
        `, [skill.id]);
        skill.project_count = projectCount[0].count;
        skill.category_name = categoryInfo.category;
        skill.category_color = categoryInfo.color || '#3B82F6';
        skill.category_description = categoryInfo.description || `${categoryInfo.category} skills`;
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
          ) ORDER BY p.id
        ) FILTER (WHERE p.id IS NOT NULL) as projects
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

    const skillWithDetails = {
      ...skill,
      projects: relatedProjects,
      statistics: skillStats
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
