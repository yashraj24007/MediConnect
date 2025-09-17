import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://zezrhlilrafxwqmslubo.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InplenJobGlscmFmeHdxbXNsdWJvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTczODUzMDksImV4cCI6MjA3Mjk2MTMwOX0.wSn4pG0Q4JU4lZSTsIY5n6-kl8M9NQ79D08iM2zkMJ8'

const supabase = createClient(supabaseUrl, supabaseKey)

// Note: This script requires the service role key to work properly
// For now, we'll show what accounts exist and their verification status

async function checkEmailVerification() {
    console.log('📧 Checking email verification status...')

    try {
        // Try to sign in with one of our doctor accounts to test
        const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
            email: 'dr.rajesh.kumar@mediconnect.com',
            password: 'mediconnect123'
        })

        if (signInError) {
            if (signInError.message.includes('Email not confirmed')) {
                console.log('❌ Email verification is REQUIRED')
                console.log('   Doctors cannot log in until emails are confirmed')
                console.log('')
                console.log('🔧 To disable email verification:')
                console.log('   1. Go to Supabase Dashboard → Authentication → Settings')
                console.log('   2. Find "Email Confirmation" section')
                console.log('   3. Disable "Enable email confirmations"')
                console.log('   4. Save changes')
                console.log('')
                console.log('   OR confirm emails manually in Auth → Users')
            } else {
                console.log('❌ Sign in error:', signInError.message)
            }
        } else {
            console.log('✅ Email verification is DISABLED or email is confirmed')
            console.log('   Doctors can log in successfully')

            // Sign out after test
            await supabase.auth.signOut()
        }

    } catch (error) {
        console.error('💥 Error testing sign in:', error.message)
    }
}

async function testDoctorLogin() {
    console.log('\n🧪 Testing doctor login after verification changes...')

    const testEmail = 'dr.rajesh.kumar@mediconnect.com'

    try {
        const { data, error } = await supabase.auth.signInWithPassword({
            email: testEmail,
            password: 'mediconnect123'
        })

        if (error) {
            console.log(`❌ ${testEmail} cannot log in: ${error.message}`)
        } else {
            console.log(`✅ ${testEmail} can log in successfully!`)
            console.log('   User ID:', data.user ? .id)
            console.log('   Email confirmed:', data.user ? .email_confirmed_at ? 'Yes' : 'No')

            // Check if profile exists
            const { data: profile } = await supabase
                .from('profiles')
                .select('*')
                .eq('user_id', data.user ? .id)
                .single()

            if (profile) {
                console.log('   Profile exists:', profile.role)
            } else {
                console.log('   No profile found - needs to be created')
            }

            await supabase.auth.signOut()
        }
    } catch (error) {
        console.error('💥 Test error:', error.message)
    }
}

async function main() {
    await checkEmailVerification()

    console.log('\n' + '='.repeat(50))
    console.log('⚡ QUICK FIX - Disable Email Verification:')
    console.log('='.repeat(50))
    console.log('1. Open: https://supabase.com/dashboard/project/zezrhlilrafxwqmslubo/auth/settings')
    console.log('2. Scroll to "Email Confirmation"')
    console.log('3. Turn OFF "Enable email confirmations"')
    console.log('4. Click "Save"')
    console.log('5. Run this script again to test')
    console.log('='.repeat(50))

    // Test after changes
    await testDoctorLogin()
}

main()