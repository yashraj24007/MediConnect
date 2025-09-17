import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://zezrhlilrafxwqmslubo.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InplenJobGlscmFmeHdxbXNsdWJvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTczODUzMDksImV4cCI6MjA3Mjk2MTMwOX0.wSn4pG0Q4JU4lZSTsIY5n6-kl8M9NQ79D08iM2zkMJ8'

const supabase = createClient(supabaseUrl, supabaseKey)

async function checkDoctors() {
    console.log('🔍 Checking doctors in database...')

    const { data: doctors, error } = await supabase
        .from('doctors')
        .select(`
      *,
      profiles (
        first_name,
        last_name,
        email
      )
    `)

    if (error) {
        console.error('❌ Error fetching doctors:', error)
        return
    }

    console.log(`📊 Found ${doctors?.length || 0} doctors in database`)

    if (doctors && doctors.length > 0) {
        console.log('👨‍⚕️ Doctors list:')
        doctors.forEach((doctor, index) => {
            console.log(`  ${index + 1}. Dr. ${doctor.profiles?.first_name} ${doctor.profiles?.last_name} - ${doctor.specialization}`)
        })
    } else {
        console.log('⚠️  No doctors found in database! This will prevent booking appointments.')
        console.log('💡 You need to create doctor accounts first.')
    }
}

checkDoctors()