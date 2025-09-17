import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://zezrhlilrafxwqmslubo.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InplenJobGlscmFmeHdxbXNsdWJvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTczODUzMDksImV4cCI6MjA3Mjk2MTMwOX0.wSn4pG0Q4JU4lZSTsIY5n6-kl8M9NQ79D08iM2zkMJ8'

const supabase = createClient(supabaseUrl, supabaseKey)

// Doctors with valid email formats
const doctorsToRestore = [{
        name: "Dr. Rajesh Kumar",
        specialty: "Cardiologist",
        experience: 15,
        qualification: "MD Cardiology, DM Interventional Cardiology",
        phone: "+91 40 2355 1066",
        email: "dr.rajesh.kumar@mediconnect.com",
        consultationFee: 500
    },
    {
        name: "Dr. Priya Sharma",
        specialty: "Gynecologist",
        experience: 12,
        qualification: "MD Obstetrics & Gynecology, Fellowship in Laparoscopy",
        phone: "+91 40 6165 6565",
        email: "dr.priya.sharma@mediconnect.com",
        consultationFee: 600
    },
    {
        name: "Dr. Anil Reddy",
        specialty: "Orthopedic Surgeon",
        experience: 18,
        qualification: "MS Orthopedics, Fellowship in Joint Replacement",
        phone: "+91 40 6734 6734",
        email: "dr.anil.reddy@mediconnect.com",
        consultationFee: 700
    },
    {
        name: "Dr. Meena Rao",
        specialty: "Pediatrician",
        experience: 10,
        qualification: "MD Pediatrics, Fellowship in Neonatology",
        phone: "+91 40 2771 4466",
        email: "dr.meena.rao@mediconnect.com",
        consultationFee: 450
    },
    {
        name: "Dr. Suresh Gupta",
        specialty: "Neurologist",
        experience: 14,
        qualification: "DM Neurology, MD Internal Medicine",
        phone: "+91 40 4444 6666",
        email: "dr.suresh.gupta@mediconnect.com",
        consultationFee: 650
    },
    {
        name: "Dr. Kavitha Nair",
        specialty: "Dermatologist",
        experience: 8,
        qualification: "MD Dermatology, Fellowship in Cosmetic Dermatology",
        phone: "+91 40 2355 1066",
        email: "dr.kavitha.nair@mediconnect.com",
        consultationFee: 550
    }
]

async function restoreAllDoctors() {
    console.log('🔄 Restoring all original doctors...')
    console.log(`📋 Creating ${doctorsToRestore.length} doctors with valid emails`)

    let successCount = 0

    for (const doctor of doctorsToRestore) {
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
                        role: 'doctor',
                        phone: doctor.phone
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
            console.log(`   📧 Email: ${doctor.email}`)
            console.log(`   🔑 Password: mediconnect123`)

            successCount++

            // Wait between creations to avoid rate limits
            await new Promise(resolve => setTimeout(resolve, 500))

        } catch (error) {
            console.error(`💥 Error creating ${doctor.name}:`, error.message)
        }
    }

    console.log(`\n✅ Successfully created ${successCount} doctor accounts`)
    console.log('\n⏳ Waiting for database triggers to create profiles and doctor records...')
    await new Promise(resolve => setTimeout(resolve, 5000))

    // Check final results
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

    console.log(`\n🎉 RESTORATION COMPLETE!`)
    console.log(`📊 Doctors now in database: ${doctors?.length || 0}`)

    if (doctors && doctors.length > 0) {
        console.log('\n👨‍⚕️ Available doctors for booking:')
        doctors.forEach((doc, index) => {
            console.log(`  ${index + 1}. Dr. ${doc.profiles.first_name} ${doc.profiles.last_name}`)
            console.log(`     Specialization: ${doc.specialization || 'To be completed'}`)
            console.log(`     Experience: ${doc.experience_years || 'To be completed'} years`)
            console.log(`     Fee: $${doc.consultation_fee || 'To be set'}`)
            console.log('')
        })

        console.log('🎯 Next steps:')
        console.log('   1. Doctors can now log in and complete their profiles')
        console.log('   2. Patients can book appointments!')
        console.log('   3. Test the booking system')

    } else {
        console.log('\n⚠️  No doctors found in database yet.')
        console.log('💡 This might be because:')
        console.log('   1. Database triggers are still processing')
        console.log('   2. RLS policies need adjustment')
        console.log('   3. Manual profile completion is required')

        console.log('\n📋 Created accounts (login manually to complete):')
        doctorsToRestore.slice(0, successCount).forEach((doc, index) => {
            console.log(`  ${index + 1}. ${doc.email} / mediconnect123`)
        })
    }
}

restoreAllDoctors()