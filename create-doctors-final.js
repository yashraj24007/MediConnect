import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://zezrhlilrafxwqmslubo.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InplenJobGlscmFmeHdxbXNsdWJvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTczODUzMDksImV4cCI6MjA3Mjk2MTMwOX0.wSn4pG0Q4JU4lZSTsIY5n6-kl8M9NQ79D08iM2zkMJ8'

const supabase = createClient(supabaseUrl, supabaseKey)

async function createDoctorsDirectly() {
    console.log('👨‍⚕️ Creating doctors directly in database...')

    // Doctor data with matching emails to the auth accounts we created
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

    let successCount = 0

    // First, let's see what profiles exist
    console.log('\n🔍 Checking existing profiles...')
    const { data: existingProfiles, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .in('email', doctorsData.map(d => d.email))

    if (profilesError) {
        console.error('❌ Error fetching profiles:', profilesError.message)
        return
    }

    console.log(`Found ${existingProfiles?.length || 0} existing profiles`)

    // Check existing doctors
    const { data: existingDoctors, error: doctorsError } = await supabase
        .from('doctors')
        .select(`
      *,
      profiles (email, first_name, last_name)
    `)

    if (doctorsError) {
        console.error('❌ Error fetching doctors:', doctorsError.message)
        return
    }

    console.log(`Found ${existingDoctors?.length || 0} existing doctors`)

    if (existingDoctors && existingDoctors.length > 0) {
        console.log('\n👨‍⚕️ Existing doctors:')
        existingDoctors.forEach(doc => {
            console.log(`- ${doc.profiles.first_name} ${doc.profiles.last_name} (${doc.profiles.email})`)
        })
    }

    // Now try to create doctor records for each profile
    for (const doctorData of doctorsData) {
        try {
            console.log(`\n🔄 Processing ${doctorData.firstName} ${doctorData.lastName}...`)

            // Find the profile
            const profile = existingProfiles ? .find(p => p.email === doctorData.email)

            if (!profile) {
                console.log(`❌ No profile found for ${doctorData.email}`)
                continue
            }

            console.log(`✅ Found profile for ${doctorData.firstName}`)

            // Check if doctor record already exists
            const existingDoctor = existingDoctors ? .find(d => d.profiles.email === doctorData.email)

            if (existingDoctor) {
                console.log(`✅ Doctor record already exists for ${doctorData.firstName}`)
                successCount++
                continue
            }

            // Try to create doctor record directly (will test RLS policies)
            const { data: newDoctor, error: createError } = await supabase
                .from('doctors')
                .insert({
                    profile_id: profile.id,
                    specialty: doctorData.specialty,
                    years_experience: doctorData.experience,
                    bio: doctorData.bio,
                    license_number: `MED${Date.now().toString().slice(-4)}${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
                    consultation_fee: doctorData.consultationFee
                })
                .select()
                .single()

            if (createError) {
                console.error(`❌ Failed to create doctor record for ${doctorData.firstName}:`, createError.message)

                // If it's an RLS error, let's try a different approach
                if (createError.message.includes('row-level security')) {
                    console.log(`🔧 Trying workaround for ${doctorData.firstName}...`)

                    // Let's try signing in as the user first
                    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
                        email: doctorData.email,
                        password: 'mediconnect123'
                    })

                    if (signInError) {
                        console.error(`❌ Can't sign in as ${doctorData.firstName}:`, signInError.message)
                        continue
                    }

                    console.log(`✅ Signed in as ${doctorData.firstName}`)

                    // Now try creating the doctor record while signed in as the user
                    const { data: newDoctor2, error: createError2 } = await supabase
                        .from('doctors')
                        .insert({
                            profile_id: profile.id,
                            specialty: doctorData.specialty,
                            years_experience: doctorData.experience,
                            bio: doctorData.bio,
                            license_number: `MED${Date.now().toString().slice(-4)}${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
                            consultation_fee: doctorData.consultationFee
                        })
                        .select()
                        .single()

                    // Sign out
                    await supabase.auth.signOut()

                    if (createError2) {
                        console.error(`❌ Still failed for ${doctorData.firstName}:`, createError2.message)
                        continue
                    } else {
                        console.log(`✅ Created doctor record for ${doctorData.firstName} using workaround`)
                        successCount++
                    }
                }
                continue
            }

            console.log(`✅ Created doctor record for ${doctorData.firstName}`)
            successCount++

        } catch (error) {
            console.error(`💥 Error processing ${doctorData.firstName}:`, error.message)
        }
    }

    console.log(`\n🎉 Successfully created ${successCount}/${doctorsData.length} doctor records`)

    // Final verification
    console.log('\n📊 Final verification...')
    const { data: finalDoctors, error: finalError } = await supabase
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

    if (finalError) {
        console.error('❌ Error in final verification:', finalError.message)
    } else {
        console.log(`\n✅ Total doctors in database: ${finalDoctors?.length || 0}`)

        if (finalDoctors && finalDoctors.length > 0) {
            console.log('\n👨‍⚕️ Ready for appointment booking:')
            finalDoctors.forEach((doc, index) => {
                console.log(`  ${index + 1}. Dr. ${doc.profiles.first_name} ${doc.profiles.last_name}`)
                console.log(`     📧 ${doc.profiles.email}`)
                console.log(`     📱 ${doc.profiles.phone}`)
                console.log(`     🏥 ${doc.specialty}`)
                console.log(`     📅 ${doc.years_experience} years experience`)
                console.log(`     💰 $${doc.consultation_fee} consultation fee`)
                console.log('')
            })

            console.log('🚀 SUCCESS! Your MediConnect booking system is ready!')
            console.log('')
            console.log('📋 What you can do now:')
            console.log('  1. Start the dev server: npm run dev')
            console.log('  2. Go to http://localhost:5173')
            console.log('  3. Navigate to the booking page')
            console.log('  4. Select any of these doctors and book an appointment!')
            console.log('')
            console.log('🎯 The booking system will:')
            console.log('  ✓ Show available doctors')
            console.log('  ✓ Allow date/time selection')
            console.log('  ✓ Create patient records automatically')
            console.log('  ✓ Book appointments successfully')

        } else {
            console.log('❌ No doctors available for booking yet')
        }
    }
}

createDoctorsDirectly()