BEGIN;

-- Add contact_type field to contact_info table
ALTER TABLE contact_info ADD COLUMN IF NOT EXISTS contact_type TEXT DEFAULT 'email';

-- Update existing contact info with proper types
UPDATE contact_info SET contact_type = 'email' WHERE key = 'detective_email';
UPDATE contact_info SET contact_type = 'location' WHERE key = 'agency_location';
UPDATE contact_info SET contact_type = 'phone' WHERE key = 'emergency_line';

-- Add new contact entries with different types
INSERT INTO contact_info (key, label, value, contact_values, description, icon_key, display_order, contact_type) VALUES
('whatsapp_line', 'WhatsApp Line', '+81-XX-XXXX-XXXX', ARRAY['+81-XX-XXXX-XXXX'], 'WhatsApp for quick messaging', 'message-circle', 5, 'whatsapp'),
('direct_call', 'Direct Call', '+81-YY-YYYY-YYYY', ARRAY['+81-YY-YYYY-YYYY'], 'Direct phone call line', 'phone', 6, 'phone')
ON CONFLICT (key) DO NOTHING;

COMMIT;
