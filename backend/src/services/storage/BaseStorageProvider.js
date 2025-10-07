/**
 * Base Storage Provider Interface
 * Defines the contract for all storage providers
 */
class BaseStorageProvider {
  constructor(config = {}) {
    this.config = config;
    this.name = 'base';
  }

  /**
   * Upload a file to storage
   * @param {Buffer} fileBuffer - File buffer
   * @param {string} filename - Generated filename
   * @param {Object} metadata - File metadata
   * @returns {Promise<Object>} Upload result with URL and metadata
   */
  async uploadFile(fileBuffer, filename, metadata = {}) {
    throw new Error('uploadFile method must be implemented');
  }

  /**
   * Delete a file from storage
   * @param {string} filename - Filename to delete
   * @returns {Promise<boolean>} Success status
   */
  async deleteFile(filename) {
    throw new Error('deleteFile method must be implemented');
  }

  /**
   * Get file URL
   * @param {string} filename - Filename
   * @returns {string} Public URL
   */
  getFileUrl(filename) {
    throw new Error('getFileUrl method must be implemented');
  }

  /**
   * Check if file exists
   * @param {string} filename - Filename to check
   * @returns {Promise<boolean>} Exists status
   */
  async fileExists(filename) {
    throw new Error('fileExists method must be implemented');
  }

  /**
   * Generate pre-signed URL for direct upload
   * @param {string} filename - Filename
   * @param {Object} options - Upload options
   * @returns {Promise<Object>} Pre-signed URL and metadata
   */
  async generatePresignedUrl(filename, options = {}) {
    throw new Error('generatePresignedUrl method must be implemented');
  }

  /**
   * Get file metadata
   * @param {string} filename - Filename
   * @returns {Promise<Object>} File metadata
   */
  async getFileMetadata(filename) {
    throw new Error('getFileMetadata method must be implemented');
  }

  /**
   * List files with optional prefix
   * @param {string} prefix - File prefix filter
   * @param {Object} options - List options
   * @returns {Promise<Array>} List of files
   */
  async listFiles(prefix = '', options = {}) {
    throw new Error('listFiles method must be implemented');
  }

  /**
   * Validate configuration
   * @returns {boolean} Configuration validity
   */
  validateConfig() {
    return true;
  }

  /**
   * Get storage provider name
   * @returns {string} Provider name
   */
  getProviderName() {
    return this.name;
  }
}

module.exports = BaseStorageProvider;
