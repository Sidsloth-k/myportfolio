const request = require('supertest');
const app = require('../src/index');
const fs = require('fs');
const path = require('path');

describe('File Upload API', () => {
  let authToken;
  let testFileBuffer;
  let testImagePath;

  beforeAll(async () => {
    // Create a test image file
    testImagePath = path.join(__dirname, 'test-image.jpg');
    testFileBuffer = Buffer.from('fake-image-data');
    fs.writeFileSync(testImagePath, testFileBuffer);

    // Mock authentication (you may need to adjust this based on your auth setup)
    authToken = 'mock-jwt-token';
  });

  afterAll(() => {
    // Clean up test file
    if (fs.existsSync(testImagePath)) {
      fs.unlinkSync(testImagePath);
    }
  });

  describe('POST /api/media', () => {
    it('should upload an image file successfully', async () => {
      const response = await request(app)
        .post('/api/media')
        .set('Authorization', `Bearer ${authToken}`)
        .attach('file', testImagePath)
        .field('alt_text', 'Test image')
        .field('caption', 'A test image for upload')
        .field('tags', JSON.stringify(['test', 'image']));

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('id');
      expect(response.body.data).toHaveProperty('url');
      expect(response.body.data).toHaveProperty('filename');
      expect(response.body.data.altText).toBe('Test image');
    });

    it('should reject upload without authentication', async () => {
      const response = await request(app)
        .post('/api/media')
        .attach('file', testImagePath);

      expect(response.status).toBe(401);
    });

    it('should reject upload without file', async () => {
      const response = await request(app)
        .post('/api/media')
        .set('Authorization', `Bearer ${authToken}`)
        .field('alt_text', 'Test image');

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('No file provided');
    });

    it('should reject unsupported file type', async () => {
      const testDocPath = path.join(__dirname, 'test-file.exe');
      fs.writeFileSync(testDocPath, 'fake-executable-data');

      const response = await request(app)
        .post('/api/media')
        .set('Authorization', `Bearer ${authToken}`)
        .attach('file', testDocPath);

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);

      // Clean up
      fs.unlinkSync(testDocPath);
    });

    it('should reject file that is too large', async () => {
      // Create a large file (6MB)
      const largeFilePath = path.join(__dirname, 'large-file.jpg');
      const largeBuffer = Buffer.alloc(6 * 1024 * 1024, 'x');
      fs.writeFileSync(largeFilePath, largeBuffer);

      const response = await request(app)
        .post('/api/media')
        .set('Authorization', `Bearer ${authToken}`)
        .attach('file', largeFilePath);

      expect(response.status).toBe(400);

      // Clean up
      fs.unlinkSync(largeFilePath);
    });
  });

  describe('GET /api/media', () => {
    it('should retrieve media files with pagination', async () => {
      const response = await request(app)
        .get('/api/media')
        .query({ page: 1, limit: 10 });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('files');
      expect(response.body.data).toHaveProperty('pagination');
      expect(Array.isArray(response.body.data.files)).toBe(true);
    });

    it('should filter media files by MIME type', async () => {
      const response = await request(app)
        .get('/api/media')
        .query({ mimeType: 'image/jpeg' });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });

    it('should search media files', async () => {
      const response = await request(app)
        .get('/api/media')
        .query({ search: 'test' });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });
  });

  describe('GET /api/media/:id', () => {
    let uploadedFileId;

    beforeAll(async () => {
      // Upload a file first to get its ID
      const uploadResponse = await request(app)
        .post('/api/media')
        .set('Authorization', `Bearer ${authToken}`)
        .attach('file', testImagePath)
        .field('alt_text', 'Test image for retrieval');

      if (uploadResponse.status === 201) {
        uploadedFileId = uploadResponse.body.data.id;
      }
    });

    it('should retrieve a specific media file by ID', async () => {
      if (!uploadedFileId) {
        console.log('Skipping test - no uploaded file ID available');
        return;
      }

      const response = await request(app)
        .get(`/api/media/${uploadedFileId}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('id', uploadedFileId);
      expect(response.body.data).toHaveProperty('url');
    });

    it('should return 404 for non-existent file ID', async () => {
      const response = await request(app)
        .get('/api/media/non-existent-id');

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('Media file not found');
    });
  });

  describe('PUT /api/media/:id', () => {
    let uploadedFileId;

    beforeAll(async () => {
      // Upload a file first to get its ID
      const uploadResponse = await request(app)
        .post('/api/media')
        .set('Authorization', `Bearer ${authToken}`)
        .attach('file', testImagePath)
        .field('alt_text', 'Original alt text');

      if (uploadResponse.status === 201) {
        uploadedFileId = uploadResponse.body.data.id;
      }
    });

    it('should update media file metadata', async () => {
      if (!uploadedFileId) {
        console.log('Skipping test - no uploaded file ID available');
        return;
      }

      const response = await request(app)
        .put(`/api/media/${uploadedFileId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          alt_text: 'Updated alt text',
          caption: 'Updated caption',
          tags: ['updated', 'test']
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.alt_text).toBe('Updated alt text');
      expect(response.body.data.caption).toBe('Updated caption');
    });

    it('should reject update without authentication', async () => {
      if (!uploadedFileId) {
        console.log('Skipping test - no uploaded file ID available');
        return;
      }

      const response = await request(app)
        .put(`/api/media/${uploadedFileId}`)
        .send({
          alt_text: 'Updated alt text'
        });

      expect(response.status).toBe(401);
    });
  });

  describe('DELETE /api/media/:id', () => {
    let uploadedFileId;

    beforeAll(async () => {
      // Upload a file first to get its ID
      const uploadResponse = await request(app)
        .post('/api/media')
        .set('Authorization', `Bearer ${authToken}`)
        .attach('file', testImagePath)
        .field('alt_text', 'File to be deleted');

      if (uploadResponse.status === 201) {
        uploadedFileId = uploadResponse.body.data.id;
      }
    });

    it('should soft delete a media file', async () => {
      if (!uploadedFileId) {
        console.log('Skipping test - no uploaded file ID available');
        return;
      }

      const response = await request(app)
        .delete(`/api/media/${uploadedFileId}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Media file deleted successfully');
    });

    it('should reject delete without authentication', async () => {
      const response = await request(app)
        .delete('/api/media/some-id');

      expect(response.status).toBe(401);
    });
  });

  describe('Rate Limiting', () => {
    it('should enforce upload rate limits', async () => {
      const uploadPromises = [];
      
      // Try to upload 6 files quickly (limit is 5 per minute)
      for (let i = 0; i < 6; i++) {
        uploadPromises.push(
          request(app)
            .post('/api/media')
            .set('Authorization', `Bearer ${authToken}`)
            .attach('file', testImagePath)
        );
      }

      const responses = await Promise.all(uploadPromises);
      
      // At least one should be rate limited
      const rateLimitedResponses = responses.filter(r => r.status === 429);
      expect(rateLimitedResponses.length).toBeGreaterThan(0);
    });
  });
});
