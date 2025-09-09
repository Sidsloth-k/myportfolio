const BaseService = require('./BaseService');
const pool = require('../database/config');

class HeroService extends BaseService {
  constructor() {
    super('hero_content');
  }

  // Get hero content with all related data
  async getHeroContent() {
    try {
      const client = await pool.connect();
      
      try {
        await client.query('BEGIN');
        
        // Get main hero content
        const heroResult = await client.query(
          'SELECT * FROM hero_content WHERE is_active = true ORDER BY created_at DESC LIMIT 1'
        );
        
        if (heroResult.rows.length === 0) {
          throw new Error('No active hero content found');
        }
        
        const heroContent = heroResult.rows[0];
        
        // Get hero quotes
        const quotesResult = await client.query(
          'SELECT * FROM hero_quotes WHERE hero_content_id = $1 AND is_active = true ORDER BY display_order, created_at',
          [heroContent.id]
        );
        
        // Get hero CTA buttons
        const ctaResult = await client.query(
          'SELECT * FROM hero_cta_buttons WHERE hero_content_id = $1 AND is_active = true ORDER BY display_order, created_at',
          [heroContent.id]
        );
        
        await client.query('COMMIT');
        
        return {
          ...heroContent,
          quotes: quotesResult.rows,
          ctaButtons: ctaResult.rows
        };
        
      } catch (error) {
        await client.query('ROLLBACK');
        throw error;
      } finally {
        client.release();
      }
      
    } catch (error) {
      throw new Error(`Failed to get hero content: ${error.message}`);
    }
  }

  // Update hero content with related data
  async updateHeroContent(data) {
    try {
      const client = await pool.connect();
      
      try {
        await client.query('BEGIN');
        
        const { title, subtitle, description, background_image_url, quotes, ctaButtons, ...otherData } = data;
        
        // Update main hero content
        const updateFields = [];
        const updateValues = [];
        let paramCount = 0;
        
        if (title !== undefined) {
          paramCount++;
          updateFields.push(`title = $${paramCount}`);
          updateValues.push(title);
        }
        if (subtitle !== undefined) {
          paramCount++;
          updateFields.push(`subtitle = $${paramCount}`);
          updateValues.push(subtitle);
        }
        if (description !== undefined) {
          paramCount++;
          updateFields.push(`description = $${paramCount}`);
          updateValues.push(description);
        }
        if (background_image_url !== undefined) {
          paramCount++;
          updateFields.push(`background_image_url = $${paramCount}`);
          updateValues.push(background_image_url);
        }
        
        if (updateFields.length > 0) {
          const updateQuery = `
            UPDATE hero_content 
            SET ${updateFields.join(', ')}, updated_at = CURRENT_TIMESTAMP
            WHERE is_active = true
            RETURNING *
          `;
          
          const heroResult = await client.query(updateQuery, updateValues);
          if (heroResult.rows.length === 0) {
            throw new Error('No active hero content found to update');
          }
        }
        
        // Update quotes if provided
        if (quotes && Array.isArray(quotes)) {
          await this.updateHeroQuotes(client, quotes);
        }
        
        // Update CTA buttons if provided
        if (ctaButtons && Array.isArray(ctaButtons)) {
          await this.updateHeroCTAs(client, ctaButtons);
        }
        
        await client.query('COMMIT');
        
        // Return updated content
        return await this.getHeroContent();
        
      } catch (error) {
        await client.query('ROLLBACK');
        throw error;
      } finally {
        client.release();
      }
      
    } catch (error) {
      throw new Error(`Failed to update hero content: ${error.message}`);
    }
  }

  // Update hero quotes
  async updateHeroQuotes(client, quotes) {
    try {
      // Get current hero content ID
      const heroResult = await client.query(
        'SELECT id FROM hero_content WHERE is_active = true ORDER BY created_at DESC LIMIT 1'
      );
      
      if (heroResult.rows.length === 0) {
        throw new Error('No active hero content found');
      }
      
      const heroId = heroResult.rows[0].id;
      
      // Delete existing quotes
      await client.query(
        'DELETE FROM hero_quotes WHERE hero_content_id = $1',
        [heroId]
      );
      
      // Insert new quotes
      for (let i = 0; i < quotes.length; i++) {
        const quote = quotes[i];
        await client.query(`
          INSERT INTO hero_quotes (hero_content_id, text, author, context, display_order, is_active)
          VALUES ($1, $2, $3, $4, $5, $6)
        `, [
          heroId,
          quote.text,
          quote.author,
          quote.context || '',
          i,
          quote.isActive !== false
        ]);
      }
      
    } catch (error) {
      throw new Error(`Failed to update hero quotes: ${error.message}`);
    }
  }

  // Update hero CTA buttons
  async updateHeroCTAs(client, ctaButtons) {
    try {
      // Get current hero content ID
      const heroResult = await client.query(
        'SELECT id FROM hero_content WHERE is_active = true ORDER BY created_at DESC LIMIT 1'
      );
      
      if (heroResult.rows.length === 0) {
        throw new Error('No active hero content found');
      }
      
      const heroId = heroResult.rows[0].id;
      
      // Delete existing CTA buttons
      await client.query(
        'DELETE FROM hero_cta_buttons WHERE hero_content_id = $1',
        [heroId]
      );
      
      // Insert new CTA buttons
      for (let i = 0; i < ctaButtons.length; i++) {
        const cta = ctaButtons[i];
        await client.query(`
          INSERT INTO hero_cta_buttons (hero_content_id, text, action, display_order, is_active)
          VALUES ($1, $2, $3, $4, $5)
        `, [
          heroId,
          cta.text,
          cta.action,
          i,
          cta.isActive !== false
        ]);
      }
      
    } catch (error) {
      throw new Error(`Failed to update hero CTA buttons: ${error.message}`);
    }
  }

  // Add a new quote
  async addQuote(quoteData) {
    try {
      const client = await pool.connect();
      
      try {
        await client.query('BEGIN');
        
        // Get current hero content ID
        const heroResult = await client.query(
          'SELECT id FROM hero_content WHERE is_active = true ORDER BY created_at DESC LIMIT 1'
        );
        
        if (heroResult.rows.length === 0) {
          throw new Error('No active hero content found');
        }
        
        const heroId = heroResult.rows[0].id;
        
        // Get current max display order
        const maxOrderResult = await client.query(
          'SELECT COALESCE(MAX(display_order), -1) + 1 as next_order FROM hero_quotes WHERE hero_content_id = $1',
          [heroId]
        );
        
        const nextOrder = maxOrderResult.rows[0].next_order;
        
        // Insert new quote
        const insertResult = await client.query(`
          INSERT INTO hero_quotes (hero_content_id, text, author, context, display_order, is_active)
          VALUES ($1, $2, $3, $4, $5, $6)
          RETURNING *
        `, [
          heroId,
          quoteData.text,
          quoteData.author,
          quoteData.context || '',
          nextOrder,
          quoteData.isActive !== false
        ]);
        
        await client.query('COMMIT');
        
        return insertResult.rows[0];
        
      } catch (error) {
        await client.query('ROLLBACK');
        throw error;
      } finally {
        client.release();
      }
      
    } catch (error) {
      throw new Error(`Failed to add quote: ${error.message}`);
    }
  }

  // Update a specific quote
  async updateQuote(quoteId, quoteData) {
    try {
      const updateFields = [];
      const updateValues = [];
      let paramCount = 0;
      
      if (quoteData.text !== undefined) {
        paramCount++;
        updateFields.push(`text = $${paramCount}`);
        updateValues.push(quoteData.text);
      }
      if (quoteData.author !== undefined) {
        paramCount++;
        updateFields.push(`author = $${paramCount}`);
        updateValues.push(quoteData.author);
      }
      if (quoteData.context !== undefined) {
        paramCount++;
        updateFields.push(`context = $${paramCount}`);
        updateValues.push(quoteData.context);
      }
      if (quoteData.isActive !== undefined) {
        paramCount++;
        updateFields.push(`is_active = $${paramCount}`);
        updateValues.push(quoteData.isActive);
      }
      if (quoteData.display_order !== undefined) {
        paramCount++;
        updateFields.push(`display_order = $${paramCount}`);
        updateValues.push(quoteData.display_order);
      }
      
      if (updateFields.length === 0) {
        throw new Error('No fields to update');
      }
      
      const query = `
        UPDATE hero_quotes 
        SET ${updateFields.join(', ')}, updated_at = CURRENT_TIMESTAMP
        WHERE id = $${paramCount + 1}
        RETURNING *
      `;
      
      const result = await pool.query(query, [...updateValues, quoteId]);
      
      if (result.rows.length === 0) {
        throw new Error('Quote not found');
      }
      
      return result.rows[0];
      
    } catch (error) {
      throw new Error(`Failed to update quote: ${error.message}`);
    }
  }

  // Delete a quote
  async deleteQuote(quoteId) {
    try {
      const query = 'DELETE FROM hero_quotes WHERE id = $1 RETURNING *';
      const result = await pool.query(query, [quoteId]);
      
      if (result.rows.length === 0) {
        throw new Error('Quote not found');
      }
      
      return result.rows[0];
      
    } catch (error) {
      throw new Error(`Failed to delete quote: ${error.message}`);
    }
  }

  // Add a new CTA button
  async addCTA(ctaData) {
    try {
      const client = await pool.connect();
      
      try {
        await client.query('BEGIN');
        
        // Get current hero content ID
        const heroResult = await client.query(
          'SELECT id FROM hero_content WHERE is_active = true ORDER BY created_at DESC LIMIT 1'
        );
        
        if (heroResult.rows.length === 0) {
          throw new Error('No active hero content found');
        }
        
        const heroId = heroResult.rows[0].id;
        
        // Get current max display order
        const maxOrderResult = await client.query(
          'SELECT COALESCE(MAX(display_order), -1) + 1 as next_order FROM hero_cta_buttons WHERE hero_content_id = $1',
          [heroId]
        );
        
        const nextOrder = maxOrderResult.rows[0].next_order;
        
        // Insert new CTA button
        const insertResult = await client.query(`
          INSERT INTO hero_cta_buttons (hero_content_id, text, action, display_order, is_active)
          VALUES ($1, $2, $3, $4, $5)
          RETURNING *
        `, [
          heroId,
          ctaData.text,
          ctaData.action,
          nextOrder,
          ctaData.isActive !== false
        ]);
        
        await client.query('COMMIT');
        
        return insertResult.rows[0];
        
      } catch (error) {
        await client.query('ROLLBACK');
        throw error;
      } finally {
        client.release();
      }
      
    } catch (error) {
      throw new Error(`Failed to add CTA button: ${error.message}`);
    }
  }

  // Update a specific CTA button
  async updateCTA(ctaId, ctaData) {
    try {
      const updateFields = [];
      const updateValues = [];
      let paramCount = 0;
      
      if (ctaData.text !== undefined) {
        paramCount++;
        updateFields.push(`text = $${paramCount}`);
        updateValues.push(ctaData.text);
      }
      if (ctaData.action !== undefined) {
        paramCount++;
        updateFields.push(`action = $${paramCount}`);
        updateValues.push(ctaData.action);
      }
      if (ctaData.isActive !== undefined) {
        paramCount++;
        updateFields.push(`is_active = $${paramCount}`);
        updateValues.push(ctaData.isActive);
      }
      if (ctaData.display_order !== undefined) {
        paramCount++;
        updateFields.push(`display_order = $${paramCount}`);
        updateValues.push(ctaData.display_order);
      }
      
      if (updateFields.length === 0) {
        throw new Error('No fields to update');
      }
      
      const query = `
        UPDATE hero_cta_buttons 
        SET ${updateFields.join(', ')}, updated_at = CURRENT_TIMESTAMP
        WHERE id = $${paramCount + 1}
        RETURNING *
      `;
      
      const result = await pool.query(query, [...updateValues, ctaId]);
      
      if (result.rows.length === 0) {
        throw new Error('CTA button not found');
      }
      
      return result.rows[0];
      
    } catch (error) {
      throw new Error(`Failed to update CTA button: ${error.message}`);
    }
  }

  // Delete a CTA button
  async deleteCTA(ctaId) {
    try {
      const query = 'DELETE FROM hero_cta_buttons WHERE id = $1 RETURNING *';
      const result = await pool.query(query, [ctaId]);
      
      if (result.rows.length === 0) {
        throw new Error('CTA button not found');
      }
      
      return result.rows[0];
      
    } catch (error) {
      throw new Error(`Failed to delete CTA button: ${error.message}`);
    }
  }
}

module.exports = HeroService; 