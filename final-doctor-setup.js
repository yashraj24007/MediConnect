import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://zezrhlilrafxwqmslubo.supabase.co'
    // Using service role key to bypass RLS
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InplenJobGlscmFmeHdxbXNsdWJvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NzM4NTMwOSwiZXhwIjoyMDcyOTYxMzA5fQ.1Mj_z5o9b_eWKhUfIwJfcUHbM_bCk4qsYWFUBLUxcKE'

const supabase = createClient(supabaseUrl, supabaseServiceKey)

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

async function createDoctorsWithServiceRole() {
    console.log('👨‍⚕️ Creating doctor records with service role (bypassing RLS)...')

    let createdCount = 0

    for (const doctor of doctorsData) {
        try {
            console.log(`\n🔍 Processing ${doctor.firstName} ${doctor.lastName}...`)

            // Find the user by email 
            const { data: authUser, error: getUserError } = await supabase.auth.admin.listUsers()

            if (getUserError) {
                console.error(`❌ Error listing users:`, getUserError.message)
                continue
            }

            const user = authUser.users.find(u => u.email === doctor.email)
            if (!user) {
                console.error(`❌ User not found for ${doctor.email}`)
                continue
            }

            console.log(`✅ Found user ${doctor.firstName} with ID: ${user.id}`)

            // Check if profile exists, create if not
            let { data: profile, error: profileError } = await supabase
                .from('profiles')
                .select('*')
                .eq('user_id', user.id)
                .single()

            if (profileError && profileError.code !== 'PGRST116') {
                console.error(`❌ Error checking profile for ${doctor.firstName}:`, profileError.message)
                continue
            }

            if (!profile) {
                // Create profile
                const { data: newProfile, error: createProfileError } = await supabase
                    .from('profiles')
                    .insert({
                        user_id: user.id,
                        email: doctor.email,
                        first_name: doctor.firstName,
                        last_name: doctor.lastName,
                        role: 'doctor',
                        phone: doctor.phone
                    })
                    .select()
                    .single()

                if (createProfileError) {
                    console.error(`❌ Error creating profile for ${doctor.firstName}:`, createProfileError.message)
                    continue
                }

                profile = newProfile
                console.log(`✅ Created profile for ${doctor.firstName}`)
            } else {
                console.log(`✅ Profile exists for ${doctor.firstName}`)
            }

            // Check if doctor record exists
            const { data: existingDoctor, error: checkDoctorError } = await supabase
                .from('doctors')
                .select('*')
                .eq('profile_id', profile.id)
                .single()

            if (checkDoctorError && checkDoctorError.code !== 'PGRST116') {
                console.error(`❌ Error checking doctor record for ${doctor.firstName}:`, checkDoctorError.message)
                continue
            }

            if (existingDoctor) {
                console.log(`✅ Doctor record already exists for ${doctor.firstName}`)
                createdCount++
                continue
            }

            // Create doctor record
            const { data: newDoctor, error: doctorError } = await supabase
                .from('doctors')
                .insert({
                    profile_id: profile.id,
                    specialty: doctor.specialization,
                    years_experience: doctor.experience,
                    bio: `Experienced ${doctor.specialization} with ${doctor.experience} years of practice. Qualifications: ${doctor.qualifications}`,
                    license_number: `LIC${Date.now().toString().slice(-6)}${Math.floor(Math.random() * 100)}`,
                    consultation_fee: doctor.consultationFee
                })
                .select()
                .single()

            if (doctorError) {
                console.error(`❌ Error creating doctor record for ${doctor.firstName}:`, doctorError.message)
                continue
            }

            console.log(`✅ Created doctor record for ${doctor.firstName}`)
            createdCount++

            // Small delay between operations
            await new Promise(resolve => setTimeout(resolve, 200))

        } catch (error) {
            console.error(`💥 Error processing ${doctor.firstName}:`, error.message)
        }
    }

    console.log(`\n🎉 Created records for ${createdCount}/${doctorsData.length} doctors`)

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
                console.log(`     📧 Email: ${doc.profiles.email}`)
                console.log(`     📋 Specialty: ${doc.specialty}`)
                console.log(`     ⏳ Experience: ${doc.years_experience} years`)
                console.log(`     💰 Consultation Fee: $${doc.consultation_fee}`)
                console.log(`     📜 License: ${doc.license_number}`)
                console.log('')
            })

            console.log('🎯 SUCCESS! Booking system is now ready!')
            console.log('✅ Patients can now book appointments with these doctors')
            console.log('\n📝 Next steps:')
            console.log('   1. Start your development server: npm run dev')
            console.log('   2. Go to the booking page')
            console.log('   3. Select a doctor and book an appointment!')

        } else {
            console.log('❌ No doctors found in database')
        }
    }
}

createDoctorsWithServiceRole()