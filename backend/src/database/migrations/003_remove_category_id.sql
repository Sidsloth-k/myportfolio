BEGIN;

-- Remove category_id column from skills table since we're using category field directly
ALTER TABLE skills DROP COLUMN IF EXISTS category_id;

-- Make category field NOT NULL since it's now the primary way to categorize skills
ALTER TABLE skills ALTER COLUMN category SET NOT NULL;

COMMIT;
