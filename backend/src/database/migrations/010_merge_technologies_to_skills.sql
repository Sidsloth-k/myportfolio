BEGIN;

-- Step 1: Add missing columns to skills table to match technologies structure
ALTER TABLE skills ADD COLUMN IF NOT EXISTS icon TEXT;
ALTER TABLE skills ADD COLUMN IF NOT EXISTS level TEXT;

-- Step 2: Migrate data from technologies to skills
-- First, insert technologies that don't already exist in skills
INSERT INTO skills (
  name, 
  category, 
  icon, 
  is_active,
  display_order
)
SELECT 
  t.name,
  t.category,
  t.icon,
  TRUE as is_active,
  999 as display_order
FROM technologies t
WHERE NOT EXISTS (
  SELECT 1 FROM skills s WHERE s.name = t.name
);

-- Step 3: Create a temporary mapping table to track technology_id -> skill_id
CREATE TEMP TABLE tech_to_skill_mapping AS
SELECT 
  t.id as technology_id,
  s.id as skill_id
FROM technologies t
JOIN skills s ON s.name = t.name;

-- Step 4: Update project_technologies to reference skills instead of technologies
-- First, create a new table with the updated structure
CREATE TABLE IF NOT EXISTS project_technologies_new (
  project_id     BIGINT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  skill_id       BIGINT NOT NULL REFERENCES skills(id) ON DELETE RESTRICT,
  level          TEXT,
  PRIMARY KEY (project_id, skill_id)
);

-- Step 5: Migrate data from project_technologies to project_technologies_new
INSERT INTO project_technologies_new (project_id, skill_id, level)
SELECT 
  pt.project_id,
  tsm.skill_id,
  pt.level
FROM project_technologies pt
JOIN tech_to_skill_mapping tsm ON tsm.technology_id = pt.technology_id;

-- Step 6: Drop the old project_technologies table and rename the new one
DROP TABLE IF EXISTS project_technologies;
ALTER TABLE project_technologies_new RENAME TO project_technologies;

-- Step 7: Create indexes for the new table
CREATE INDEX IF NOT EXISTS idx_project_tech_project ON project_technologies(project_id);
CREATE INDEX IF NOT EXISTS idx_project_tech_skill ON project_technologies(skill_id);

-- Step 8: Drop the technologies table
DROP TABLE IF EXISTS technologies;

-- Step 9: Update any remaining references
-- Update skills table to ensure all migrated technologies have proper fields
UPDATE skills 
SET 
  icon = COALESCE(icon, 'Code'),
  is_active = COALESCE(is_active, TRUE),
  display_order = COALESCE(display_order, 999)
WHERE icon IS NULL;

COMMIT;
