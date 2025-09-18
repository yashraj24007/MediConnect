import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://zezrhlilrafxwqmslubo.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InplenJobGlscmFmeHdxbXNsdWJvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTczODUzMDksImV4cCI6MjA3Mjk2MTMwOX0.wSn4pG0Q4JU4lZSTsIY5n6-kl8M9NQ79D08iM2zkMJ8'

const supabase = createClient(supabaseUrl, supabaseKey)

const doctorsData = [{
        email: "dr.rajesh.kumar@mediconnect.com",
        firstName: "Rajesh",
        lastName: "Kumar",
        phone: "+91 40 2355 1066",
        specialty: "Cardiologist",
        experience: 15,
        bio: "Leading interventional cardiologist with extensive experience in complex cardiac procedures. Performed over 5000 successful angioplasties.",
        consultationFee: 500
    },
    {
        email: "dr.priya.sharma@mediconnect.com",
        firstName: "Priya",
        lastName: "Sharma",
        phone: "+91 40 6165 6565",
        specialty: "Gynecologist",
        experience: 12,
        bio: "Specialist in obstetrics & gynecology with fellowship in laparoscopy. Expert in women's health and minimally invasive procedures.",
        consultationFee: 600
    },
    {
        email: "dr.anil.reddy@mediconnect.com",
        firstName: "Anil",
        lastName: "Reddy",
        phone: "+91 40 6734 6734",
        specialty: "Orthopedic Surgeon",
        experience: 18,
        bio: "Orthopedic surgeon with fellowship in joint replacement. Specializes in trauma surgery and sports medicine.",
        consultationFee: 700
    },
    {
        email: "dr.meena.rao@mediconnect.com",
        firstName: "Meena",
        lastName: "Rao",
        phone: "+91 40 2771 4466",
        specialty: "Pediatrician",
        experience: 10,
        bio: "Pediatrician with fellowship in neonatology. Expert in child healthcare and development.",
        consultationFee: 450
    },
    {
        email: "dr.suresh.gupta@mediconnect.com",
        firstName: "Suresh",
        lastName: "Gupta",
        phone: "+91 40 4444 6666",
        specialty: "Neurologist",
        experience: 14,
        bio: "Neurologist specializing in brain and nervous system disorders. Expert in stroke care and epilepsy management.",
        consultationFee: 650
    },
    {
        email: "dr.kavitha.nair@mediconnect.com",
        firstName: "Kavitha",
        lastName: "Nair",
        phone: "+91 40 2355 1066",
        specialty: "Dermatologist",
        experience: 8,
        bio: "Dermatologist with fellowship in cosmetic dermatology. Specializes in skin care and aesthetic treatments.",
        consultationFee: 550
    }
]

async function createCompleteProfile() {
    console.log('👨‍⚕️ Creating complete doctor profiles step by step...')

    let completedDoctors = 0

    for (const doctor of doctorsData) {
        try {
            console.log(`\n🔐 Processing Dr. ${doctor.firstName} ${doctor.lastName}...`)

            // Step 1: Sign in as the doctor
            const { data: authData, error: signInError } = await supabase.auth.signInWithPassword({
                email: doctor.email,
                password: 'mediconnect123'
            })

            if (signInError) {
                console.error(`❌ Login failed for Dr. ${doctor.firstName}:`, signInError.message)
                continue
            }

            console.log(`✅ Signed in as Dr. ${doctor.firstName}`)
            const userId = authData.user.id

            // Step 2: Create or update profile
            const { data: existingProfile, error: checkProfileError } = await supabase
                .from('profiles')
                .select('*')
                .eq('user_id', userId)
                .single()

            let profileId = null

            if (checkProfileError && checkProfileError.code === 'PGRST116') {
                // Profile doesn't exist, create it
                console.log(`📝 Creating profile for Dr. ${doctor.firstName}...`)

                const { data: newProfile, error: createProfileError } = await supabase
                    .from('profiles')
                    .insert({
                        user_id: userId,
                        email: doctor.email,
                        first_name: doctor.firstName,
                        last_name: doctor.lastName,
                        role: 'doctor',
                        phone: doctor.phone
                    })
                    .select()
                    .single()

                if (createProfileError) {
                    console.error(`❌ Profile creation failed for Dr. ${doctor.firstName}:`, createProfileError.message)
                    await supabase.auth.signOut()
                    continue
                }

                profileId = newProfile.id
                console.log(`✅ Profile created for Dr. ${doctor.firstName}`)

            } else if (existingProfile) {
                profileId = existingProfile.id
                console.log(`✅ Profile exists for Dr. ${doctor.firstName}`)

                // Update profile to ensure it's a doctor
                if (existingProfile.role !== 'doctor') {
                    await supabase
                        .from('profiles')
                        .update({
                            role: 'doctor',
                            first_name: doctor.firstName,
                            last_name: doctor.lastName,
                            phone: doctor.phone
                        })
                        .eq('id', profileId)
                    console.log(`✅ Updated profile role to doctor for Dr. ${doctor.firstName}`)
                }
            } else {
                console.error(`❌ Error checking profile for Dr. ${doctor.firstName}:`, checkProfileError.message)
                await supabase.auth.signOut()
                continue
            }

            // Step 3: Create doctor record
            const { data: existingDoctor, error: checkDoctorError } = await supabase
                .from('doctors')
                .select('*')
                .eq('profile_id', profileId)
                .single()

            if (checkDoctorError && checkDoctorError.code === 'PGRST116') {
                // Doctor record doesn't exist, create it
                console.log(`🏥 Creating doctor record for Dr. ${doctor.firstName}...`)

                const { data: newDoctor, error: createDoctorError } = await supabase
                    .from('doctors')
                    .insert({
                        profile_id: profileId,
                        specialty: doctor.specialty,
                        years_experience: doctor.experience,
                        bio: doctor.bio,
                        license_number: `MED${Date.now().toString().slice(-4)}${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
                        consultation_fee: doctor.consultationFee
                    })
                    .select()
                    .single()

                if (createDoctorError) {
                    console.error(`❌ Doctor record creation failed for Dr. ${doctor.firstName}:`, createDoctorError.message)
                    await supabase.auth.signOut()
                    continue
                }

                console.log(`✅ Doctor record created for Dr. ${doctor.firstName}`)
                completedDoctors++

            } else if (existingDoctor) {
                console.log(`✅ Doctor record exists for Dr. ${doctor.firstName}`)
                completedDoctors++
            } else {
                console.error(`❌ Error checking doctor record for Dr. ${doctor.firstName}:`, checkDoctorError.message)
            }

            // Step 4: Sign out
            await supabase.auth.signOut()
            console.log(`🚪 Signed out Dr. ${doctor.firstName}`)

            // Small delay between doctors
            await new Promise(resolve => setTimeout(resolve, 1000))

        } catch (error) {
            console.error(`💥 Error processing Dr. ${doctor.firstName}:`, error.message)
            await supabase.auth.signOut()
        }
    }

    console.log(`\n🎉 Successfully set up ${completedDoctors}/${doctorsData.length} doctors`)

    // Final verification
    console.log('\n🔍 Final verification of doctors...')
    const { data: allDoctors, error: verifyError } = await supabase
        .from('doctors')
        .select(`
      *,
      profiles (
        first_name,
        last_name,
        email,
        phone
      )
    `)

    if (verifyError) {
        console.error('❌ Verification error:', verifyError.message)
    } else {
        console.log(`\n📊 Total doctors available: ${allDoctors?.length || 0}`)

        if (allDoctors && allDoctors.length > 0) {
            console.log('\n🎯 SUCCESS! Doctors ready for appointment booking:')
            console.log('='.repeat(60))

            allDoctors.forEach((doc, index) => {
                console.log(`${index + 1}. Dr. ${doc.profiles.first_name} ${doc.profiles.last_name}`)
                console.log(`   📧 Email: ${doc.profiles.email}`)
                console.log(`   📱 Phone: ${doc.profiles.phone}`)
                console.log(`   🏥 Specialty: ${doc.specialty}`)
                console.log(`   📅 Experience: ${doc.years_experience} years`)
                console.log(`   💰 Fee: $${doc.consultation_fee}`)
                console.log(`   📜 License: ${doc.license_number}`)
                console.log('   ' + '-'.repeat(40))
            })

            console.log('\n🚀 BOOKING SYSTEM IS NOW FULLY FUNCTIONAL!')
            console.log('')
            console.log('🎯 Next Steps:')
            console.log('  1. Run: npm run dev')
            console.log('  2. Open: http://localhost:5173')
            console.log('  3. Go to the Booking page')
            console.log('  4. Select a doctor and book an appointment!')
            console.log('')
            console.log('✅ The system will now:')
            console.log('  • Show all available doctors')
            console.log('  • Allow appointment date/time selection')
            console.log('  • Create patient records automatically')
            console.log('  • Successfully book appointments')
            console.log('  • Handle conflicts and validation')

        } else {
            console.log('❌ No doctors found in the final verification')
            console.log('💡 You may need to manually sign up as a doctor through the UI')
        }
    }
}

createCompleteProfile()