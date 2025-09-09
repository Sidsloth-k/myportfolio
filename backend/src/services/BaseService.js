const pool = require('../database/config');

class BaseService {
  constructor(tableName, primaryKey = 'id') {
    this.tableName = tableName;
    this.primaryKey = primaryKey;
  }

  // Create a new record
  async create(data) {
    try {
      const columns = Object.keys(data);
      const values = Object.values(data);
      const placeholders = columns.map((_, index) => `$${index + 1}`).join(', ');
      
      const query = `
        INSERT INTO ${this.tableName} (${columns.join(', ')})
        VALUES (${placeholders})
        RETURNING *
      `;
      
      const result = await pool.query(query, values);
      return result.rows[0];
    } catch (error) {
      throw new Error(`Failed to create ${this.tableName}: ${error.message}`);
    }
  }

  // Get all records with optional filtering and pagination
  async findAll(options = {}) {
    try {
      let query = `SELECT * FROM ${this.tableName}`;
      const values = [];
      let paramCount = 0;

      // Add WHERE clauses for filtering
      if (options.filters) {
        const whereClauses = [];
        for (const [key, value] of Object.entries(options.filters)) {
          if (value !== undefined && value !== null) {
            paramCount++;
            whereClauses.push(`${key} = $${paramCount}`);
            values.push(value);
          }
        }
        if (whereClauses.length > 0) {
          query += ` WHERE ${whereClauses.join(' AND ')}`;
        }
      }

      // Add ORDER BY
      if (options.orderBy) {
        query += ` ORDER BY ${options.orderBy}`;
      }

      // Add LIMIT and OFFSET for pagination
      if (options.limit) {
        paramCount++;
        query += ` LIMIT $${paramCount}`;
        values.push(options.limit);
      }
      if (options.offset) {
        paramCount++;
        query += ` OFFSET $${paramCount}`;
        values.push(options.offset);
      }

      const result = await pool.query(query, values);
      return result.rows;
    } catch (error) {
      throw new Error(`Failed to fetch ${this.tableName}: ${error.message}`);
    }
  }

  // Get a single record by ID
  async findById(id) {
    try {
      const query = `SELECT * FROM ${this.tableName} WHERE ${this.primaryKey} = $1`;
      const result = await pool.query(query, [id]);
      
      if (result.rows.length === 0) {
        throw new Error(`${this.tableName} not found`);
      }
      
      return result.rows[0];
    } catch (error) {
      throw new Error(`Failed to fetch ${this.tableName}: ${error.message}`);
    }
  }

  // Update a record by ID
  async update(id, data) {
    try {
      const columns = Object.keys(data);
      const values = Object.values(data);
      const setClause = columns.map((_, index) => `${columns[index]} = $${index + 2}`).join(', ');
      
      const query = `
        UPDATE ${this.tableName}
        SET ${setClause}, updated_at = CURRENT_TIMESTAMP
        WHERE ${this.primaryKey} = $1
        RETURNING *
      `;
      
      const result = await pool.query(query, [id, ...values]);
      
      if (result.rows.length === 0) {
        throw new Error(`${this.tableName} not found`);
      }
      
      return result.rows[0];
    } catch (error) {
      throw new Error(`Failed to update ${this.tableName}: ${error.message}`);
    }
  }

  // Delete a record by ID
  async delete(id) {
    try {
      const query = `DELETE FROM ${this.tableName} WHERE ${this.primaryKey} = $1 RETURNING *`;
      const result = await pool.query(query, [id]);
      
      if (result.rows.length === 0) {
        throw new Error(`${this.tableName} not found`);
      }
      
      return result.rows[0];
    } catch (error) {
      throw new Error(`Failed to delete ${this.tableName}: ${error.message}`);
    }
  }

  // Soft delete (set is_active to false)
  async softDelete(id) {
    try {
      const query = `
        UPDATE ${this.tableName}
        SET is_active = false, updated_at = CURRENT_TIMESTAMP
        WHERE ${this.primaryKey} = $1
        RETURNING *
      `;
      
      const result = await pool.query(query, [id]);
      
      if (result.rows.length === 0) {
        throw new Error(`${this.tableName} not found`);
      }
      
      return result.rows[0];
    } catch (error) {
      throw new Error(`Failed to soft delete ${this.tableName}: ${error.message}`);
    }
  }

  // Count total records
  async count(options = {}) {
    try {
      let query = `SELECT COUNT(*) FROM ${this.tableName}`;
      const values = [];
      let paramCount = 0;

      if (options.filters) {
        const whereClauses = [];
        for (const [key, value] of Object.entries(options.filters)) {
          if (value !== undefined && value !== null) {
            paramCount++;
            whereClauses.push(`${key} = $${paramCount}`);
            values.push(value);
          }
        }
        if (whereClauses.length > 0) {
          query += ` WHERE ${whereClauses.join(' AND ')}`;
        }
      }

      const result = await pool.query(query, values);
      return parseInt(result.rows[0].count);
    } catch (error) {
      throw new Error(`Failed to count ${this.tableName}: ${error.message}`);
    }
  }

  // Execute custom query
  async executeQuery(query, values = []) {
    try {
      const result = await pool.query(query, values);
      return result.rows;
    } catch (error) {
      throw new Error(`Query execution failed: ${error.message}`);
    }
  }

  // Begin transaction
  async beginTransaction() {
    const client = await pool.connect();
    await client.query('BEGIN');
    return client;
  }

  // Commit transaction
  async commitTransaction(client) {
    await client.query('COMMIT');
    client.release();
  }

  // Rollback transaction
  async rollbackTransaction(client) {
    await client.query('ROLLBACK');
    client.release();
  }
}

module.exports = BaseService; 