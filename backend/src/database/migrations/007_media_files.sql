BEGIN;

-- Create media_files table for file uploads
CREATE TABLE IF NOT EXISTS media_files (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  filename TEXT NOT NULL,
  original_filename TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_size BIGINT NOT NULL,
  mime_type TEXT NOT NULL,
  alt_text TEXT,
  caption TEXT,
  tags TEXT[],
  uploaded_by UUID,
  storage_provider TEXT DEFAULT 'local' CHECK (storage_provider IN ('local', 'r2', 'supabase', 'cloudinary')),
  cloud_url TEXT,
  local_path TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_media_files_storage_provider ON media_files(storage_provider);
CREATE INDEX IF NOT EXISTS idx_media_files_mime_type ON media_files(mime_type);
CREATE INDEX IF NOT EXISTS idx_media_files_uploaded_by ON media_files(uploaded_by);
CREATE INDEX IF NOT EXISTS idx_media_files_is_active ON media_files(is_active);
CREATE INDEX IF NOT EXISTS idx_media_files_created_at ON media_files(created_at);
CREATE INDEX IF NOT EXISTS idx_media_files_tags ON media_files USING GIN(tags);

-- Add image_url column to projects table if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'projects' AND column_name = 'image_url') THEN
        ALTER TABLE projects ADD COLUMN image_url TEXT;
    END IF;
END $$;

-- Add image_url column to skills table if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'skills' AND column_name = 'image_url') THEN
        ALTER TABLE skills ADD COLUMN image_url TEXT;
    END IF;
END $$;

-- Add image_url column to hero table if it doesn't exist (skip if table doesn't exist)
DO $$ 
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'hero') THEN
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                       WHERE table_name = 'hero' AND column_name = 'image_url') THEN
            ALTER TABLE hero ADD COLUMN image_url TEXT;
        END IF;
    END IF;
END $$;

COMMIT;
