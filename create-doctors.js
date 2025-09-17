import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://zezrhlilrafxwqmslubo.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InplenJobGlscmFmeHdxbXNsdWJvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTczODUzMDksImV4cCI6MjA3Mjk2MTMwOX0.wSn4pG0Q4JU4lZSTsIY5n6-kl8M9NQ79D08iM2zkMJ8'

const supabase = createClient(supabaseUrl, supabaseKey)

async function createSampleDoctors() {
    console.log('👨‍⚕️ Creating sample doctors for testing...')

    const sampleDoctors = [{
            profile: {
                first_name: 'John',
                last_name: 'Smith',
                email: 'dr.john.smith@mediconnect.com',
                phone: '+1-555-0101',
                role: 'doctor'
            },
            doctor: {
                specialization: 'General Medicine',
                experience_years: 15,
                qualifications: 'MD, MBBS',
                license_number: 'MD12345',
                consultation_fee: 150
            }
        },
        {
            profile: {
                first_name: 'Sarah',
                last_name: 'Johnson',
                email: 'dr.sarah.johnson@mediconnect.com',
                phone: '+1-555-0102',
                role: 'doctor'
            },
            doctor: {
                specialization: 'Cardiology',
                experience_years: 12,
                qualifications: 'MD, FACC',
                license_number: 'MD12346',
                consultation_fee: 200
            }
        },
        {
            profile: {
                first_name: 'Michael',
                last_name: 'Brown',
                email: 'dr.michael.brown@mediconnect.com',
                phone: '+1-555-0103',
                role: 'doctor'
            },
            doctor: {
                specialization: 'Pediatrics',
                experience_years: 10,
                qualifications: 'MD, FAAP',
                license_number: 'MD12347',
                consultation_fee: 180
            }
        }
    ]

    try {
        for (const doctorData of sampleDoctors) {
            // Create profile first
            const { data: profile, error: profileError } = await supabase
                .from('profiles')
                .insert(doctorData.profile)
                .select()
                .single()

            if (profileError) {
                console.error(`❌ Error creating profile for Dr. ${doctorData.profile.first_name} ${doctorData.profile.last_name}:`, profileError)
                continue
            }

            // Create doctor record
            const { data: doctor, error: doctorError } = await supabase
                .from('doctors')
                .insert({
                    profile_id: profile.id,
                    ...doctorData.doctor
                })
                .select()
                .single()

            if (doctorError) {
                console.error(`❌ Error creating doctor record for Dr. ${doctorData.profile.first_name} ${doctorData.profile.last_name}:`, doctorError)
                continue
            }

            console.log(`✅ Created Dr. ${doctorData.profile.first_name} ${doctorData.profile.last_name} - ${doctorData.doctor.specialization}`)
        }

        // Verify creation
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

        console.log(`\n🎉 Successfully created ${doctors?.length || 0} doctors!`)
        console.log('📋 Available doctors for booking:')

        if (doctors) {
            doctors.forEach((doctor, index) => {
                console.log(`  ${index + 1}. Dr. ${doctor.profiles.first_name} ${doctor.profiles.last_name}`)
                console.log(`     Specialization: ${doctor.specialization}`)
                console.log(`     Experience: ${doctor.experience_years} years`)
                console.log(`     Fee: $${doctor.consultation_fee}`)
                console.log('')
            })
        }

    } catch (error) {
        console.error('💥 Error creating doctors:', error)
    }
}

createSampleDoctors()