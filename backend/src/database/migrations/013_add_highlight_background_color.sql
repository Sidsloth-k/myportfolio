BEGIN;

-- Add highlight_background_color column to projects table
ALTER TABLE projects 
ADD COLUMN IF NOT EXISTS highlight_background_color TEXT;

-- Add comment for documentation
COMMENT ON COLUMN projects.highlight_background_color IS 'Background color for the highlight badge (hex code, e.g., #FF5733)';

COMMIT;

