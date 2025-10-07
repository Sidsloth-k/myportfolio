BEGIN;

-- Create contact_submissions table for form submissions
CREATE TABLE IF NOT EXISTS contact_submissions (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name          TEXT NOT NULL,
  email         TEXT NOT NULL,
  subject       TEXT,
  message       TEXT NOT NULL,
  case_type     TEXT DEFAULT 'general',
  urgency_level TEXT DEFAULT 'medium' CHECK (urgency_level IN ('low', 'medium', 'high', 'urgent')),
  status        TEXT DEFAULT 'new' CHECK (status IN ('new', 'in_progress', 'resolved', 'closed')),
  is_read       BOOLEAN DEFAULT FALSE,
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

-- Create contact_info table for dynamic contact information
CREATE TABLE IF NOT EXISTS contact_info (
  id          BIGSERIAL PRIMARY KEY,
  key         TEXT UNIQUE NOT NULL,
  label       TEXT NOT NULL,
  value       TEXT NOT NULL,
  contact_values TEXT[], -- Array of multiple contact values
  description TEXT,
  icon_key    TEXT,
  display_order INT DEFAULT 0,
  is_active   BOOLEAN DEFAULT TRUE,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_contact_submissions_status ON contact_submissions(status);
CREATE INDEX IF NOT EXISTS idx_contact_submissions_created_at ON contact_submissions(created_at);
CREATE INDEX IF NOT EXISTS idx_contact_info_active ON contact_info(is_active);
CREATE INDEX IF NOT EXISTS idx_contact_info_order ON contact_info(display_order);

-- Insert default contact information (without contact_values for now)
INSERT INTO contact_info (key, label, value, description, icon_key, display_order) VALUES
('detective_email', 'Detective Email', 'sidney@detective-agency.dev', 'Primary communication channel', 'mail', 1),
('agency_location', 'Agency Location', 'Yokohama, Japan', 'Armed Detective Agency HQ', 'map-pin', 2),
('emergency_line', 'Emergency Line', '+81-XX-XXXX-XXXX', 'For urgent investigations only', 'phone', 3)
ON CONFLICT (key) DO NOTHING;

COMMIT;
