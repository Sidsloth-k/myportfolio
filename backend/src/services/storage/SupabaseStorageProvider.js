const { createClient } = require('@supabase/supabase-js');
const BaseStorageProvider = require('./BaseStorageProvider');

class SupabaseStorageProvider extends BaseStorageProvider {
  constructor(config = {}) {
    super(config);
    this.name = 'supabase';
    this.bucketName = config.bucketName || process.env.SUPABASE_STORAGE_BUCKET || 'media-files';
    
    // Use service role key for uploads (bypasses RLS)
    this.supabase = createClient(
      config.supabaseUrl || process.env.SUPABASE_URL,
      config.supabaseServiceKey || process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY
    );
    
    // Keep anon client for public access
    this.supabaseAnon = createClient(
      config.supabaseUrl || process.env.SUPABASE_URL,
      config.supabaseAnonKey || process.env.SUPABASE_ANON_KEY
    );
  }

  validateConfig() {
    const required = ['supabaseUrl', 'supabaseKey'];
    return required.every(key => this.config[key] || process.env[`SUPABASE_${key.replace('supabase', '').toUpperCase()}`]);
  }

  async uploadFile(fileBuffer, filename, metadata = {}) {
    try {
      const { data, error } = await this.supabase.storage
        .from(this.bucketName)
        .upload(filename, fileBuffer, {
          contentType: metadata.mimeType || 'application/octet-stream',
          cacheControl: '3600',
          upsert: false,
          metadata: {
            originalName: metadata.originalName || filename,
            uploadedAt: new Date().toISOString(),
            ...metadata.customMetadata
          }
        });

      if (error) {
        // Handle RLS policy violations gracefully
        if (error.message.includes('row-level security policy')) {
          throw new Error(`Supabase upload error: RLS policy violation - ${error.message}`);
        }
        throw new Error(`Supabase upload error: ${error.message}`);
      }

      return {
        success: true,
        url: this.getFileUrl(filename),
        filename: data.path,
        size: fileBuffer.length,
        provider: this.name
      };
    } catch (error) {
      console.error('Supabase upload error:', error);
      throw new Error(`Failed to upload to Supabase: ${error.message}`);
    }
  }

  async deleteFile(filename) {
    try {
      const { error } = await this.supabase.storage
        .from(this.bucketName)
        .remove([filename]);

      if (error) {
        console.error('Supabase delete error:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Supabase delete error:', error);
      return false;
    }
  }

  getFileUrl(filename) {
    // Use anon client for public URLs
    const { data } = this.supabaseAnon.storage
      .from(this.bucketName)
      .getPublicUrl(filename);
    
    return data.publicUrl;
  }

  async fileExists(filename) {
    try {
      const { data, error } = await this.supabase.storage
        .from(this.bucketName)
        .list('', {
          search: filename
        });

      if (error) {
        return false;
      }

      return data.some(file => file.name === filename);
    } catch (error) {
      console.error('Supabase file exists error:', error);
      return false;
    }
  }

  async generatePresignedUrl(filename, options = {}) {
    try {
      const { data, error } = await this.supabase.storage
        .from(this.bucketName)
        .createSignedUploadUrl(filename, {
          expiresIn: options.expiresIn || 3600,
          contentType: options.contentType || 'application/octet-stream'
        });

      if (error) {
        throw new Error(`Supabase presigned URL error: ${error.message}`);
      }

      return {
        url: data.signedUrl,
        filename,
        expiresIn: options.expiresIn || 3600,
        method: 'POST',
        token: data.token
      };
    } catch (error) {
      console.error('Supabase presigned URL error:', error);
      throw new Error(`Failed to generate presigned URL: ${error.message}`);
    }
  }

  async getFileMetadata(filename) {
    try {
      const { data, error } = await this.supabase.storage
        .from(this.bucketName)
        .list('', {
          search: filename
        });

      if (error || !data || data.length === 0) {
        return null;
      }

      const file = data.find(f => f.name === filename);
      if (!file) {
        return null;
      }

      return {
        size: file.metadata?.size,
        lastModified: file.updated_at,
        contentType: file.metadata?.mimetype,
        metadata: file.metadata || {},
        etag: file.etag
      };
    } catch (error) {
      console.error('Supabase metadata error:', error);
      return null;
    }
  }

  async listFiles(prefix = '', options = {}) {
    try {
      const { data, error } = await this.supabase.storage
        .from(this.bucketName)
        .list(prefix, {
          limit: options.maxKeys || 1000,
          offset: options.offset || 0,
          sortBy: { column: 'created_at', order: 'desc' }
        });

      if (error) {
        throw new Error(`Supabase list error: ${error.message}`);
      }

      return {
        files: data.map(item => ({
          key: item.name,
          size: item.metadata?.size,
          lastModified: item.updated_at,
          etag: item.etag
        })),
        isTruncated: data.length === (options.maxKeys || 1000),
        nextContinuationToken: null // Supabase doesn't use continuation tokens
      };
    } catch (error) {
      console.error('Supabase list files error:', error);
      throw new Error(`Failed to list files: ${error.message}`);
    }
  }

  /**
   * Get public URL with optional transformation
   * @param {string} filename - Filename
   * @param {Object} options - Transform options
   * @returns {string} Public URL with transformations
   */
  getTransformedUrl(filename, options = {}) {
    const { data } = this.supabase.storage
      .from(this.bucketName)
      .getPublicUrl(filename, {
        transform: options.transform || {}
      });
    
    return data.publicUrl;
  }
}

module.exports = SupabaseStorageProvider;
