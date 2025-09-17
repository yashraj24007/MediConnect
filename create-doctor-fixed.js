import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://zezrhlilrafxwqmslubo.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InplenJobGlscmFmeHdxbXNsdWJvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTczODUzMDksImV4cCI6MjA3Mjk2MTMwOX0.wSn4pG0Q4JU4lZSTsIY5n6-kl8M9NQ79D08iM2zkMJ8'

const supabase = createClient(supabaseUrl, supabaseKey)

async function createDoctorAccount() {
    console.log('👨‍⚕️ Creating doctor account through Auth signup...')

    try {
        // Sign up a doctor account
        const { data: authData, error: signUpError } = await supabase.auth.signUp({
            email: 'dr.smith@mediconnect.com',
            password: 'password123',
            options: {
                data: {
                    first_name: 'John',
                    last_name: 'Smith',
                    role: 'doctor'
                }
            }
        })

        if (signUpError) {
            console.error('❌ Error creating doctor account:', signUpError)
            return
        }

        console.log('✅ Doctor account created successfully!')
        console.log('📧 Email:', authData.user ? .email)
        console.log('🆔 User ID:', authData.user ? .id)

        // Wait a moment for triggers to run
        await new Promise(resolve => setTimeout(resolve, 2000))

        // Check if profile was created
        const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('user_id', authData.user ? .id)
            .single()

        if (profileError) {
            console.error('❌ Error fetching profile:', profileError)
        } else {
            console.log('✅ Profile created:', profile)
        }

        // Check if doctor record was created  
        const { data: doctor, error: doctorError } = await supabase
            .from('doctors')
            .select('*')
            .eq('profile_id', profile ? .id)
            .single()

        if (doctorError) {
            console.error('❌ Doctor record not found:', doctorError)
            console.log('💡 Doctor will need to complete their profile manually')
        } else {
            console.log('✅ Doctor record created:', doctor)
        }

    } catch (error) {
        console.error('💥 Unexpected error:', error)
    }
}

createDoctorAccount()