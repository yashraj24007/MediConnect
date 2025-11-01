-- Email Notifications Feature Migration
-- Created: 2025-11-01
-- Purpose: Add email notification tracking and queue system

-- Create email_notifications table to track sent emails
CREATE TABLE IF NOT EXISTS public.email_notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  recipient_email TEXT NOT NULL,
  recipient_name TEXT,
  email_type TEXT NOT NULL CHECK (email_type IN ('appointment_confirmation', 'appointment_reminder', 'appointment_cancellation', 'appointment_reschedule')),
  subject TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'failed', 'queued')),
  appointment_id UUID REFERENCES public.appointments(id) ON DELETE SET NULL,
  sent_at TIMESTAMP WITH TIME ZONE,
  failed_reason TEXT,
  retry_count INTEGER DEFAULT 0,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_email_notifications_status ON public.email_notifications(status);
CREATE INDEX IF NOT EXISTS idx_email_notifications_recipient ON public.email_notifications(recipient_email);
CREATE INDEX IF NOT EXISTS idx_email_notifications_appointment ON public.email_notifications(appointment_id);
CREATE INDEX IF NOT EXISTS idx_email_notifications_created ON public.email_notifications(created_at DESC);

-- Enable RLS
ALTER TABLE public.email_notifications ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Users can view their own email notifications
CREATE POLICY "Users can view their own email notifications" ON public.email_notifications
  FOR SELECT USING (
    recipient_email = (SELECT email FROM public.profiles WHERE user_id = auth.uid())
  );

-- Admins can view all email notifications
CREATE POLICY "Admins can view all email notifications" ON public.email_notifications
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- System can insert email notifications (service role)
CREATE POLICY "System can manage email notifications" ON public.email_notifications
  FOR ALL USING (true);

-- Create function to automatically send email notification after appointment booking
CREATE OR REPLACE FUNCTION public.send_appointment_email_notification()
RETURNS TRIGGER AS $$
DECLARE
  patient_email TEXT;
  patient_name TEXT;
  doctor_name TEXT;
  doctor_specialty TEXT;
BEGIN
  -- Get patient details
  SELECT p.email, p.first_name || ' ' || p.last_name
  INTO patient_email, patient_name
  FROM public.profiles p
  JOIN public.patients pt ON pt.profile_id = p.id
  WHERE pt.id = NEW.patient_id;

  -- Get doctor details
  SELECT p.first_name || ' ' || p.last_name, d.specialty
  INTO doctor_name, doctor_specialty
  FROM public.profiles p
  JOIN public.doctors d ON d.profile_id = p.id
  WHERE d.id = NEW.doctor_id;

  -- Insert email notification record
  IF NEW.status = 'scheduled' THEN
    INSERT INTO public.email_notifications (
      recipient_email,
      recipient_name,
      email_type,
      subject,
      status,
      appointment_id,
      metadata
    ) VALUES (
      patient_email,
      patient_name,
      'appointment_confirmation',
      '🎉 Appointment Confirmation - MediConnect',
      'pending',
      NEW.id,
      jsonb_build_object(
        'doctor_name', doctor_name,
        'specialty', doctor_specialty,
        'appointment_date', NEW.appointment_date,
        'start_time', NEW.start_time,
        'service_type', NEW.service_type,
        'fee', NEW.fee
      )
    );
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for appointment confirmation emails
DROP TRIGGER IF EXISTS trigger_send_appointment_email ON public.appointments;
CREATE TRIGGER trigger_send_appointment_email
  AFTER INSERT ON public.appointments
  FOR EACH ROW
  EXECUTE FUNCTION public.send_appointment_email_notification();

-- Create function to update email notification status
CREATE OR REPLACE FUNCTION public.update_email_notification_status(
  notification_id UUID,
  new_status TEXT,
  error_message TEXT DEFAULT NULL
)
RETURNS VOID AS $$
BEGIN
  UPDATE public.email_notifications
  SET 
    status = new_status,
    sent_at = CASE WHEN new_status = 'sent' THEN NOW() ELSE sent_at END,
    failed_reason = error_message,
    retry_count = CASE WHEN new_status = 'failed' THEN retry_count + 1 ELSE retry_count END,
    updated_at = NOW()
  WHERE id = notification_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant necessary permissions
GRANT SELECT, INSERT, UPDATE ON public.email_notifications TO authenticated;
GRANT ALL ON public.email_notifications TO service_role;

-- Add comments for documentation
COMMENT ON TABLE public.email_notifications IS 'Tracks all email notifications sent from the platform';
COMMENT ON COLUMN public.email_notifications.email_type IS 'Type of email: appointment_confirmation, appointment_reminder, etc.';
COMMENT ON COLUMN public.email_notifications.status IS 'Current status: pending, sent, failed, queued';
COMMENT ON COLUMN public.email_notifications.metadata IS 'JSON data containing email-specific details';
COMMENT ON FUNCTION public.send_appointment_email_notification() IS 'Automatically creates email notification record when appointment is booked';

-- Create a view for email statistics (useful for admin dashboard)
CREATE OR REPLACE VIEW public.email_notification_stats AS
SELECT 
  email_type,
  status,
  COUNT(*) as count,
  DATE(created_at) as date
FROM public.email_notifications
GROUP BY email_type, status, DATE(created_at)
ORDER BY date DESC, email_type, status;

GRANT SELECT ON public.email_notification_stats TO authenticated;

-- Success message
DO $$
BEGIN
  RAISE NOTICE 'Email notifications feature successfully installed!';
  RAISE NOTICE 'Features added:';
  RAISE NOTICE '  - Email notification tracking table';
  RAISE NOTICE '  - Automatic email queue on appointment booking';
  RAISE NOTICE '  - Email status management functions';
  RAISE NOTICE '  - Email statistics view';
END $$;
