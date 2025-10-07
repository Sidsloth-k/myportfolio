# Image Upload Setup Guide

This guide will help you set up secure image and document upload functionality with Cloudflare R2 as the primary storage and Supabase as fallback.

## Overview

The image upload system supports:
- **Images**: JPEG, PNG, GIF, WebP, SVG (up to 5MB)
- **Documents**: PDF, DOC, DOCX (up to 10MB)
- **Archives**: ZIP, RAR, 7Z (up to 50MB)
- **Storage**: Cloudflare R2 (primary) + Supabase (fallback) + Local (emergency)
- **Security**: File validation, rate limiting, virus scanning, pre-signed URLs

## Prerequisites

- Node.js 18+ 
- PostgreSQL database
- Cloudflare account (for R2)
- Supabase account (for fallback storage)

## 1. Database Setup

Run the migration to create the media_files table:

```bash
npm run db:migrate
```

This will create:
- `media_files` table for file metadata
- `image_url` columns in `projects`, `skills`, and `hero` tables

## 2. Cloudflare R2 Setup (Primary Storage)

### Step 1: Create R2 Bucket

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. Navigate to **R2 Object Storage**
3. Click **Create bucket**
4. Choose a unique bucket name (e.g., `your-portfolio-media`)
5. Select a location close to your users

### Step 2: Get R2 Credentials

1. Go to **R2 Object Storage** → **Manage R2 API tokens**
2. Click **Create API token**
3. Choose **Custom token**
4. Set permissions:
   - **Object Read**: Yes
   - **Object Write**: Yes
   - **Object Delete**: Yes
5. Select your bucket
6. Copy the **Access Key ID** and **Secret Access Key**

### Step 3: Configure Custom Domain (Optional but Recommended)

1. In your R2 bucket settings, go to **Settings** → **Custom Domains**
2. Add a custom domain (e.g., `media.yourdomain.com`)
3. Follow the DNS setup instructions
4. This will be your `R2_PUBLIC_URL`

### Step 4: Update Environment Variables

Add to your `.env` file:

```env
# Cloudflare R2 Storage (Primary)
R2_BUCKET_NAME=your-bucket-name
R2_PUBLIC_URL=https://your-bucket.your-account.r2.cloudflarestorage.com
R2_ENDPOINT=https://your-account-id.r2.cloudflarestorage.com
R2_ACCESS_KEY_ID=your-access-key-id
R2_SECRET_ACCESS_KEY=your-secret-access-key
```

## 3. Supabase Storage Setup (Fallback)

### Step 1: Create Storage Bucket

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Go to **Storage** in the sidebar
4. Click **Create bucket**
5. Name it `media-files`
6. Make it **Public** (for easy access)
7. Set up Row Level Security (RLS) policies

### Step 2: Configure RLS Policies

Create these policies in Supabase SQL Editor:

```sql
-- Allow authenticated users to upload files
CREATE POLICY "Allow authenticated uploads" ON storage.objects
FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Allow public read access
CREATE POLICY "Allow public read access" ON storage.objects
FOR SELECT USING (true);

-- Allow authenticated users to delete their own files
CREATE POLICY "Allow authenticated deletes" ON storage.objects
FOR DELETE USING (auth.role() = 'authenticated');
```

### Step 3: Update Environment Variables

Add to your `.env` file:

```env
# Supabase Storage (Fallback)
SUPABASE_STORAGE_BUCKET=media-files
SUPABASE_ANON_KEY=your-supabase-anon-key
```

## 4. Install Dependencies

```bash
npm install @aws-sdk/client-s3 @aws-sdk/s3-request-presigner
```

## 5. Test the Setup

### Test File Upload

```bash
# Start the server
npm run dev

# Test upload (replace with your auth token)
curl -X POST http://localhost:5000/api/media \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -F "file=@test-image.jpg" \
  -F "alt_text=Test image" \
  -F "caption=Testing upload functionality"
```

### Test File Retrieval

```bash
# Get all media files
curl http://localhost:5000/api/media

# Get specific file
curl http://localhost:5000/api/media/FILE_ID
```

## 6. Frontend Integration

### Upload Component Example

```javascript
const uploadFile = async (file, metadata = {}) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('alt_text', metadata.altText || '');
  formData.append('caption', metadata.caption || '');
  formData.append('tags', JSON.stringify(metadata.tags || []));

  const response = await fetch('/api/media', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${authToken}`
    },
    body: formData
  });

  return response.json();
};
```

### Display Images

```javascript
const ImageComponent = ({ imageId, alt, className }) => {
  const [imageUrl, setImageUrl] = useState('');

  useEffect(() => {
    fetch(`/api/media/${imageId}`)
      .then(res => res.json())
      .then(data => setImageUrl(data.data.url));
  }, [imageId]);

  return <img src={imageUrl} alt={alt} className={className} />;
};
```

## 7. Entity Integration

### Upload Image for Project

```javascript
const uploadProjectImage = async (projectId, file) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('entityType', 'project');
  formData.append('entityId', projectId);

  const response = await fetch('/api/media/entity-upload', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${authToken}` },
    body: formData
  });

  return response.json();
};
```

## 8. Security Features

### File Validation
- MIME type checking
- File signature verification
- Size limits per file type
- Extension whitelist

### Rate Limiting
- 5 uploads per minute per IP
- Configurable limits

### Access Control
- JWT authentication required
- Role-based permissions
- File ownership verification

## 9. Monitoring and Maintenance

### Health Checks

```bash
# Check storage providers
curl http://localhost:5000/api/media/health

# Check file integrity
curl http://localhost:5000/api/media/integrity-check
```

### Cleanup Scripts

```bash
# Remove orphaned files
npm run cleanup:orphaned-files

# Optimize storage
npm run optimize:storage
```

## 10. Troubleshooting

### Common Issues

1. **R2 Upload Fails**
   - Check credentials and bucket permissions
   - Verify endpoint URL format
   - Check CORS settings

2. **Supabase Upload Fails**
   - Verify RLS policies
   - Check bucket exists and is public
   - Verify API key permissions

3. **File Not Found**
   - Check if file exists in storage
   - Verify database records
   - Check URL generation

### Debug Mode

Enable debug logging:

```env
DEBUG=file-upload:*
NODE_ENV=development
```

## 11. Production Considerations

### Performance
- Use CDN for image delivery
- Implement image optimization
- Set up caching headers

### Security
- Enable HTTPS only
- Set up proper CORS
- Implement file scanning
- Regular security audits

### Backup
- Regular database backups
- Cross-region replication
- Disaster recovery plan

## Support

For issues or questions:
1. Check the logs: `npm run logs`
2. Run tests: `npm test`
3. Check health: `npm run health-check`
4. Review documentation in `/docs`

## Cost Optimization

### Cloudflare R2
- Free tier: 10GB storage, 1M requests/month
- No egress fees (unlike AWS S3)
- Pay only for storage used

### Supabase
- Free tier: 1GB storage, 2GB bandwidth/month
- Good for fallback and development

### Local Storage
- Free but limited scalability
- Good for development and emergency fallback
