-- Migration: Update consultation fees for Razorpay integration
-- Date: 2025-10-22
-- Description: Updates all doctors' consultation fees from 0 to realistic amounts

-- Update consultation_fee to NOT NULL and set default
ALTER TABLE public.doctors 
ALTER COLUMN consultation_fee SET DEFAULT 500.00,
ALTER COLUMN consultation_fee SET NOT NULL;

-- If you have existing doctors in the database, update their fees
-- This is a safe operation that only updates doctors with null or 0 fees
UPDATE public.doctors 
SET consultation_fee = CASE 
  WHEN specialty ILIKE '%cardiologist%' THEN 1000.00
  WHEN specialty ILIKE '%oncologist%' THEN 1500.00
  WHEN specialty ILIKE '%neurologist%' THEN 1200.00
  WHEN specialty ILIKE '%nephrologist%' THEN 1100.00
  WHEN specialty ILIKE '%ophthalmologist%' THEN 1000.00
  WHEN specialty ILIKE '%gastroenterologist%' THEN 950.00
  WHEN specialty ILIKE '%pulmonologist%' THEN 900.00
  WHEN specialty ILIKE '%orthopedic%' THEN 900.00
  WHEN specialty ILIKE '%urologist%' THEN 900.00
  WHEN specialty ILIKE '%dermatologist%' THEN 800.00
  WHEN specialty ILIKE '%gynecologist%' THEN 800.00
  WHEN specialty ILIKE '%endocrinologist%' THEN 800.00
  WHEN specialty ILIKE '%rheumatologist%' THEN 850.00
  WHEN specialty ILIKE '%psychiatrist%' THEN 850.00
  WHEN specialty ILIKE '%ent%' OR specialty ILIKE '%ear%nose%throat%' THEN 750.00
  WHEN specialty ILIKE '%radiologist%' THEN 800.00
  WHEN specialty ILIKE '%pediatrician%' THEN 600.00
  WHEN specialty ILIKE '%dentist%' THEN 600.00
  WHEN specialty ILIKE '%general physician%' OR specialty ILIKE '%general medicine%' THEN 500.00
  WHEN specialty ILIKE '%physiotherapist%' THEN 400.00
  ELSE 700.00 -- Default fee for other specialties
END
WHERE consultation_fee IS NULL OR consultation_fee = 0;

-- Add a comment to the consultation_fee column
COMMENT ON COLUMN public.doctors.consultation_fee IS 'Consultation fee in INR (Indian Rupees)';

-- Create an index on consultation_fee for faster filtering
CREATE INDEX IF NOT EXISTS idx_doctors_consultation_fee ON public.doctors(consultation_fee);

-- Add constraint to ensure consultation_fee is always positive
ALTER TABLE public.doctors 
ADD CONSTRAINT check_consultation_fee_positive 
CHECK (consultation_fee > 0);

-- Create a function to validate consultation fee range (optional, for data integrity)
CREATE OR REPLACE FUNCTION validate_consultation_fee()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.consultation_fee < 100 OR NEW.consultation_fee > 10000 THEN
    RAISE EXCEPTION 'Consultation fee must be between ₹100 and ₹10,000';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to validate consultation fee on insert/update
DROP TRIGGER IF EXISTS validate_consultation_fee_trigger ON public.doctors;
CREATE TRIGGER validate_consultation_fee_trigger
  BEFORE INSERT OR UPDATE OF consultation_fee ON public.doctors
  FOR EACH ROW
  EXECUTE FUNCTION validate_consultation_fee();

-- Add payment_status and payment_related columns to appointments table (if needed for Razorpay)
ALTER TABLE public.appointments 
ADD COLUMN IF NOT EXISTS payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'completed', 'failed', 'refunded')),
ADD COLUMN IF NOT EXISTS payment_id TEXT,
ADD COLUMN IF NOT EXISTS razorpay_order_id TEXT,
ADD COLUMN IF NOT EXISTS razorpay_payment_id TEXT,
ADD COLUMN IF NOT EXISTS razorpay_signature TEXT,
ADD COLUMN IF NOT EXISTS amount_paid DECIMAL(10,2),
ADD COLUMN IF NOT EXISTS payment_date TIMESTAMP WITH TIME ZONE;

-- Create index on payment_status for faster queries
CREATE INDEX IF NOT EXISTS idx_appointments_payment_status ON public.appointments(payment_status);

-- Create a payments table for detailed payment tracking
CREATE TABLE IF NOT EXISTS public.payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  appointment_id UUID REFERENCES public.appointments(id) ON DELETE CASCADE,
  patient_id UUID REFERENCES public.patients(id) ON DELETE CASCADE,
  doctor_id UUID REFERENCES public.doctors(id) ON DELETE CASCADE,
  amount DECIMAL(10,2) NOT NULL,
  currency TEXT DEFAULT 'INR',
  razorpay_order_id TEXT UNIQUE,
  razorpay_payment_id TEXT UNIQUE,
  razorpay_signature TEXT,
  status TEXT NOT NULL DEFAULT 'created' CHECK (status IN ('created', 'authorized', 'captured', 'failed', 'refunded')),
  payment_method TEXT,
  payment_metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for payments table
CREATE INDEX IF NOT EXISTS idx_payments_appointment_id ON public.payments(appointment_id);
CREATE INDEX IF NOT EXISTS idx_payments_patient_id ON public.payments(patient_id);
CREATE INDEX IF NOT EXISTS idx_payments_status ON public.payments(status);
CREATE INDEX IF NOT EXISTS idx_payments_created_at ON public.payments(created_at DESC);

-- Add RLS policies for payments table
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

-- Patients can view their own payments
CREATE POLICY "Patients can view own payments" ON public.payments
  FOR SELECT USING (
    patient_id IN (
      SELECT id FROM public.patients WHERE profile_id = auth.uid()
    )
  );

-- Doctors can view payments for their appointments
CREATE POLICY "Doctors can view their payments" ON public.payments
  FOR SELECT USING (
    doctor_id IN (
      SELECT id FROM public.doctors WHERE profile_id = auth.uid()
    )
  );

-- Admins can view all payments
CREATE POLICY "Admins can view all payments" ON public.payments
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Only system/backend can insert payments (this should be done via secure backend API)
CREATE POLICY "System can insert payments" ON public.payments
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- Add comments
COMMENT ON TABLE public.payments IS 'Stores all payment transactions for appointments';
COMMENT ON COLUMN public.payments.razorpay_order_id IS 'Razorpay order ID for tracking';
COMMENT ON COLUMN public.payments.razorpay_payment_id IS 'Razorpay payment ID after successful payment';
COMMENT ON COLUMN public.payments.razorpay_signature IS 'Razorpay signature for verification';
