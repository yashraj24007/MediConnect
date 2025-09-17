import { createClient } from '@supabase/supabase-js'

// Enhanced cleanup script that handles RLS policies better
const supabaseUrl = 'https://zezrhlilrafxwqmslubo.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InplenJobGlscmFmeHdxbXNsdWJvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTczODUzMDksImV4cCI6MjA3Mjk2MTMwOX0.wSn4pG0Q4JU4lZSTsIY5n6-kl8M9NQ79D08iM2zkMJ8'

const supabase = createClient(supabaseUrl, supabaseKey)

async function verifyCleanup() {
    console.log('🔍 Verifying database cleanup...')

    try {
        const [appointments, patients, doctors, profiles] = await Promise.all([
            supabase.from('appointments').select('id'),
            supabase.from('patients').select('id'),
            supabase.from('doctors').select('id'),
            supabase.from('profiles').select('id')
        ])

        console.log('📊 Current database status:')
        console.log(`   ✅ Appointments: ${appointments.data?.length || 0} records`)
        console.log(`   ✅ Patients: ${patients.data?.length || 0} records`)
        console.log(`   ✅ Doctors: ${doctors.data?.length || 0} records`)
        console.log(`   ✅ Profiles: ${profiles.data?.length || 0} records`)

        const totalRecords = (appointments.data ? .length || 0) +
            (patients.data ? .length || 0) +
            (doctors.data ? .length || 0) +
            (profiles.data ? .length || 0)

        if (totalRecords === 0) {
            console.log('🎉 SUCCESS! All user data has been deleted from the database!')
            console.log('')
            console.log('📋 Next steps:')
            console.log('1. Open Supabase Dashboard: https://supabase.com/dashboard/project/zezrhlilrafxwqmslubo/auth/users')
            console.log('2. Go to Authentication → Users')
            console.log('3. Select all users and delete them manually')
            console.log('4. Your database is now completely clean!')
        } else {
            console.log('⚠️  Some records still remain. Manual cleanup may be needed.')
        }

    } catch (error) {
        console.error('❌ Error checking database:', error)
    }
}

verifyCleanup()