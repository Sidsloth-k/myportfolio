const fs = require('fs').promises;
const path = require('path');
const crypto = require('crypto');
const R2StorageProvider = require('./storage/R2StorageProvider');
const SupabaseStorageProvider = require('./storage/SupabaseStorageProvider');
const pool = require('../database/config');

class FileUploadService {
  constructor() {
    this.primaryProvider = null;
    this.fallbackProvider = null;
    this.localUploadPath = path.join(__dirname, '../../uploads');
    this.initializeProviders();
  }

  /**
   * Initialize storage providers based on environment configuration
   */
  initializeProviders() {
    try {
      // Initialize R2 as primary provider
      if (this.isR2Configured()) {
        this.primaryProvider = new R2StorageProvider();
        console.log('✅ R2 Storage Provider initialized');
      }

      // Initialize Supabase as fallback provider
      if (this.isSupabaseConfigured()) {
        this.fallbackProvider = new SupabaseStorageProvider();
        console.log('✅ Supabase Storage Provider initialized');
      }

      if (!this.primaryProvider && !this.fallbackProvider) {
        console.warn('⚠️ No cloud storage providers configured, using local storage only');
      }
    } catch (error) {
      console.error('❌ Error initializing storage providers:', error.message);
    }
  }

  /**
   * Check if R2 is properly configured
   */
  isR2Configured() {
    const required = ['R2_BUCKET_NAME', 'R2_PUBLIC_URL', 'R2_ENDPOINT', 'R2_ACCESS_KEY_ID', 'R2_SECRET_ACCESS_KEY'];
    return required.every(key => process.env[key]);
  }

  /**
   * Check if Supabase is properly configured
   */
  isSupabaseConfigured() {
    const required = ['SUPABASE_URL', 'SUPABASE_ANON_KEY'];
    const hasServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    const hasAnonKey = process.env.SUPABASE_ANON_KEY;
    
    // Need at least the URL and one of the keys
    return process.env.SUPABASE_URL && (hasServiceKey || hasAnonKey);
  }

  /**
   * Save file to storage with fallback mechanism
   * @param {Object} file - Multer file object
   * @param {Object} metadata - File metadata
   * @returns {Promise<Object>} Upload result
   */
  async saveFile(file, metadata = {}) {
    const { buffer, originalname, mimetype, size } = file;
    const secureFilename = metadata.secureFilename || this.generateSecureFilename(originalname);
    
    const fileMetadata = {
      originalName: originalname,
      mimeType: mimetype,
      size: size,
      customMetadata: metadata.customMetadata || {}
    };

    let uploadResults = {
      primary: null,
      fallback: null,
      local: null
    };
    let primaryStorageProvider = 'local';
    let fallbackStorageProvider = 'local';

    // Upload to both primary (R2) and fallback (Supabase) simultaneously
    const uploadPromises = [];

    // Upload to primary provider (R2)
    if (this.primaryProvider) {
      uploadPromises.push(
        this.primaryProvider.uploadFile(buffer, secureFilename, fileMetadata)
          .then(result => {
            uploadResults.primary = result;
            primaryStorageProvider = 'r2';
            console.log(`✅ File uploaded to R2: ${secureFilename}`);
            return { provider: 'r2', result };
          })
          .catch(error => {
            console.error('❌ R2 upload failed:', error.message);
            return { provider: 'r2', error: error.message };
          })
      );
    }

    // Upload to fallback provider (Supabase)
    if (this.fallbackProvider) {
      uploadPromises.push(
        this.fallbackProvider.uploadFile(buffer, secureFilename, fileMetadata)
          .then(result => {
            uploadResults.fallback = result;
            fallbackStorageProvider = 'supabase';
            console.log(`✅ File uploaded to Supabase: ${secureFilename}`);
            return { provider: 'supabase', result };
          })
          .catch(error => {
            console.error('❌ Supabase upload failed:', error.message);
            return { provider: 'supabase', error: error.message };
          })
      );
    }

    // Wait for all uploads to complete
    const uploadResults_array = await Promise.allSettled(uploadPromises);
    
    // Check if at least one cloud provider succeeded
    const successfulUploads = uploadResults_array.filter(result => 
      result.status === 'fulfilled' && !result.value.error
    );

    if (successfulUploads.length === 0) {
      // Fallback to local storage if both cloud providers fail
      try {
        uploadResults.local = await this.saveToLocalStorage(buffer, secureFilename, fileMetadata);
        primaryStorageProvider = 'local';
        fallbackStorageProvider = 'local';
        console.log(`✅ File saved locally: ${secureFilename}`);
      } catch (error) {
        console.error('❌ Local storage failed:', error.message);
        throw new Error('All storage methods failed');
      }
    }

    // Use the first successful upload as the primary result
    const primaryResult = uploadResults.primary || uploadResults.fallback || uploadResults.local;

    // Determine primary and backup storage providers
    const primaryProvider = uploadResults.primary ? 'r2' : (uploadResults.fallback ? 'supabase' : 'local');
    const backupProvider = uploadResults.fallback ? 'supabase' : (uploadResults.primary ? 'r2' : 'local');
    
    // Get URLs for each provider
    const r2Url = uploadResults.primary?.url || null;
    const supabaseUrl = uploadResults.fallback?.url || null;
    const primaryUrl = uploadResults.primary?.url || uploadResults.fallback?.url || uploadResults.local?.url;

    // Save file metadata to database
    const dbResult = await this.saveFileMetadata({
      filename: secureFilename,
      originalFilename: originalname,
      filePath: primaryUrl || `/uploads/${secureFilename}`,
      fileSize: size,
      mimeType: mimetype,
      storageProvider: primaryProvider,
      cloudUrl: primaryUrl,
      localPath: primaryProvider === 'local' ? uploadResults.local?.localPath : null,
      r2Url: r2Url,
      supabaseUrl: supabaseUrl,
      backupStorageProvider: backupProvider,
      altText: metadata.alt_text || '',
      caption: metadata.caption || '',
      tags: metadata.tags || [],
      uploadedBy: metadata.uploadedBy || null
    });

    return {
      ...primaryResult,
      id: dbResult.id,
      filename: secureFilename,
      originalFilename: originalname,
      storageProvider: primaryProvider,
      backupStorageProvider: backupProvider,
      r2Url: r2Url,
      supabaseUrl: supabaseUrl,
      localPath: uploadResults.local?.localPath,
      createdAt: dbResult.created_at
    };
  }

  /**
   * Save file to local storage
   * @param {Buffer} buffer - File buffer
   * @param {string} filename - Secure filename
   * @param {Object} metadata - File metadata
   * @returns {Promise<Object>} Local storage result
   */
  async saveToLocalStorage(buffer, filename, metadata) {
    // Ensure uploads directory exists
    await fs.mkdir(this.localUploadPath, { recursive: true });
    
    const localPath = path.join(this.localUploadPath, filename);
    await fs.writeFile(localPath, buffer);
    
    return {
      success: true,
      url: `/uploads/${filename}`,
      localPath: localPath,
      size: buffer.length,
      provider: 'local'
    };
  }

  /**
   * Save file metadata to database
   * @param {Object} fileData - File data
   * @returns {Promise<Object>} Database result
   */
  async saveFileMetadata(fileData) {
    const query = `
      INSERT INTO media_files (
        filename, original_filename, file_path, file_size, mime_type,
        storage_provider, cloud_url, local_path, r2_url, supabase_url, backup_storage_provider,
        alt_text, caption, tags, uploaded_by
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
      RETURNING id, created_at
    `;
    
    const values = [
      fileData.filename,
      fileData.originalFilename,
      fileData.filePath,
      fileData.fileSize,
      fileData.mimeType,
      fileData.storageProvider,
      fileData.cloudUrl,
      fileData.localPath,
      fileData.r2Url,
      fileData.supabaseUrl,
      fileData.backupStorageProvider,
      fileData.altText,
      fileData.caption,
      fileData.tags,
      fileData.uploadedBy
    ];
    
    // Debug logging
    console.log('Database values being inserted:', values);
    console.log('uploadedBy value:', fileData.uploadedBy, 'type:', typeof fileData.uploadedBy);

    const result = await pool.query(query, values);
    return result.rows[0];
  }

  /**
   * Get file URL with fallback mechanism
   * @param {string} filename - Filename
   * @param {string} storageProvider - Storage provider
   * @returns {string} File URL
   */
  getFileUrl(filename, storageProvider = null) {
    if (storageProvider === 'r2' && this.primaryProvider) {
      return this.primaryProvider.getFileUrl(filename);
    }
    
    if (storageProvider === 'supabase' && this.fallbackProvider) {
      return this.fallbackProvider.getFileUrl(filename);
    }
    
    // Default to local storage
    return `/uploads/${filename}`;
  }

  /**
   * Get backup URLs for a file
   * @param {Object} fileInfo - File information from database
   * @returns {Object} Backup URLs
   */
  getBackupUrls(fileInfo) {
    return {
      primary: fileInfo.cloud_url,
      r2: fileInfo.r2_url,
      supabase: fileInfo.supabase_url,
      local: fileInfo.local_path ? `/uploads/${fileInfo.filename}` : null
    };
  }

  /**
   * Get file URL with automatic fallback
   * @param {Object} fileInfo - File information from database
   * @returns {string} Available file URL
   */
  getFileUrlWithFallback(fileInfo) {
    // Try primary URL first
    if (fileInfo.cloud_url) {
      return fileInfo.cloud_url;
    }
    
    // Try R2 URL
    if (fileInfo.r2_url) {
      return fileInfo.r2_url;
    }
    
    // Try Supabase URL
    if (fileInfo.supabase_url) {
      return fileInfo.supabase_url;
    }
    
    // Fallback to local
    return `/uploads/${fileInfo.filename}`;
  }

  /**
   * Delete file from all storage providers
   * @param {string} filename - Filename to delete
   * @param {string} storageProvider - Storage provider
   * @returns {Promise<boolean>} Success status
   */
  async deleteFile(filename, storageProvider = null) {
    let success = false;

    if (storageProvider === 'r2' && this.primaryProvider) {
      try {
        success = await this.primaryProvider.deleteFile(filename);
      } catch (error) {
        console.error('R2 delete error:', error.message);
      }
    }
    
    if (storageProvider === 'supabase' && this.fallbackProvider) {
      try {
        success = await this.fallbackProvider.deleteFile(filename);
      } catch (error) {
        console.error('Supabase delete error:', error.message);
      }
    }
    
    if (storageProvider === 'local') {
      try {
        const localPath = path.join(this.localUploadPath, filename);
        await fs.unlink(localPath);
        success = true;
      } catch (error) {
        console.error('Local delete error:', error.message);
      }
    }

    return success;
  }

  /**
   * Generate secure filename
   * @param {string} originalName - Original filename
   * @returns {string} Secure filename
   */
  generateSecureFilename(originalName) {
    const timestamp = Date.now();
    const random = crypto.randomBytes(8).toString('hex');
    const ext = path.extname(originalName).toLowerCase();
    return `${timestamp}_${random}${ext}`;
  }

  /**
   * Get file info from database
   * @param {string} filename - Filename
   * @returns {Promise<Object>} File info
   */
  async getFileInfo(filename) {
    const query = 'SELECT * FROM media_files WHERE filename = $1 AND is_active = true';
    const result = await pool.query(query, [filename]);
    return result.rows[0] || null;
  }

  /**
   * Get file by ID
   * @param {string} id - File ID
   * @returns {Promise<Object>} File info
   */
  async getFileById(id) {
    const query = 'SELECT * FROM media_files WHERE id = $1 AND is_active = true';
    const result = await pool.query(query, [id]);
    return result.rows[0] || null;
  }

  /**
   * List files with pagination
   * @param {Object} options - List options
   * @returns {Promise<Object>} Files list
   */
  async listFiles(options = {}) {
    const { page = 1, limit = 20, search, mimeType, storageProvider } = options;
    const offset = (page - 1) * limit;

    let whereClause = 'WHERE is_active = true';
    const params = [];

    if (search) {
      whereClause += ' AND (original_filename ILIKE $' + (params.length + 1) + ' OR alt_text ILIKE $' + (params.length + 1) + ')';
      params.push(`%${search}%`);
    }

    if (mimeType) {
      whereClause += ' AND mime_type = $' + (params.length + 1);
      params.push(mimeType);
    }

    if (storageProvider) {
      whereClause += ' AND storage_provider = $' + (params.length + 1);
      params.push(storageProvider);
    }

    // Get total count
    const countQuery = `SELECT COUNT(*) as count FROM media_files ${whereClause}`;
    const countResult = await pool.query(countQuery, params);
    const totalCount = parseInt(countResult.rows[0].count);

    // Get files
    const filesQuery = `
      SELECT * FROM media_files 
      ${whereClause}
      ORDER BY created_at DESC 
      LIMIT $${params.length + 1} OFFSET $${params.length + 2}
    `;
    
    const filesResult = await pool.query(filesQuery, [...params, limit, offset]);
    const files = filesResult.rows;

    return {
      files: files.map(file => ({
        ...file,
        url: this.getFileUrl(file.filename, file.storage_provider)
      })),
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: totalCount,
        pages: Math.ceil(totalCount / limit)
      }
    };
  }
}

module.exports = FileUploadService;
