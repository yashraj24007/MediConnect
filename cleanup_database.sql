-- Delete all data from MediConnect database
-- Run these commands in Supabase SQL Editor
-- WARNING: This will delete ALL user data permanently!

-- 1. Delete all appointments first (due to foreign key constraints)
DELETE FROM public.appointments;

-- 2. Delete all patients
DELETE FROM public.patients;

-- 3. Delete all doctors  
DELETE FROM public.doctors;

-- 4. Delete all profiles
DELETE FROM public.profiles;

-- 5. Reset sequences (optional - to start IDs from 1 again)
-- ALTER SEQUENCE appointments_id_seq RESTART WITH 1;

-- Note: To delete users from Supabase Auth, you need to use the Dashboard
-- Go to Authentication > Users and delete manually
-- OR use the Supabase Management API (requires service role key)

-- Verify all tables are empty
SELECT 'appointments' as table_name, COUNT(*) as count FROM public.appointments
UNION ALL
SELECT 'patients' as table_name, COUNT(*) as count FROM public.patients  
UNION ALL
SELECT 'doctors' as table_name, COUNT(*) as count FROM public.doctors
UNION ALL
SELECT 'profiles' as table_name, COUNT(*) as count FROM public.profiles;