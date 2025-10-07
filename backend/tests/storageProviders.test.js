const R2StorageProvider = require('../src/services/storage/R2StorageProvider');
const SupabaseStorageProvider = require('../src/services/storage/SupabaseStorageProvider');

// Mock AWS SDK
jest.mock('@aws-sdk/client-s3', () => ({
  S3Client: jest.fn().mockImplementation(() => ({
    send: jest.fn()
  })),
  PutObjectCommand: jest.fn(),
  DeleteObjectCommand: jest.fn(),
  HeadObjectCommand: jest.fn(),
  ListObjectsV2Command: jest.fn()
}));

jest.mock('@aws-sdk/s3-request-presigner', () => ({
  getSignedUrl: jest.fn().mockResolvedValue('https://mock-presigned-url.com')
}));

// Mock Supabase
jest.mock('@supabase/supabase-js', () => ({
  createClient: jest.fn().mockReturnValue({
    storage: {
      from: jest.fn().mockReturnValue({
        upload: jest.fn().mockResolvedValue({
          data: { path: 'test-file.jpg' },
          error: null
        }),
        remove: jest.fn().mockResolvedValue({
          error: null
        }),
        list: jest.fn().mockResolvedValue({
          data: [{ name: 'test-file.jpg', updated_at: '2023-01-01T00:00:00Z' }],
          error: null
        }),
        getPublicUrl: jest.fn().mockReturnValue({
          data: { publicUrl: 'https://mock-supabase-url.com/test-file.jpg' }
        }),
        createSignedUploadUrl: jest.fn().mockResolvedValue({
          data: {
            signedUrl: 'https://mock-supabase-presigned-url.com',
            token: 'mock-token'
          },
          error: null
        })
      })
    }
  })
}));

describe('Storage Providers', () => {
  describe('R2StorageProvider', () => {
    let r2Provider;
    const mockConfig = {
      bucketName: 'test-bucket',
      publicUrl: 'https://test-bucket.test-account.r2.cloudflarestorage.com',
      endpoint: 'https://test-account-id.r2.cloudflarestorage.com',
      accessKeyId: 'test-access-key',
      secretAccessKey: 'test-secret-key'
    };

    beforeEach(() => {
      r2Provider = new R2StorageProvider(mockConfig);
    });

    it('should validate configuration correctly', () => {
      expect(r2Provider.validateConfig()).toBe(true);
    });

    it('should fail validation with missing config', () => {
      const invalidProvider = new R2StorageProvider({});
      expect(invalidProvider.validateConfig()).toBe(false);
    });

    it('should generate correct file URL', () => {
      const filename = 'test-file.jpg';
      const url = r2Provider.getFileUrl(filename);
      expect(url).toBe(`${mockConfig.publicUrl}/${filename}`);
    });

    it('should have correct provider name', () => {
      expect(r2Provider.getProviderName()).toBe('r2');
    });
  });

  describe('SupabaseStorageProvider', () => {
    let supabaseProvider;
    const mockConfig = {
      supabaseUrl: 'https://test-project.supabase.co',
      supabaseKey: 'test-anon-key',
      bucketName: 'test-bucket'
    };

    beforeEach(() => {
      supabaseProvider = new SupabaseStorageProvider(mockConfig);
    });

    it('should validate configuration correctly', () => {
      expect(supabaseProvider.validateConfig()).toBe(true);
    });

    it('should fail validation with missing config', () => {
      const invalidProvider = new SupabaseStorageProvider({});
      expect(invalidProvider.validateConfig()).toBe(false);
    });

    it('should generate correct file URL', () => {
      const filename = 'test-file.jpg';
      const url = supabaseProvider.getFileUrl(filename);
      expect(url).toBe('https://mock-supabase-url.com/test-file.jpg');
    });

    it('should have correct provider name', () => {
      expect(supabaseProvider.getProviderName()).toBe('supabase');
    });
  });

  describe('File Upload Integration', () => {
    let r2Provider;
    let supabaseProvider;

    beforeEach(() => {
      r2Provider = new R2StorageProvider({
        bucketName: 'test-bucket',
        publicUrl: 'https://test-bucket.test-account.r2.cloudflarestorage.com',
        endpoint: 'https://test-account-id.r2.cloudflarestorage.com',
        accessKeyId: 'test-access-key',
        secretAccessKey: 'test-secret-key'
      });

      supabaseProvider = new SupabaseStorageProvider({
        supabaseUrl: 'https://test-project.supabase.co',
        supabaseKey: 'test-anon-key',
        bucketName: 'test-bucket'
      });
    });

    it('should upload file to R2 successfully', async () => {
      const fileBuffer = Buffer.from('test file content');
      const filename = 'test-file.jpg';
      const metadata = {
        mimeType: 'image/jpeg',
        originalName: 'original-file.jpg'
      };

      const result = await r2Provider.uploadFile(fileBuffer, filename, metadata);
      
      expect(result.success).toBe(true);
      expect(result.filename).toBe(filename);
      expect(result.url).toBe(`${r2Provider.config.publicUrl}/${filename}`);
      expect(result.provider).toBe('r2');
    });

    it('should upload file to Supabase successfully', async () => {
      const fileBuffer = Buffer.from('test file content');
      const filename = 'test-file.jpg';
      const metadata = {
        mimeType: 'image/jpeg',
        originalName: 'original-file.jpg'
      };

      const result = await supabaseProvider.uploadFile(fileBuffer, filename, metadata);
      
      expect(result.success).toBe(true);
      expect(result.filename).toBe(filename);
      expect(result.url).toBe('https://mock-supabase-url.com/test-file.jpg');
      expect(result.provider).toBe('supabase');
    });

    it('should handle R2 upload errors', async () => {
      const { S3Client } = require('@aws-sdk/client-s3');
      const mockClient = new S3Client();
      mockClient.send.mockRejectedValue(new Error('R2 upload failed'));

      const fileBuffer = Buffer.from('test file content');
      const filename = 'test-file.jpg';
      const metadata = { mimeType: 'image/jpeg' };

      await expect(r2Provider.uploadFile(fileBuffer, filename, metadata))
        .rejects.toThrow('R2 upload failed');
    });

    it('should handle Supabase upload errors', async () => {
      const { createClient } = require('@supabase/supabase-js');
      const mockSupabase = createClient();
      mockSupabase.storage.from().upload.mockResolvedValue({
        data: null,
        error: { message: 'Supabase upload failed' }
      });

      const fileBuffer = Buffer.from('test file content');
      const filename = 'test-file.jpg';
      const metadata = { mimeType: 'image/jpeg' };

      await expect(supabaseProvider.uploadFile(fileBuffer, filename, metadata))
        .rejects.toThrow('Supabase upload error: Supabase upload failed');
    });
  });

  describe('File Management', () => {
    let r2Provider;
    let supabaseProvider;

    beforeEach(() => {
      r2Provider = new R2StorageProvider({
        bucketName: 'test-bucket',
        publicUrl: 'https://test-bucket.test-account.r2.cloudflarestorage.com',
        endpoint: 'https://test-account-id.r2.cloudflarestorage.com',
        accessKeyId: 'test-access-key',
        secretAccessKey: 'test-secret-key'
      });

      supabaseProvider = new SupabaseStorageProvider({
        supabaseUrl: 'https://test-project.supabase.co',
        supabaseKey: 'test-anon-key',
        bucketName: 'test-bucket'
      });
    });

    it('should check if file exists in R2', async () => {
      const { S3Client } = require('@aws-sdk/client-s3');
      const mockClient = new S3Client();
      mockClient.send.mockResolvedValue({});

      const exists = await r2Provider.fileExists('test-file.jpg');
      expect(exists).toBe(true);
    });

    it('should check if file exists in Supabase', async () => {
      const exists = await supabaseProvider.fileExists('test-file.jpg');
      expect(exists).toBe(true);
    });

    it('should generate presigned URL for R2', async () => {
      const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');
      getSignedUrl.mockResolvedValue('https://mock-presigned-url.com');

      const result = await r2Provider.generatePresignedUrl('test-file.jpg', {
        contentType: 'image/jpeg',
        expiresIn: 3600
      });

      expect(result.url).toBe('https://mock-presigned-url.com');
      expect(result.filename).toBe('test-file.jpg');
      expect(result.method).toBe('PUT');
    });

    it('should generate presigned URL for Supabase', async () => {
      const result = await supabaseProvider.generatePresignedUrl('test-file.jpg', {
        contentType: 'image/jpeg',
        expiresIn: 3600
      });

      expect(result.url).toBe('https://mock-supabase-presigned-url.com');
      expect(result.filename).toBe('test-file.jpg');
      expect(result.method).toBe('POST');
    });
  });
});
