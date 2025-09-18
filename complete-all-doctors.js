import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://zezrhlilrafxwqmslubo.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InplenJobGlscmFmeHdxbXNsdWJvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTczODUzMDksImV4cCI6MjA3Mjk2MTMwOX0.wSn4pG0Q4JU4lZSTsIY5n6-kl8M9NQ79D08iM2zkMJ8'

const supabase = createClient(supabaseUrl, supabaseKey)

// Complete doctor data
const doctorsData = [{
        email: "dr.rajesh.kumar@mediconnect.com",
        firstName: "Rajesh",
        lastName: "Kumar",
        phone: "+91 40 2355 1066",
        specialization: "Cardiologist",
        experience: 15,
        qualifications: "MD Cardiology, DM Interventional Cardiology",
        consultationFee: 500
    },
    {
        email: "dr.priya.sharma@mediconnect.com",
        firstName: "Priya",
        lastName: "Sharma",
        phone: "+91 40 6165 6565",
        specialization: "Gynecologist",
        experience: 12,
        qualifications: "MD Obstetrics & Gynecology, Fellowship in Laparoscopy",
        consultationFee: 600
    },
    {
        email: "dr.anil.reddy@mediconnect.com",
        firstName: "Anil",
        lastName: "Reddy",
        phone: "+91 40 6734 6734",
        specialization: "Orthopedic Surgeon",
        experience: 18,
        qualifications: "MS Orthopedics, Fellowship in Joint Replacement",
        consultationFee: 700
    },
    {
        email: "dr.meena.rao@mediconnect.com",
        firstName: "Meena",
        lastName: "Rao",
        phone: "+91 40 2771 4466",
        specialization: "Pediatrician",
        experience: 10,
        qualifications: "MD Pediatrics, Fellowship in Neonatology",
        consultationFee: 450
    },
    {
        email: "dr.suresh.gupta@mediconnect.com",
        firstName: "Suresh",
        lastName: "Gupta",
        phone: "+91 40 4444 6666",
        specialization: "Neurologist",
        experience: 14,
        qualifications: "DM Neurology, MD Internal Medicine",
        consultationFee: 650
    },
    {
        email: "dr.kavitha.nair@mediconnect.com",
        firstName: "Kavitha",
        lastName: "Nair",
        phone: "+91 40 2355 1066",
        specialization: "Dermatologist",
        experience: 8,
        qualifications: "MD Dermatology, Fellowship in Cosmetic Dermatology",
        consultationFee: 550
    }
]

async function completeDoctorProfiles() {
    console.log('👨‍⚕️ Completing doctor profiles...')

    let completedCount = 0

    for (const doctor of doctorsData) {
        try {
            console.log(`\n🔐 Logging in as ${doctor.firstName} ${doctor.lastName}...`)

            // Sign in as the doctor
            const { data: authData, error: signInError } = await supabase.auth.signInWithPassword({
                email: doctor.email,
                password: 'mediconnect123'
            })

            if (signInError) {
                console.error(`❌ Login failed for ${doctor.firstName}:`, signInError.message)
                continue
            }

            console.log(`✅ Logged in as ${doctor.firstName}`)

            // Wait a moment for auth to settle
            await new Promise(resolve => setTimeout(resolve, 1000))

            // Check if profile exists
            const { data: existingProfile } = await supabase
                .from('profiles')
                .select('*')
                .eq('user_id', authData.user.id)
                .single()

            let profileId = null

            if (existingProfile) {
                console.log(`✅ Profile exists for ${doctor.firstName}`)
                profileId = existingProfile.id
            } else {
                // Create profile
                const { data: newProfile, error: profileError } = await supabase
                    .from('profiles')
                    .insert({
                        user_id: authData.user.id,
                        email: doctor.email,
                        first_name: doctor.firstName,
                        last_name: doctor.lastName,
                        role: 'doctor',
                        phone: doctor.phone
                    })
                    .select()
                    .single()

                if (profileError) {
                    console.error(`❌ Profile creation failed for ${doctor.firstName}:`, profileError.message)
                    await supabase.auth.signOut()
                    continue
                }

                console.log(`✅ Profile created for ${doctor.firstName}`)
                profileId = newProfile.id
            }

            // Check if doctor record exists
            const { data: existingDoctor } = await supabase
                .from('doctors')
                .select('*')
                .eq('profile_id', profileId)
                .single()

            if (existingDoctor) {
                console.log(`✅ Doctor record exists for ${doctor.firstName}`)
            } else {
                // Create doctor record
                const { data: newDoctor, error: doctorError } = await supabase
                    .from('doctors')
                    .insert({
                        profile_id: profileId,
                        specialty: doctor.specialization,
                        years_experience: doctor.experience,
                        bio: `Experienced ${doctor.specialization} with ${doctor.experience} years of practice. ${doctor.qualifications}`,
                        license_number: `LIC${Date.now().toString().slice(-6)}${Math.floor(Math.random() * 100)}`,
                        consultation_fee: doctor.consultationFee
                    })
                    .select()
                    .single()

                if (doctorError) {
                    console.error(`❌ Doctor record creation failed for ${doctor.firstName}:`, doctorError.message)
                    await supabase.auth.signOut()
                    continue
                }

                console.log(`✅ Doctor record created for ${doctor.firstName}`)
            }

            // Sign out
            await supabase.auth.signOut()
            console.log(`🚪 Signed out ${doctor.firstName}`)

            completedCount++

            // Small delay between doctors
            await new Promise(resolve => setTimeout(resolve, 500))

        } catch (error) {
            console.error(`💥 Error processing ${doctor.firstName}:`, error.message)
            await supabase.auth.signOut()
        }
    }

    console.log(`\n🎉 Completed profiles for ${completedCount}/${doctorsData.length} doctors`)

    // Final verification
    console.log('\n🔍 Verifying doctors in database...')
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
        console.error('❌ Error verifying doctors:', error)
    } else {
        console.log(`\n📊 Total doctors in database: ${doctors?.length || 0}`)

        if (doctors && doctors.length > 0) {
            console.log('\n👨‍⚕️ Available doctors for appointment booking:')
            doctors.forEach((doc, index) => {
                console.log(`  ${index + 1}. Dr. ${doc.profiles.first_name} ${doc.profiles.last_name}`)
                console.log(`     📋 Specialty: ${doc.specialty}`)
                console.log(`     ⏳ Experience: ${doc.years_experience} years`)
                console.log(`     💰 Consultation Fee: $${doc.consultation_fee}`)
                console.log(`     📜 License: ${doc.license_number}`)
                console.log('')
            })

            console.log('🎯 SUCCESS! Booking system is now ready!')
            console.log('✅ Patients can now book appointments with these doctors')

        } else {
            console.log('❌ No doctors found in database')
        }
    }
}

completeDoctorProfiles()