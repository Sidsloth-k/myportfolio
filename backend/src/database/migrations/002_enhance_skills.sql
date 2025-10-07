BEGIN;

-- Create skill_categories table
CREATE TABLE IF NOT EXISTS skill_categories (
  id                BIGSERIAL PRIMARY KEY,
  name              TEXT NOT NULL UNIQUE,
  description       TEXT,
  color             TEXT,
  icon              TEXT,
  display_order     INT DEFAULT 0,
  is_active         BOOLEAN DEFAULT TRUE,
  created_at        TIMESTAMPTZ DEFAULT NOW(),
  updated_at        TIMESTAMPTZ DEFAULT NOW()
);

-- Add missing fields to skills table
ALTER TABLE skills ADD COLUMN IF NOT EXISTS proficiency_level INT;
ALTER TABLE skills ADD COLUMN IF NOT EXISTS years_experience TEXT;
ALTER TABLE skills ADD COLUMN IF NOT EXISTS description TEXT;
ALTER TABLE skills ADD COLUMN IF NOT EXISTS overview TEXT;
ALTER TABLE skills ADD COLUMN IF NOT EXISTS technologies JSONB;
ALTER TABLE skills ADD COLUMN IF NOT EXISTS key_achievements JSONB;
ALTER TABLE skills ADD COLUMN IF NOT EXISTS display_order INT DEFAULT 0;
ALTER TABLE skills ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT TRUE;
ALTER TABLE skills ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW();
ALTER TABLE skills ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- Add foreign key constraint for skills category_id to skill_categories
ALTER TABLE skills ADD COLUMN IF NOT EXISTS category_id BIGINT REFERENCES skill_categories(id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_skill_categories_active ON skill_categories(is_active);
CREATE INDEX IF NOT EXISTS idx_skill_categories_order ON skill_categories(display_order);
CREATE INDEX IF NOT EXISTS idx_skills_active ON skills(is_active);
CREATE INDEX IF NOT EXISTS idx_skills_category ON skills(category_id);
CREATE INDEX IF NOT EXISTS idx_skills_order ON skills(display_order);

COMMIT;
