const { v4: uuidv4 } = require('uuid');
const pool = require('../database/config');

class Technology {
  // Get all technologies
  static async getAllTechnologies() {
    try {
      const [rows] = await pool.query(`
        SELECT * FROM technologies 
        WHERE is_active = 1 
        ORDER BY display_order ASC, name ASC
      `);
      console.log('getAllTechnologies returned:', rows.length, 'rows');
      return rows;
    } catch (error) {
      console.error('Error getting all technologies:', error);
      throw error;
    }
  }

  // Get technology by ID
  static async getTechnologyById(id) {
    try {
      const [rows] = await pool.query('SELECT * FROM technologies WHERE id = ? AND is_active = 1', [id]);
      return rows[0];
    } catch (error) {
      console.error('Error getting technology by ID:', error);
      throw error;
    }
  }

  // Get technology by name
  static async getTechnologyByName(name) {
    try {
      const [rows] = await pool.query('SELECT * FROM technologies WHERE name = ? AND is_active = 1', [name]);
      return rows[0];
    } catch (error) {
      console.error('Error getting technology by name:', error);
      throw error;
    }
  }

  // Create new technology
  static async createTechnology(technologyData) {
    try {
      const id = technologyData.id || `tech-${uuidv4()}`;
      const [result] = await pool.query(`
        INSERT INTO technologies (
          id, name, description, category, proficiency_level, 
          years_experience, is_active, display_order
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        id,
        technologyData.name,
        technologyData.description,
        technologyData.category,
        technologyData.proficiency_level,
        technologyData.years_experience,
        technologyData.is_active,
        technologyData.display_order
      ]);
      
      if (result.affectedRows > 0) {
        return { success: true, id, changes: result.affectedRows };
      } else {
        return { success: false, error: 'Failed to create technology' };
      }
    } catch (error) {
      console.error('Error creating technology:', error);
      throw error;
    }
  }

  // Update technology
  static async updateTechnology(id, technologyData) {
    try {
      const [result] = await pool.query(`
        UPDATE technologies SET
          name = ?,
          description = ?,
          category = ?,
          proficiency_level = ?,
          years_experience = ?,
          is_active = ?,
          display_order = ?,
          updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `, [
        technologyData.name,
        technologyData.description,
        technologyData.category,
        technologyData.proficiency_level,
        technologyData.years_experience,
        technologyData.is_active,
        technologyData.display_order,
        id
      ]);
      
      if (result.affectedRows > 0) {
        return { success: true, changes: result.affectedRows };
      } else {
        return { success: false, error: 'Technology not found or no changes made' };
      }
    } catch (error) {
      console.error('Error updating technology:', error);
      throw error;
    }
  }

  // Delete technology (soft delete)
  static async deleteTechnology(id) {
    try {
      const [result] = await pool.query('UPDATE technologies SET is_active = 0, updated_at = CURRENT_TIMESTAMP WHERE id = ?', [id]);
      
      if (result.affectedRows > 0) {
        return { success: true, changes: result.affectedRows };
      } else {
        return { success: false, error: 'Technology not found' };
      }
    } catch (error) {
      console.error('Error deleting technology:', error);
      throw error;
    }
  }

  // Hard delete technology
  static async hardDeleteTechnology(id) {
    try {
      const [result] = await pool.query('DELETE FROM technologies WHERE id = ?', [id]);
      
      if (result.affectedRows > 0) {
        return { success: true, changes: result.affectedRows };
      } else {
        return { success: false, error: 'Technology not found' };
      }
    } catch (error) {
      console.error('Error hard deleting technology:', error);
      throw error;
    }
  }

  // Get technologies by category
  static async getTechnologiesByCategory(category) {
    try {
      const [rows] = await pool.query(`
        SELECT * FROM technologies 
        WHERE category = ? AND is_active = 1 
        ORDER BY display_order ASC, name ASC
      `, [category]);
      return rows;
    } catch (error) {
      console.error('Error getting technologies by category:', error);
      throw error;
    }
  }

  // Search technologies by name
  static async searchTechnologies(searchTerm) {
    try {
      const [rows] = await pool.query(`
        SELECT * FROM technologies 
        WHERE name LIKE ? AND is_active = 1 
        ORDER BY display_order ASC, name ASC
      `, [`%${searchTerm}%`]);
      return rows;
    } catch (error) {
      console.error('Error searching technologies:', error);
      throw error;
    }
  }

  // Get technology count
  static async getTechnologyCount() {
    try {
      const [rows] = await pool.query('SELECT COUNT(*) as count FROM technologies WHERE is_active = 1');
      return rows[0].count;
    } catch (error) {
      console.error('Error getting technology count:', error);
      throw error;
    }
  }

  // Bulk create technologies (for seeding)
  static async bulkCreateTechnologies(technologies) {
    try {
      let successCount = 0;
      for (const tech of technologies) {
        try {
          const [result] = await pool.query(`
            INSERT IGNORE INTO technologies (
              id, name, description, category, proficiency_level, 
              years_experience, is_active, display_order
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
          `, [
            tech.id || `tech-${uuidv4()}`,
            tech.name,
            tech.description,
            tech.category,
            tech.proficiency_level,
            tech.years_experience,
            tech.is_active,
            tech.display_order
          ]);
          if (result.affectedRows > 0) successCount++;
        } catch (error) {
          console.error(`Error creating technology ${tech.name}:`, error);
        }
      }
      
      return { success: true, created: successCount, total: technologies.length };
    } catch (error) {
      console.error('Error bulk creating technologies:', error);
      throw error;
    }
  }
}

module.exports = Technology;
