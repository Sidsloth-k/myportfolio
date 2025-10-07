const FileUploadService = require('./FileUploadService');
const pool = require('../database/config');

class ImageService {
  constructor() {
    this.fileUploadService = new FileUploadService();
  }

  /**
   * Upload image for a specific entity (project, skill, hero, etc.)
   * @param {Object} file - Multer file object
   * @param {string} entityType - Type of entity (project, skill, hero, etc.)
   * @param {string} entityId - ID of the entity
   * @param {Object} metadata - Additional metadata
   * @returns {Promise<Object>} Upload result
   */
  async uploadEntityImage(file, entityType, entityId, metadata = {}) {
    try {
      // Upload file using FileUploadService
      const uploadResult = await this.fileUploadService.saveFile(file, {
        ...metadata,
        customMetadata: {
          entityType,
          entityId,
          ...metadata.customMetadata
        }
      });

      // Update entity with image URL
      await this.updateEntityImageUrl(entityType, entityId, uploadResult.url);

      return {
        success: true,
        data: {
          id: uploadResult.id,
          url: uploadResult.url,
          filename: uploadResult.filename,
          entityType,
          entityId
        }
      };
    } catch (error) {
      console.error('Error uploading entity image:', error);
      throw new Error(`Failed to upload image for ${entityType}: ${error.message}`);
    }
  }

  /**
   * Update entity's image URL in database
   * @param {string} entityType - Type of entity
   * @param {string} entityId - Entity ID
   * @param {string} imageUrl - Image URL
   */
  async updateEntityImageUrl(entityType, entityId, imageUrl) {
    const validEntityTypes = ['project', 'skill', 'hero', 'about'];
    
    if (!validEntityTypes.includes(entityType)) {
      throw new Error(`Invalid entity type: ${entityType}`);
    }

    const query = `UPDATE ${entityType}s SET image_url = $1 WHERE id = $2`;
    
    try {
    const result = await pool.query(query, [imageUrl, entityId]);
    
    if (result.rowCount === 0) {
      throw new Error(`${entityType} with ID ${entityId} not found`);
    }
    
    return result;
    } catch (error) {
      console.error(`Error updating ${entityType} image URL:`, error);
      throw error;
    }
  }

  /**
   * Get image URL for an entity
   * @param {string} entityType - Type of entity
   * @param {string} entityId - Entity ID
   * @returns {Promise<string|null>} Image URL or null
   */
  async getEntityImageUrl(entityType, entityId) {
    const validEntityTypes = ['project', 'skill', 'hero', 'about'];
    
    if (!validEntityTypes.includes(entityType)) {
      throw new Error(`Invalid entity type: ${entityType}`);
    }

    const query = `SELECT image_url FROM ${entityType}s WHERE id = $1`;
    
    try {
    const result = await pool.query(query, [entityId]);
    return result.rows.length > 0 ? result.rows[0].image_url : null;
    } catch (error) {
      console.error(`Error getting ${entityType} image URL:`, error);
      return null;
    }
  }

  /**
   * Remove image from entity
   * @param {string} entityType - Type of entity
   * @param {string} entityId - Entity ID
   * @param {boolean} deleteFile - Whether to delete the file from storage
   * @returns {Promise<boolean>} Success status
   */
  async removeEntityImage(entityType, entityId, deleteFile = false) {
    try {
      // Get current image URL
      const currentImageUrl = await this.getEntityImageUrl(entityType, entityId);
      
      if (!currentImageUrl) {
        return true; // No image to remove
      }

      // Clear image URL from entity
      await this.updateEntityImageUrl(entityType, entityId, null);

      // Optionally delete the file from storage
      if (deleteFile) {
        // Extract filename from URL and delete
        const filename = this.extractFilenameFromUrl(currentImageUrl);
        if (filename) {
          // Get file info to determine storage provider
          const fileInfo = await this.fileUploadService.getFileInfo(filename);
          if (fileInfo) {
            await this.fileUploadService.deleteFile(filename, fileInfo.storage_provider);
          }
        }
      }

      return true;
    } catch (error) {
      console.error(`Error removing ${entityType} image:`, error);
      return false;
    }
  }

  /**
   * Extract filename from URL
   * @param {string} url - Image URL
   * @returns {string|null} Filename
   */
  extractFilenameFromUrl(url) {
    if (!url) return null;
    
    // Extract filename from various URL formats
    const patterns = [
      /\/uploads\/(.+)$/,           // Local: /uploads/filename
      /\/media-files\/(.+)$/,       // Supabase: /media-files/filename
      /\/([^\/]+\.(jpg|jpeg|png|gif|webp|svg|pdf|doc|docx|zip|rar|7z))$/i  // Generic
    ];
    
    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match) {
        return match[1];
      }
    }
    
    return null;
  }

  /**
   * Get all images for an entity type
   * @param {string} entityType - Type of entity
   * @param {Object} options - Query options
   * @returns {Promise<Array>} List of images
   */
  async getEntityImages(entityType, options = {}) {
    const validEntityTypes = ['project', 'skill', 'hero', 'about'];
    
    if (!validEntityTypes.includes(entityType)) {
      throw new Error(`Invalid entity type: ${entityType}`);
    }

    const { page = 1, limit = 20, search } = options;
    const offset = (page - 1) * limit;

    let whereClause = `WHERE ${entityType}s.image_url IS NOT NULL`;
    const params = [];

    if (search) {
      whereClause += ` AND ${entityType}s.name ILIKE $${params.length + 1}`;
      params.push(`%${search}%`);
    }

    const query = `
      SELECT 
        ${entityType}s.id,
        ${entityType}s.name,
        ${entityType}s.image_url,
        ${entityType}s.created_at
      FROM ${entityType}s
      ${whereClause}
      ORDER BY ${entityType}s.created_at DESC
      LIMIT $${params.length + 1} OFFSET $${params.length + 2}
    `;

    try {
    const result = await pool.query(query, [...params, limit, offset]);
    return result.rows;
    } catch (error) {
      console.error(`Error getting ${entityType} images:`, error);
      throw error;
    }
  }

  /**
   * Batch upload images for multiple entities
   * @param {Array} uploads - Array of upload objects
   * @returns {Promise<Array>} Upload results
   */
  async batchUploadEntityImages(uploads) {
    const results = [];
    
    for (const upload of uploads) {
      try {
        const result = await this.uploadEntityImage(
          upload.file,
          upload.entityType,
          upload.entityId,
          upload.metadata
        );
        results.push({ success: true, data: result.data });
      } catch (error) {
        results.push({ 
          success: false, 
          error: error.message,
          entityType: upload.entityType,
          entityId: upload.entityId
        });
      }
    }
    
    return results;
  }
}

module.exports = ImageService;
