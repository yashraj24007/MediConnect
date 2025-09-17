-- COMPLETE DATABASE RESET SCRIPT
-- ⚠️ WARNING: This will permanently delete ALL data!
-- Run this in Supabase SQL Editor

-- Disable foreign key checks temporarily
SET session_replication_role = replica;

-- Delete all data from all tables
TRUNCATE TABLE public.appointments CASCADE;
TRUNCATE TABLE public.patients CASCADE;
TRUNCATE TABLE public.doctors CASCADE;
TRUNCATE TABLE public.profiles CASCADE;

-- Re-enable foreign key checks
SET session_replication_role = DEFAULT;

-- Reset all sequences to start from 1
DO $$
DECLARE
    r RECORD;
BEGIN
    FOR r IN (SELECT schemaname, tablename FROM pg_tables WHERE schemaname = 'public') 
    LOOP
        EXECUTE 'SELECT setval(pg_get_serial_sequence(''' || r.schemaname || '.' || r.tablename || ''', ''id''), 1, false)';
    EXCEPTION WHEN OTHERS THEN
        -- Ignore tables without serial sequences
    END LOOP;
END $$;

-- Verify cleanup
SELECT 
    'appointments' as table_name, 
    COUNT(*) as record_count
FROM public.appointments
UNION ALL
SELECT 
    'patients' as table_name, 
    COUNT(*) as record_count
FROM public.patients
UNION ALL
SELECT 
    'doctors' as table_name, 
    COUNT(*) as record_count
FROM public.doctors
UNION ALL
SELECT 
    'profiles' as table_name, 
    COUNT(*) as record_count
FROM public.profiles
ORDER BY table_name;