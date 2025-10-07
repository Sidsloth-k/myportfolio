BEGIN;

-- Enable Row Level Security on all tables
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE technologies ENABLE ROW LEVEL SECURITY;
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
CREATE POLICY "Allow public read access to projects" ON projects
    FOR SELECT USING (true);

CREATE POLICY "Allow authenticated users to insert projects" ON projects
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update projects" ON projects
    FOR UPDATE USING (true);

CREATE POLICY "Allow admin users to delete projects" ON projects
    FOR DELETE USING (true);

-- Skills table policies
CREATE POLICY "Allow public read access to skills" ON skills
    FOR SELECT USING (true);

CREATE POLICY "Allow authenticated users to insert skills" ON skills
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update skills" ON skills
    FOR UPDATE USING (true);

CREATE POLICY "Allow admin users to delete skills" ON skills
    FOR DELETE USING (true);

-- Technologies table policies
CREATE POLICY "Allow public read access to technologies" ON technologies
    FOR SELECT USING (true);

CREATE POLICY "Allow authenticated users to insert technologies" ON technologies
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update technologies" ON technologies
    FOR UPDATE USING (true);

CREATE POLICY "Allow admin users to delete technologies" ON technologies
    FOR DELETE USING (true);

-- Skill categories table policies
CREATE POLICY "Allow public read access to skill_categories" ON skill_categories
    FOR SELECT USING (true);

CREATE POLICY "Allow authenticated users to insert skill_categories" ON skill_categories
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update skill_categories" ON skill_categories
    FOR UPDATE USING (true);

CREATE POLICY "Allow admin users to delete skill_categories" ON skill_categories
    FOR DELETE USING (true);

-- Skill projects junction table policies
CREATE POLICY "Allow public read access to skill_projects" ON skill_projects
    FOR SELECT USING (true);

CREATE POLICY "Allow authenticated users to insert skill_projects" ON skill_projects
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update skill_projects" ON skill_projects
    FOR UPDATE USING (true);

CREATE POLICY "Allow admin users to delete skill_projects" ON skill_projects
    FOR DELETE USING (true);

-- Project features table policies
CREATE POLICY "Allow public read access to project_features" ON project_features
    FOR SELECT USING (true);

CREATE POLICY "Allow authenticated users to insert project_features" ON project_features
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update project_features" ON project_features
    FOR UPDATE USING (true);

CREATE POLICY "Allow admin users to delete project_features" ON project_features
    FOR DELETE USING (true);

-- Project images table policies
CREATE POLICY "Allow public read access to project_images" ON project_images
    FOR SELECT USING (true);

CREATE POLICY "Allow authenticated users to insert project_images" ON project_images
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update project_images" ON project_images
    FOR UPDATE USING (true);

CREATE POLICY "Allow admin users to delete project_images" ON project_images
    FOR DELETE USING (true);

-- Project links table policies
CREATE POLICY "Allow public read access to project_links" ON project_links
    FOR SELECT USING (true);

CREATE POLICY "Allow authenticated users to insert project_links" ON project_links
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update project_links" ON project_links
    FOR UPDATE USING (true);

CREATE POLICY "Allow admin users to delete project_links" ON project_links
    FOR DELETE USING (true);

-- Project metrics table policies
CREATE POLICY "Allow public read access to project_metrics" ON project_metrics
    FOR SELECT USING (true);

CREATE POLICY "Allow authenticated users to insert project_metrics" ON project_metrics
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update project_metrics" ON project_metrics
    FOR UPDATE USING (true);

CREATE POLICY "Allow admin users to delete project_metrics" ON project_metrics
    FOR DELETE USING (true);

-- Project roadmap phases table policies
CREATE POLICY "Allow public read access to project_roadmap_phases" ON project_roadmap_phases
    FOR SELECT USING (true);

CREATE POLICY "Allow authenticated users to insert project_roadmap_phases" ON project_roadmap_phases
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update project_roadmap_phases" ON project_roadmap_phases
    FOR UPDATE USING (true);

CREATE POLICY "Allow admin users to delete project_roadmap_phases" ON project_roadmap_phases
    FOR DELETE USING (true);

-- Project stats table policies
CREATE POLICY "Allow public read access to project_stats" ON project_stats
    FOR SELECT USING (true);

CREATE POLICY "Allow authenticated users to insert project_stats" ON project_stats
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update project_stats" ON project_stats
    FOR UPDATE USING (true);

CREATE POLICY "Allow admin users to delete project_stats" ON project_stats
    FOR DELETE USING (true);

-- Project technologies junction table policies
CREATE POLICY "Allow public read access to project_technologies" ON project_technologies
    FOR SELECT USING (true);

CREATE POLICY "Allow authenticated users to insert project_technologies" ON project_technologies
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update project_technologies" ON project_technologies
    FOR UPDATE USING (true);

CREATE POLICY "Allow admin users to delete project_technologies" ON project_technologies
    FOR DELETE USING (true);

-- Project testimonials table policies
CREATE POLICY "Allow public read access to project_testimonials" ON project_testimonials
    FOR SELECT USING (true);

CREATE POLICY "Allow authenticated users to insert project_testimonials" ON project_testimonials
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update project_testimonials" ON project_testimonials
    FOR UPDATE USING (true);

CREATE POLICY "Allow admin users to delete project_testimonials" ON project_testimonials
    FOR DELETE USING (true);

-- Contact info table policies
CREATE POLICY "Allow public read access to contact_info" ON contact_info
    FOR SELECT USING (true);

CREATE POLICY "Allow admin users to insert contact_info" ON contact_info
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow admin users to update contact_info" ON contact_info
    FOR UPDATE USING (true);

CREATE POLICY "Allow admin users to delete contact_info" ON contact_info
    FOR DELETE USING (true);

-- Contact submissions table policies
CREATE POLICY "Allow public read access to contact_submissions" ON contact_submissions
    FOR SELECT USING (true);

CREATE POLICY "Allow public insert to contact_submissions" ON contact_submissions
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow admin users to update contact_submissions" ON contact_submissions
    FOR UPDATE USING (true);

CREATE POLICY "Allow admin users to delete contact_submissions" ON contact_submissions
    FOR DELETE USING (true);

-- Media files table policies
CREATE POLICY "Allow public read access to media_files" ON media_files
    FOR SELECT USING (is_active = true);

CREATE POLICY "Allow authenticated users to insert media_files" ON media_files
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update media_files" ON media_files
    FOR UPDATE USING (true);

CREATE POLICY "Allow admin users to delete media_files" ON media_files
    FOR DELETE USING (true);

-- Create indexes for better performance with RLS
CREATE INDEX IF NOT EXISTS idx_projects_active ON projects(id) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_skills_active ON skills(id) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_media_files_active ON media_files(id) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_contact_submissions_status ON contact_submissions(status);

COMMIT;
