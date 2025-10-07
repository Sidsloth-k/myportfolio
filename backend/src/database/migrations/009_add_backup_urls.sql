BEGIN;

-- Add backup URL fields for dual storage
ALTER TABLE media_files 
ADD COLUMN IF NOT EXISTS r2_url TEXT,
ADD COLUMN IF NOT EXISTS supabase_url TEXT,
ADD COLUMN IF NOT EXISTS backup_storage_provider TEXT DEFAULT 'supabase' CHECK (backup_storage_provider IN ('local', 'r2', 'supabase', 'cloudinary'));

-- Update existing records to use cloud_url as primary URL
UPDATE media_files 
SET r2_url = cloud_url 
WHERE storage_provider = 'r2' AND cloud_url IS NOT NULL;

UPDATE media_files 
SET supabase_url = cloud_url 
WHERE storage_provider = 'supabase' AND cloud_url IS NOT NULL;

-- Create indexes for backup URLs
CREATE INDEX IF NOT EXISTS idx_media_files_r2_url ON media_files(r2_url);
CREATE INDEX IF NOT EXISTS idx_media_files_supabase_url ON media_files(supabase_url);
CREATE INDEX IF NOT EXISTS idx_media_files_backup_storage_provider ON media_files(backup_storage_provider);

COMMIT;
