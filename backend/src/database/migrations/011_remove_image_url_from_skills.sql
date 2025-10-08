BEGIN;

-- Remove image_url column from skills table as it's not needed
ALTER TABLE skills DROP COLUMN IF EXISTS image_url;

COMMIT;
