BEGIN;

-- Add contact_values column to existing contact_info table
ALTER TABLE contact_info ADD COLUMN IF NOT EXISTS contact_values TEXT[];

-- Update existing records to have contact_values based on their current value
UPDATE contact_info 
SET contact_values = ARRAY[value] 
WHERE contact_values IS NULL;

-- Insert additional contact information with multiple values
INSERT INTO contact_info (key, label, value, contact_values, description, icon_key, display_order) VALUES
('detective_email', 'Detective Email', 'sidney@detective-agency.dev', ARRAY['sidney@detective-agency.dev', 'contact@detective-agency.dev'], 'Primary communication channel', 'mail', 1),
('agency_location', 'Agency Location', 'Yokohama, Japan', ARRAY['Yokohama, Japan', 'Tokyo Office', 'Osaka Branch'], 'Armed Detective Agency HQ', 'map-pin', 2),
('emergency_line', 'Emergency Line', '+81-XX-XXXX-XXXX', ARRAY['+81-XX-XXXX-XXXX', '+81-YY-YYYY-YYYY'], 'For urgent investigations only', 'phone', 3)
ON CONFLICT (key) DO UPDATE SET 
  contact_values = EXCLUDED.contact_values,
  updated_at = NOW();

COMMIT;
