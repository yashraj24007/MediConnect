-- Update Supabase configuration to disable email confirmation
-- This will be handled through the Supabase dashboard, but we can set up functions to handle auto-confirmation

-- Create a function to automatically confirm users
CREATE OR REPLACE FUNCTION public.auto_confirm_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- This function will help with auto-confirmation logic if needed
  -- The main email confirmation setting needs to be changed in Supabase dashboard
  RETURN NEW;
END;
$$;

-- Make all appointments free by default
UPDATE public.appointments SET fee = 0 WHERE fee > 0;

-- Update default fee for appointments to be 0
ALTER TABLE public.appointments ALTER COLUMN fee SET DEFAULT 0;

-- Create an index on appointment_date for better performance
CREATE INDEX IF NOT EXISTS idx_appointments_date ON public.appointments(appointment_date);

-- Create an index on patient_id for better performance  
CREATE INDEX IF NOT EXISTS idx_appointments_patient ON public.appointments(patient_id);

-- Create an index on doctor_id for better performance
CREATE INDEX IF NOT EXISTS idx_appointments_doctor ON public.appointments(doctor_id);