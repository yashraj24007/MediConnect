-- Insert doctor data manually
-- First, let's create fake user IDs for our doctors since we can't access auth.users table directly

-- Insert profiles for our doctors
INSERT INTO public.profiles (id, user_id, email, first_name, last_name, role, phone, created_at) VALUES 
  (gen_random_uuid(), gen_random_uuid(), 'dr.rajesh.kumar@mediconnect.com', 'Rajesh', 'Kumar', 'doctor', '+91 40 2355 1066', NOW()),
  (gen_random_uuid(), gen_random_uuid(), 'dr.priya.sharma@mediconnect.com', 'Priya', 'Sharma', 'doctor', '+91 40 6165 6565', NOW()),
  (gen_random_uuid(), gen_random_uuid(), 'dr.anil.reddy@mediconnect.com', 'Anil', 'Reddy', 'doctor', '+91 40 6734 6734', NOW()),
  (gen_random_uuid(), gen_random_uuid(), 'dr.meena.rao@mediconnect.com', 'Meena', 'Rao', 'doctor', '+91 40 2771 4466', NOW()),
  (gen_random_uuid(), gen_random_uuid(), 'dr.suresh.gupta@mediconnect.com', 'Suresh', 'Gupta', 'doctor', '+91 40 4444 6666', NOW()),
  (gen_random_uuid(), gen_random_uuid(), 'dr.kavitha.nair@mediconnect.com', 'Kavitha', 'Nair', 'doctor', '+91 40 2355 1066', NOW())
ON CONFLICT (email) DO NOTHING;

-- Insert doctor records for each profile
INSERT INTO public.doctors (id, profile_id, specialty, years_experience, bio, license_number, consultation_fee, created_at)
SELECT 
  gen_random_uuid(),
  p.id,
  CASE 
    WHEN p.email = 'dr.rajesh.kumar@mediconnect.com' THEN 'Cardiologist'
    WHEN p.email = 'dr.priya.sharma@mediconnect.com' THEN 'Gynecologist'
    WHEN p.email = 'dr.anil.reddy@mediconnect.com' THEN 'Orthopedic Surgeon'
    WHEN p.email = 'dr.meena.rao@mediconnect.com' THEN 'Pediatrician'
    WHEN p.email = 'dr.suresh.gupta@mediconnect.com' THEN 'Neurologist'
    WHEN p.email = 'dr.kavitha.nair@mediconnect.com' THEN 'Dermatologist'
  END as specialty,
  CASE 
    WHEN p.email = 'dr.rajesh.kumar@mediconnect.com' THEN 15
    WHEN p.email = 'dr.priya.sharma@mediconnect.com' THEN 12
    WHEN p.email = 'dr.anil.reddy@mediconnect.com' THEN 18
    WHEN p.email = 'dr.meena.rao@mediconnect.com' THEN 10
    WHEN p.email = 'dr.suresh.gupta@mediconnect.com' THEN 14
    WHEN p.email = 'dr.kavitha.nair@mediconnect.com' THEN 8
  END as years_experience,
  CASE 
    WHEN p.email = 'dr.rajesh.kumar@mediconnect.com' THEN 'Leading interventional cardiologist with extensive experience in complex cardiac procedures.'
    WHEN p.email = 'dr.priya.sharma@mediconnect.com' THEN 'Specialist in obstetrics & gynecology with fellowship in laparoscopy.'
    WHEN p.email = 'dr.anil.reddy@mediconnect.com' THEN 'Orthopedic surgeon with fellowship in joint replacement and sports medicine.'
    WHEN p.email = 'dr.meena.rao@mediconnect.com' THEN 'Pediatrician with fellowship in neonatology and child healthcare.'
    WHEN p.email = 'dr.suresh.gupta@mediconnect.com' THEN 'Neurologist specializing in brain disorders and stroke care.'
    WHEN p.email = 'dr.kavitha.nair@mediconnect.com' THEN 'Dermatologist with fellowship in cosmetic dermatology.'
  END as bio,
  CASE 
    WHEN p.email = 'dr.rajesh.kumar@mediconnect.com' THEN 'MED001001'
    WHEN p.email = 'dr.priya.sharma@mediconnect.com' THEN 'MED001002'
    WHEN p.email = 'dr.anil.reddy@mediconnect.com' THEN 'MED001003'
    WHEN p.email = 'dr.meena.rao@mediconnect.com' THEN 'MED001004'
    WHEN p.email = 'dr.suresh.gupta@mediconnect.com' THEN 'MED001005'
    WHEN p.email = 'dr.kavitha.nair@mediconnect.com' THEN 'MED001006'
  END as license_number,
  CASE 
    WHEN p.email = 'dr.rajesh.kumar@mediconnect.com' THEN 500
    WHEN p.email = 'dr.priya.sharma@mediconnect.com' THEN 600
    WHEN p.email = 'dr.anil.reddy@mediconnect.com' THEN 700
    WHEN p.email = 'dr.meena.rao@mediconnect.com' THEN 450
    WHEN p.email = 'dr.suresh.gupta@mediconnect.com' THEN 650
    WHEN p.email = 'dr.kavitha.nair@mediconnect.com' THEN 550
  END as consultation_fee,
  NOW()
FROM public.profiles p
WHERE p.email IN (
  'dr.rajesh.kumar@mediconnect.com',
  'dr.priya.sharma@mediconnect.com', 
  'dr.anil.reddy@mediconnect.com',
  'dr.meena.rao@mediconnect.com',
  'dr.suresh.gupta@mediconnect.com',
  'dr.kavitha.nair@mediconnect.com'
)
AND NOT EXISTS (
  SELECT 1 FROM public.doctors d WHERE d.profile_id = p.id
);

-- Verify the data
SELECT 
  d.id as doctor_id,
  p.first_name,
  p.last_name,
  p.email,
  d.specialty,
  d.years_experience,
  d.consultation_fee,
  d.license_number
FROM public.doctors d
JOIN public.profiles p ON d.profile_id = p.id
ORDER BY p.first_name;