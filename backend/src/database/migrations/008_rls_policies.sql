BEGIN;

-- Helper function to create policy if it doesn't exist
CREATE OR REPLACE FUNCTION create_policy_if_not_exists(
    table_name text,
    policy_name text,
    policy_command text,
    policy_definition text
) RETURNS void AS $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = table_name AND policyname = policy_name
    ) THEN
        EXECUTE format('CREATE POLICY %I ON %I %s %s', 
            policy_name, table_name, policy_command, policy_definition);
    END IF;
END;
$$ LANGUAGE plpgsql;

-- Enable Row Level Security on all tables
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE skill_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE skill_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_features ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_roadmap_phases ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_technologies ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_info ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE media_files ENABLE ROW LEVEL SECURITY;

-- Projects table policies
SELECT create_policy_if_not_exists('projects', 'Allow public read access to projects', 'FOR SELECT', 'USING (true)');
SELECT create_policy_if_not_exists('projects', 'Allow authenticated users to insert projects', 'FOR INSERT', 'WITH CHECK (true)');
SELECT create_policy_if_not_exists('projects', 'Allow authenticated users to update projects', 'FOR UPDATE', 'USING (true)');
SELECT create_policy_if_not_exists('projects', 'Allow admin users to delete projects', 'FOR DELETE', 'USING (true)');

-- Skills table policies
SELECT create_policy_if_not_exists('skills', 'Allow public read access to skills', 'FOR SELECT', 'USING (true)');
SELECT create_policy_if_not_exists('skills', 'Allow authenticated users to insert skills', 'FOR INSERT', 'WITH CHECK (true)');
SELECT create_policy_if_not_exists('skills', 'Allow authenticated users to update skills', 'FOR UPDATE', 'USING (true)');
SELECT create_policy_if_not_exists('skills', 'Allow admin users to delete skills', 'FOR DELETE', 'USING (true)');

-- Technologies table policies (removed - table will be dropped)

-- Skill categories table policies
SELECT create_policy_if_not_exists('skill_categories', 'Allow public read access to skill_categories', 'FOR SELECT', 'USING (true)');
SELECT create_policy_if_not_exists('skill_categories', 'Allow authenticated users to insert skill_categories', 'FOR INSERT', 'WITH CHECK (true)');
SELECT create_policy_if_not_exists('skill_categories', 'Allow authenticated users to update skill_categories', 'FOR UPDATE', 'USING (true)');
SELECT create_policy_if_not_exists('skill_categories', 'Allow admin users to delete skill_categories', 'FOR DELETE', 'USING (true)');

-- Skill projects junction table policies
SELECT create_policy_if_not_exists('skill_projects', 'Allow public read access to skill_projects', 'FOR SELECT', 'USING (true)');
SELECT create_policy_if_not_exists('skill_projects', 'Allow authenticated users to insert skill_projects', 'FOR INSERT', 'WITH CHECK (true)');
SELECT create_policy_if_not_exists('skill_projects', 'Allow authenticated users to update skill_projects', 'FOR UPDATE', 'USING (true)');
SELECT create_policy_if_not_exists('skill_projects', 'Allow admin users to delete skill_projects', 'FOR DELETE', 'USING (true)');

-- Project features table policies
SELECT create_policy_if_not_exists('project_features', 'Allow public read access to project_features', 'FOR SELECT', 'USING (true)');
SELECT create_policy_if_not_exists('project_features', 'Allow authenticated users to insert project_features', 'FOR INSERT', 'WITH CHECK (true)');
SELECT create_policy_if_not_exists('project_features', 'Allow authenticated users to update project_features', 'FOR UPDATE', 'USING (true)');
SELECT create_policy_if_not_exists('project_features', 'Allow admin users to delete project_features', 'FOR DELETE', 'USING (true)');

-- Project images table policies
SELECT create_policy_if_not_exists('project_images', 'Allow public read access to project_images', 'FOR SELECT', 'USING (true)');
SELECT create_policy_if_not_exists('project_images', 'Allow authenticated users to insert project_images', 'FOR INSERT', 'WITH CHECK (true)');
SELECT create_policy_if_not_exists('project_images', 'Allow authenticated users to update project_images', 'FOR UPDATE', 'USING (true)');
SELECT create_policy_if_not_exists('project_images', 'Allow admin users to delete project_images', 'FOR DELETE', 'USING (true)');

-- Project links table policies
SELECT create_policy_if_not_exists('project_links', 'Allow public read access to project_links', 'FOR SELECT', 'USING (true)');
SELECT create_policy_if_not_exists('project_links', 'Allow authenticated users to insert project_links', 'FOR INSERT', 'WITH CHECK (true)');
SELECT create_policy_if_not_exists('project_links', 'Allow authenticated users to update project_links', 'FOR UPDATE', 'USING (true)');
SELECT create_policy_if_not_exists('project_links', 'Allow admin users to delete project_links', 'FOR DELETE', 'USING (true)');

-- Project metrics table policies
SELECT create_policy_if_not_exists('project_metrics', 'Allow public read access to project_metrics', 'FOR SELECT', 'USING (true)');
SELECT create_policy_if_not_exists('project_metrics', 'Allow authenticated users to insert project_metrics', 'FOR INSERT', 'WITH CHECK (true)');
SELECT create_policy_if_not_exists('project_metrics', 'Allow authenticated users to update project_metrics', 'FOR UPDATE', 'USING (true)');
SELECT create_policy_if_not_exists('project_metrics', 'Allow admin users to delete project_metrics', 'FOR DELETE', 'USING (true)');

-- Project roadmap phases table policies
SELECT create_policy_if_not_exists('project_roadmap_phases', 'Allow public read access to project_roadmap_phases', 'FOR SELECT', 'USING (true)');
SELECT create_policy_if_not_exists('project_roadmap_phases', 'Allow authenticated users to insert project_roadmap_phases', 'FOR INSERT', 'WITH CHECK (true)');
SELECT create_policy_if_not_exists('project_roadmap_phases', 'Allow authenticated users to update project_roadmap_phases', 'FOR UPDATE', 'USING (true)');
SELECT create_policy_if_not_exists('project_roadmap_phases', 'Allow admin users to delete project_roadmap_phases', 'FOR DELETE', 'USING (true)');

-- Project stats table policies
SELECT create_policy_if_not_exists('project_stats', 'Allow public read access to project_stats', 'FOR SELECT', 'USING (true)');
SELECT create_policy_if_not_exists('project_stats', 'Allow authenticated users to insert project_stats', 'FOR INSERT', 'WITH CHECK (true)');
SELECT create_policy_if_not_exists('project_stats', 'Allow authenticated users to update project_stats', 'FOR UPDATE', 'USING (true)');
SELECT create_policy_if_not_exists('project_stats', 'Allow admin users to delete project_stats', 'FOR DELETE', 'USING (true)');

-- Project technologies junction table policies
SELECT create_policy_if_not_exists('project_technologies', 'Allow public read access to project_technologies', 'FOR SELECT', 'USING (true)');
SELECT create_policy_if_not_exists('project_technologies', 'Allow authenticated users to insert project_technologies', 'FOR INSERT', 'WITH CHECK (true)');
SELECT create_policy_if_not_exists('project_technologies', 'Allow authenticated users to update project_technologies', 'FOR UPDATE', 'USING (true)');
SELECT create_policy_if_not_exists('project_technologies', 'Allow admin users to delete project_technologies', 'FOR DELETE', 'USING (true)');

-- Project testimonials table policies
SELECT create_policy_if_not_exists('project_testimonials', 'Allow public read access to project_testimonials', 'FOR SELECT', 'USING (true)');
SELECT create_policy_if_not_exists('project_testimonials', 'Allow authenticated users to insert project_testimonials', 'FOR INSERT', 'WITH CHECK (true)');
SELECT create_policy_if_not_exists('project_testimonials', 'Allow authenticated users to update project_testimonials', 'FOR UPDATE', 'USING (true)');
SELECT create_policy_if_not_exists('project_testimonials', 'Allow admin users to delete project_testimonials', 'FOR DELETE', 'USING (true)');

-- Contact info table policies
SELECT create_policy_if_not_exists('contact_info', 'Allow public read access to contact_info', 'FOR SELECT', 'USING (true)');
SELECT create_policy_if_not_exists('contact_info', 'Allow admin users to insert contact_info', 'FOR INSERT', 'WITH CHECK (true)');
SELECT create_policy_if_not_exists('contact_info', 'Allow admin users to update contact_info', 'FOR UPDATE', 'USING (true)');
SELECT create_policy_if_not_exists('contact_info', 'Allow admin users to delete contact_info', 'FOR DELETE', 'USING (true)');

-- Contact submissions table policies
SELECT create_policy_if_not_exists('contact_submissions', 'Allow public read access to contact_submissions', 'FOR SELECT', 'USING (true)');
SELECT create_policy_if_not_exists('contact_submissions', 'Allow public insert to contact_submissions', 'FOR INSERT', 'WITH CHECK (true)');
SELECT create_policy_if_not_exists('contact_submissions', 'Allow admin users to update contact_submissions', 'FOR UPDATE', 'USING (true)');
SELECT create_policy_if_not_exists('contact_submissions', 'Allow admin users to delete contact_submissions', 'FOR DELETE', 'USING (true)');

-- Media files table policies
SELECT create_policy_if_not_exists('media_files', 'Allow public read access to media_files', 'FOR SELECT', 'USING (is_active = true)');
SELECT create_policy_if_not_exists('media_files', 'Allow authenticated users to insert media_files', 'FOR INSERT', 'WITH CHECK (true)');
SELECT create_policy_if_not_exists('media_files', 'Allow authenticated users to update media_files', 'FOR UPDATE', 'USING (true)');
SELECT create_policy_if_not_exists('media_files', 'Allow admin users to delete media_files', 'FOR DELETE', 'USING (true)');

-- Create indexes for better performance with RLS
CREATE INDEX IF NOT EXISTS idx_projects_active ON projects(id) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_skills_active ON skills(id) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_media_files_active ON media_files(id) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_contact_submissions_status ON contact_submissions(status);

-- Clean up helper function
DROP FUNCTION IF EXISTS create_policy_if_not_exists(text, text, text, text);

COMMIT;
