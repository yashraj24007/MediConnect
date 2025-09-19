-- Insert sample doctors data
-- Note: You'll need to manually create user accounts first, then use their profile IDs

-- Sample doctors data (you'll need to replace profile_id with actual IDs from your profiles table)
INSERT INTO public.doctors (profile_id, specialty, license_number, years_experience, bio, consultation_fee) VALUES
  -- Replace these UUIDs with actual profile IDs from your database
  ('00000000-0000-0000-0000-000000000001', 'Cardiologist', 'MD-CARD-2024-001', 15, 'Dr. Kumar is a leading interventional cardiologist with extensive experience in complex cardiac procedures. He has performed over 5000 successful angioplasties and cardiac interventions.', 500.00),
  ('00000000-0000-0000-0000-000000000002', 'Gynecologist', 'MD-GYNO-2024-002', 12, 'Dr. Sharma specializes in women''s health with expertise in minimally invasive gynecological procedures and high-risk pregnancy management.', 400.00),
  ('00000000-0000-0000-0000-000000000003', 'Neurologist', 'MD-NEURO-2024-003', 18, 'Dr. Reddy is a renowned neurologist with expertise in treating complex neurological disorders, stroke management, and epilepsy care.', 600.00),
  ('00000000-0000-0000-0000-000000000004', 'Orthopedic', 'MD-ORTHO-2024-004', 10, 'Dr. Patel specializes in joint replacement surgeries and sports medicine with a focus on minimally invasive techniques.', 450.00),
  ('00000000-0000-0000-0000-000000000005', 'Pediatrician', 'MD-PEDIA-2024-005', 8, 'Dr. Singh is a dedicated pediatrician with special interest in child development, vaccinations, and adolescent medicine.', 300.00);

-- Note: To use this properly, you need to:
-- 1. Create user accounts using Supabase Auth
-- 2. Create corresponding profiles with role 'doctor'
-- 3. Replace the profile_id values above with the actual UUIDs from your profiles table
-- 4. Run this migration

-- Example of how to create a complete doctor entry:
/*
-- 1. First, the user signs up (this creates auth.users entry)
-- 2. Create profile entry
INSERT INTO public.profiles (user_id, email, first_name, last_name, phone, role) VALUES
  ('auth-user-uuid-here', 'doctor@example.com', 'John', 'Doe', '+91 9876543210', 'doctor');

-- 3. Then create doctor entry using the profile ID
INSERT INTO public.doctors (profile_id, specialty, license_number, years_experience, bio, consultation_fee) VALUES
  ('profile-uuid-here', 'Cardiologist', 'MD-CARD-2024-001', 15, 'Professional cardiologist...', 500.00);
*/