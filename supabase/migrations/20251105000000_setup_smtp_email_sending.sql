-- Setup SMTP Email Sending via Supabase
-- This migration creates a function to send emails using Supabase's SMTP configuration

-- Create extension for HTTP requests if not exists
CREATE EXTENSION IF NOT EXISTS http;

-- Create a function to send email via Supabase SMTP (using pg_net or custom webhook)
-- Note: This is a placeholder. Supabase doesn't directly expose SMTP from SQL.
-- You'll need to use one of these approaches:
-- 1. Database Webhooks (recommended)
-- 2. Edge Functions
-- 3. External service

-- For now, let's create a webhook that can be triggered
-- You'll need to set this up in Supabase Dashboard > Database > Webhooks

-- Update email_notifications table to track sending status
ALTER TABLE email_notifications 
ADD COLUMN IF NOT EXISTS sent_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS failed_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS error_message TEXT;

-- Create index for unsent emails
CREATE INDEX IF NOT EXISTS idx_email_notifications_unsent 
ON email_notifications(created_at) 
WHERE sent_at IS NULL AND failed_at IS NULL;

-- Add comment explaining the setup
COMMENT ON TABLE email_notifications IS 
'Stores email notifications to be sent via Supabase SMTP. 
Configure a Database Webhook in Supabase Dashboard to trigger email sending:
1. Go to Database > Webhooks
2. Create webhook for table: email_notifications
3. Events: INSERT
4. Set up external service to process emails via SMTP';

-- Grant necessary permissions
GRANT SELECT, INSERT, UPDATE ON email_notifications TO authenticated;
GRANT SELECT, INSERT, UPDATE ON email_notifications TO service_role;

