BEGIN;

-- Add alt column to project_images table
ALTER TABLE project_images
ADD COLUMN IF NOT EXISTS alt TEXT;

-- Add comment for documentation
COMMENT ON COLUMN project_images.alt IS 'Alternative text for images (used for accessibility and fallback display)';

-- Set default alt from caption for existing rows if alt is null
UPDATE project_images
SET alt = caption
WHERE alt IS NULL;

COMMIT;
