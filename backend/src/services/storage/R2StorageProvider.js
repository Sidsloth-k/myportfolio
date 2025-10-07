const { S3Client, PutObjectCommand, DeleteObjectCommand, HeadObjectCommand, ListObjectsV2Command } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');
const BaseStorageProvider = require('./BaseStorageProvider');

class R2StorageProvider extends BaseStorageProvider {
  constructor(config = {}) {
    super(config);
    this.name = 'r2';
    this.bucketName = config.bucketName || process.env.R2_BUCKET_NAME;
    this.publicUrl = config.publicUrl || process.env.R2_PUBLIC_URL;
    
    this.client = new S3Client({
      region: config.region || 'auto',
      endpoint: config.endpoint || process.env.R2_ENDPOINT,
      credentials: {
        accessKeyId: config.accessKeyId || process.env.R2_ACCESS_KEY_ID,
        secretAccessKey: config.secretAccessKey || process.env.R2_SECRET_ACCESS_KEY,
      },
    });
  }

  validateConfig() {
    const required = ['bucketName', 'publicUrl', 'endpoint', 'accessKeyId', 'secretAccessKey'];
    return required.every(key => this.config[key] || process.env[`R2_${key.toUpperCase()}`]);
  }

  async uploadFile(fileBuffer, filename, metadata = {}) {
    try {
      const command = new PutObjectCommand({
        Bucket: this.bucketName,
        Key: filename,
        Body: fileBuffer,
        ContentType: metadata.mimeType || 'application/octet-stream',
        Metadata: {
          originalName: metadata.originalName || filename,
          uploadedAt: new Date().toISOString(),
          ...metadata.customMetadata
        },
        CacheControl: 'public, max-age=31536000', // 1 year cache
      });

      await this.client.send(command);
      
      return {
        success: true,
        url: this.getFileUrl(filename),
        filename,
        size: fileBuffer.length,
        provider: this.name
      };
    } catch (error) {
      console.error('R2 upload error:', error);
      throw new Error(`Failed to upload to R2: ${error.message}`);
    }
  }

  async deleteFile(filename) {
    try {
      const command = new DeleteObjectCommand({
        Bucket: this.bucketName,
        Key: filename,
      });

      await this.client.send(command);
      return true;
    } catch (error) {
      console.error('R2 delete error:', error);
      return false;
    }
  }

  getFileUrl(filename) {
    return `${this.publicUrl}/${this.bucketName}/${filename}`;
  }

  async fileExists(filename) {
    try {
      const command = new HeadObjectCommand({
        Bucket: this.bucketName,
        Key: filename,
      });

      await this.client.send(command);
      return true;
    } catch (error) {
      if (error.name === 'NotFound') {
        return false;
      }
      throw error;
    }
  }

  async generatePresignedUrl(filename, options = {}) {
    try {
      const command = new PutObjectCommand({
        Bucket: this.bucketName,
        Key: filename,
        ContentType: options.contentType || 'application/octet-stream',
        ...options.metadata
      });

      const presignedUrl = await getSignedUrl(this.client, command, {
        expiresIn: options.expiresIn || 3600, // 1 hour default
      });

      return {
        url: presignedUrl,
        filename,
        expiresIn: options.expiresIn || 3600,
        method: 'PUT'
      };
    } catch (error) {
      console.error('R2 presigned URL error:', error);
      throw new Error(`Failed to generate presigned URL: ${error.message}`);
    }
  }

  async getFileMetadata(filename) {
    try {
      const command = new HeadObjectCommand({
        Bucket: this.bucketName,
        Key: filename,
      });

      const response = await this.client.send(command);
      
      return {
        size: response.ContentLength,
        lastModified: response.LastModified,
        contentType: response.ContentType,
        metadata: response.Metadata || {},
        etag: response.ETag
      };
    } catch (error) {
      if (error.name === 'NotFound') {
        return null;
      }
      throw error;
    }
  }

  async listFiles(prefix = '', options = {}) {
    try {
      const command = new ListObjectsV2Command({
        Bucket: this.bucketName,
        Prefix: prefix,
        MaxKeys: options.maxKeys || 1000,
        ContinuationToken: options.continuationToken
      });

      const response = await this.client.send(command);
      
      return {
        files: response.Contents?.map(item => ({
          key: item.Key,
          size: item.Size,
          lastModified: item.LastModified,
          etag: item.ETag
        })) || [],
        isTruncated: response.IsTruncated,
        nextContinuationToken: response.NextContinuationToken
      };
    } catch (error) {
      console.error('R2 list files error:', error);
      throw new Error(`Failed to list files: ${error.message}`);
    }
  }
}

module.exports = R2StorageProvider;
