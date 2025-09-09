const express = require('express');
const router = express.Router();
const pool = require('../database/config');

// GET - Retrieve all skills organized by categories
router.get('/', async (req, res) => {
  try {
    // Get all skill categories
    const [categories] = await pool.query(`
      SELECT * FROM skill_categories 
      WHERE is_active = TRUE 
      ORDER BY display_order ASC, name ASC
    `);

    // Get skills for each category
    for (let category of categories) {
      const [skills] = await pool.query(`
        SELECT 
          s.*
        FROM skills s
        WHERE s.category_id = ? AND s.is_active = TRUE
        ORDER BY s.display_order ASC, s.name ASC
      `, [category.id]);

      // Get project count for each skill
      for (let skill of skills) {
        if (skill.related_projects) {
          try {
            const projectIds = JSON.parse(skill.related_projects);
            if (projectIds.length > 0) {
              const placeholders = projectIds.map(() => '?').join(',');
              const [projectCount] = await pool.query(`
                SELECT COUNT(*) as count FROM projects 
                WHERE id IN (${placeholders}) AND is_active = TRUE
              `, projectIds);
              skill.project_count = projectCount[0].count;
            } else {
              skill.project_count = 0;
            }
          } catch (e) {
            skill.project_count = 0;
          }
        } else {
          skill.project_count = 0;
        }
      }

      category.skills = skills;
      category.skill_count = skills.length;
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

// GET - Retrieve a specific skill with full details
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const [skillRows] = await pool.query(`
      SELECT 
        s.*,
        sc.name as category_name,
        sc.color as category_color,
        sc.description as category_description
      FROM skills s
      LEFT JOIN skill_categories sc ON s.category_id = sc.id
      WHERE s.id = ? AND s.is_active = TRUE
    `, [id]);

    if (skillRows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Skill not found'
      });
    }

    const skill = skillRows[0];

    // Get related projects if any
    let relatedProjects = [];
    if (skill.related_projects && skill.related_projects.length > 0) {
      try {
        const projectIds = JSON.parse(skill.related_projects);
        if (projectIds.length > 0) {
          const placeholders = projectIds.map(() => '?').join(',');
          const [projects] = await pool.query(`
            SELECT id, title, short_description, featured_image_url, technologies
            FROM projects 
            WHERE id IN (${placeholders}) AND is_active = TRUE
          `, projectIds);
          
          relatedProjects = projects;
        }
      } catch (e) {
        relatedProjects = [];
      }
    }

    // Get skill statistics
    const [stats] = await pool.query(`
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
      related_projects: relatedProjects,
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
      category_id,
      icon,
      years_experience,
      overview,
      technologies,
      key_achievements
    } = req.body;

    // Generate UUID for new skill
    const { v4: uuidv4 } = require('uuid');
    const skillId = uuidv4();

    const [result] = await pool.query(`
      INSERT INTO skills (
        id, category_id, name, description, proficiency_level, icon,
        years_experience, overview, technologies, key_achievements, is_active
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1)
    `, [
      skillId, category_id, name, description, proficiency_level, icon,
      years_experience, overview, 
      JSON.stringify(technologies || []), 
      JSON.stringify(key_achievements || [])
    ]);

    // Get the created skill
    const [newSkill] = await pool.query('SELECT * FROM skills WHERE id = ?', [skillId]);

    res.status(201).json({
      success: true,
      message: 'Skill created successfully',
      data: newSkill[0]
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

    Object.keys(updateData).forEach(key => {
      if (updateData[key] !== undefined && key !== 'id') {
        updateFields.push(`${key} = ?`);
        if ((key === 'technologies' || key === 'key_achievements') && Array.isArray(updateData[key])) {
          updateValues.push(JSON.stringify(updateData[key]));
        } else {
          updateValues.push(updateData[key]);
        }
      }
    });

    if (updateFields.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'No valid fields to update'
      });
    }

    updateFields.push('updated_at = CURRENT_TIMESTAMP');
    updateValues.push(id);

    const [result] = await pool.query(`
      UPDATE skills 
      SET ${updateFields.join(', ')}
      WHERE id = ?
    `, updateValues);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        error: 'Skill not found'
      });
    }

    // Get the updated skill
    const [updatedSkill] = await pool.query('SELECT * FROM skills WHERE id = ?', [id]);

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

    const [result] = await pool.query(`
      UPDATE skills 
      SET is_active = 0, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `, [id]);

    if (result.affectedRows === 0) {
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
