import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://zezrhlilrafxwqmslubo.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InplenJobGlscmFmeHdxbXNsdWJvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTczODUzMDksImV4cCI6MjA3Mjk2MTMwOX0.wSn4pG0Q4JU4lZSTsIY5n6-kl8M9NQ79D08iM2zkMJ8'

const supabase = createClient(supabaseUrl, supabaseKey)

async function createDoctorProfile() {
    console.log('👨‍⚕️ Creating doctor profile manually...')

    const userId = '803ad716-9682-405d-a4d4-26a9cbca9cac' // From previous signup

    try {
        // First, try to sign in as the doctor to get proper authentication context
        const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
            email: 'dr.smith@mediconnect.com',
            password: 'password123'
        })

        if (signInError) {
            console.error('❌ Error signing in as doctor:', signInError)
            return
        }

        console.log('✅ Signed in as doctor')

        // Check if profile exists
        const { data: existingProfile } = await supabase
            .from('profiles')
            .select('*')
            .eq('user_id', userId)
            .single()

        if (existingProfile) {
            console.log('✅ Profile already exists:', existingProfile)
        } else {
            // Create profile
            const { data: profile, error: profileError } = await supabase
                .from('profiles')
                .insert({
                    user_id: userId,
                    email: 'dr.smith@mediconnect.com',
                    first_name: 'John',
                    last_name: 'Smith',
                    role: 'doctor',
                    phone: '+1-555-0101'
                })
                .select()
                .single()

            if (profileError) {
                console.error('❌ Error creating profile:', profileError)
                return
            }

            console.log('✅ Profile created:', profile)
        }

        // Get the profile to use its ID
        const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('user_id', userId)
            .single()

        if (!profile) {
            console.error('❌ Could not get profile')
            return
        }

        // Check if doctor record exists
        const { data: existingDoctor } = await supabase
            .from('doctors')
            .select('*')
            .eq('profile_id', profile.id)
            .single()

        if (existingDoctor) {
            console.log('✅ Doctor record already exists:', existingDoctor)
        } else {
            // Create doctor record
            const { data: doctor, error: doctorError } = await supabase
                .from('doctors')
                .insert({
                    profile_id: profile.id,
                    specialization: 'General Medicine',
                    experience_years: 15,
                    qualifications: 'MD, MBBS',
                    license_number: 'MD12345',
                    consultation_fee: 150
                })
                .select()
                .single()

            if (doctorError) {
                console.error('❌ Error creating doctor record:', doctorError)
                return
            }

            console.log('✅ Doctor record created:', doctor)
        }

        // Sign out
        await supabase.auth.signOut()
        console.log('✅ Signed out')

    } catch (error) {
        console.error('💥 Unexpected error:', error)
    }
}

createDoctorProfile()