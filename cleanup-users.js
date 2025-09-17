import { createClient } from '@supabase/supabase-js'

// Database cleanup script
// This will delete ALL users and data from your MediConnect database

const supabaseUrl = 'https://zezrhlilrafxwqmslubo.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InplenJobGlscmFmeHdxbXNsdWJvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTczODUzMDksImV4cCI6MjA3Mjk2MTMwOX0.wSn4pG0Q4JU4lZSTsIY5n6-kl8M9NQ79D08iM2zkMJ8'

const supabase = createClient(supabaseUrl, supabaseKey)

async function cleanupDatabase() {
    console.log('🧹 Starting database cleanup...')

    try {
        // 1. Delete all appointments first (due to foreign key constraints)
        console.log('📅 Deleting appointments...')
        const { error: appointmentsError } = await supabase
            .from('appointments')
            .delete()
            .neq('id', 0) // Delete all records

        if (appointmentsError) {
            console.error('❌ Error deleting appointments:', appointmentsError)
        } else {
            console.log('✅ All appointments deleted')
        }

        // 2. Delete all patients
        console.log('🏥 Deleting patients...')
        const { error: patientsError } = await supabase
            .from('patients')
            .delete()
            .neq('id', 0) // Delete all records

        if (patientsError) {
            console.error('❌ Error deleting patients:', patientsError)
        } else {
            console.log('✅ All patients deleted')
        }

        // 3. Delete all doctors
        console.log('👨‍⚕️ Deleting doctors...')
        const { error: doctorsError } = await supabase
            .from('doctors')
            .delete()
            .neq('id', 0) // Delete all records

        if (doctorsError) {
            console.error('❌ Error deleting doctors:', doctorsError)
        } else {
            console.log('✅ All doctors deleted')
        }

        // 4. Delete all profiles
        console.log('👤 Deleting profiles...')
        const { error: profilesError } = await supabase
            .from('profiles')
            .delete()
            .neq('id', 0) // Delete all records

        if (profilesError) {
            console.error('❌ Error deleting profiles:', profilesError)
        } else {
            console.log('✅ All profiles deleted')
        }

        // 5. Check what's left
        console.log('🔍 Checking remaining data...')

        const [appointments, patients, doctors, profiles] = await Promise.all([
            supabase.from('appointments').select('id'),
            supabase.from('patients').select('id'),
            supabase.from('doctors').select('id'),
            supabase.from('profiles').select('id')
        ])

        console.log('📊 Remaining records:')
        console.log(`   Appointments: ${appointments.data?.length || 0}`)
        console.log(`   Patients: ${patients.data?.length || 0}`)
        console.log(`   Doctors: ${doctors.data?.length || 0}`)
        console.log(`   Profiles: ${profiles.data?.length || 0}`)

        console.log('✨ Database cleanup completed!')
        console.log('⚠️  Note: Authentication users need to be deleted manually from Supabase Dashboard')
        console.log('   Go to: https://supabase.com/dashboard/project/zezrhlilrafxwqmslubo/auth/users')

    } catch (error) {
        console.error('💥 Cleanup failed:', error)
    }
}

// Run the cleanup
cleanupDatabase()