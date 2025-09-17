import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://zezrhlilrafxwqmslubo.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InplenJobGlscmFmeHdxbXNsdWJvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTczODUzMDksImV4cCI6MjA3Mjk2MTMwOX0.wSn4pG0Q4JU4lZSTsIY5n6-kl8M9NQ79D08iM2zkMJ8'

const supabase = createClient(supabaseUrl, supabaseKey)

// Simplified doctor data for restoration
const originalDoctors = [{
        name: "Dr. Rajesh Kumar",
        specialty: "Cardiologist",
        experience: 15,
        qualification: "MD Cardiology, DM Interventional Cardiology",
        phone: "+91 40 2355 1066",
        email: "dr.rajesh@apollohyd.com",
        consultationFee: 500
    },
    {
        name: "Dr. Priya Sharma",
        specialty: "Gynecologist",
        experience: 12,
        qualification: "MD Obstetrics & Gynecology, Fellowship in Laparoscopy",
        phone: "+91 40 6165 6565",
        email: "dr.priya@carehospitals.com",
        consultationFee: 600
    },
    {
        name: "Dr. Anil Reddy",
        specialty: "Orthopedic Surgeon",
        experience: 18,
        qualification: "MS Orthopedics, Fellowship in Joint Replacement",
        phone: "+91 40 6734 6734",
        email: "dr.anil@continentalhospitals.com",
        consultationFee: 700
    }
]

async function restoreDoctorsSimple() {
    console.log('🔄 Restoring doctors using signup method...')
    console.log(`📋 Creating ${originalDoctors.length} doctors`)

    for (const doctor of originalDoctors) {
        try {
            console.log(`\n👨‍⚕️ Creating ${doctor.name}...`)

            // Extract first and last name
            const nameParts = doctor.name.replace('Dr. ', '').split(' ')
            const firstName = nameParts[0]
            const lastName = nameParts.slice(1).join(' ')

            // Sign up the doctor
            const { data: authData, error: signUpError } = await supabase.auth.signUp({
                email: doctor.email,
                password: 'mediconnect123',
                options: {
                    data: {
                        first_name: firstName,
                        last_name: lastName,
                        role: 'doctor'
                    }
                }
            })

            if (signUpError) {
                if (signUpError.message.includes('User already registered')) {
                    console.log(`⚠️  ${doctor.name} already exists, skipping...`)
                    continue
                }
                console.error(`❌ Error creating ${doctor.name}:`, signUpError.message)
                continue
            }

            console.log(`✅ Created auth account for ${doctor.name}`)

            // Wait for database triggers to complete
            await new Promise(resolve => setTimeout(resolve, 1000))

        } catch (error) {
            console.error(`💥 Error creating ${doctor.name}:`, error.message)
        }
    }

    console.log('\n⏳ Waiting for all profiles to be created...')
    await new Promise(resolve => setTimeout(resolve, 3000))

    // Check the results
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

    console.log(`\n📊 Doctors in database: ${doctors?.length || 0}`)

    if (doctors && doctors.length > 0) {
        console.log('👨‍⚕️ Available doctors:')
        doctors.forEach((doc, index) => {
            console.log(`  ${index + 1}. Dr. ${doc.profiles.first_name} ${doc.profiles.last_name} - ${doc.specialization || 'Pending specialization'}`)
        })
    } else {
        console.log('⚠️  No doctors found. Profiles may still be creating or need manual completion.')
        console.log('💡 Next steps:')
        console.log('   1. Wait a few minutes for database triggers')
        console.log('   2. Check Supabase dashboard for user accounts')
        console.log('   3. Complete doctor profiles manually if needed')
    }
}

restoreDoctorsSimple()