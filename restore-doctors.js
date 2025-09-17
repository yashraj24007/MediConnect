import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://zezrhlilrafxwqmslubo.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InplenJobGlscmFmeHdxbXNsdWJvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTczODUzMDksImV4cCI6MjA3Mjk2MTMwOX0.wSn4pG0Q4JU4lZSTsIY5n6-kl8M9NQ79D08iM2zkMJ8'

const supabase = createClient(supabaseUrl, supabaseKey)

// Original doctors data from your doctors.ts file
const originalDoctors = [{
        name: "Dr. Rajesh Kumar",
        specialty: "Cardiologist",
        hospital: "Apollo Hospitals Jubilee Hills",
        experience: 15,
        qualification: "MD Cardiology, DM Interventional Cardiology",
        phone: "+91 40 2355 1066",
        email: "dr.rajesh@apollohyd.com",
        consultationFee: 500
    },
    {
        name: "Dr. Priya Sharma",
        specialty: "Gynecologist",
        hospital: "CARE Hospitals Banjara Hills",
        experience: 12,
        qualification: "MD Obstetrics & Gynecology, Fellowship in Laparoscopy",
        phone: "+91 40 6165 6565",
        email: "dr.priya@carehospitals.com",
        consultationFee: 600
    },
    {
        name: "Dr. Anil Reddy",
        specialty: "Orthopedic Surgeon",
        hospital: "Continental Hospitals Gachibowli",
        experience: 18,
        qualification: "MS Orthopedics, Fellowship in Joint Replacement",
        phone: "+91 40 6734 6734",
        email: "dr.anil@continentalhospitals.com",
        consultationFee: 700
    },
    {
        name: "Dr. Meena Rao",
        specialty: "Pediatrician",
        hospital: "Yashoda Hospitals Secunderabad",
        experience: 10,
        qualification: "MD Pediatrics, Fellowship in Neonatology",
        phone: "+91 40 2771 4466",
        email: "dr.meena@yashodahospitals.com",
        consultationFee: 450
    },
    {
        name: "Dr. Suresh Gupta",
        specialty: "Neurologist",
        hospital: "KIMS Hospitals Kondapur",
        experience: 14,
        qualification: "DM Neurology, MD Internal Medicine",
        phone: "+91 40 4444 6666",
        email: "dr.suresh@kimshospitals.com",
        consultationFee: 650
    },
    {
        name: "Dr. Kavitha Nair",
        specialty: "Dermatologist",
        hospital: "Apollo Hospitals Jubilee Hills",
        experience: 8,
        qualification: "MD Dermatology, Fellowship in Cosmetic Dermatology",
        phone: "+91 40 2355 1066",
        email: "dr.kavitha@apollohyd.com",
        consultationFee: 550
    }
]

async function restoreOriginalDoctors() {
    console.log('🔄 Restoring original doctors to database...')
    console.log(`📋 Restoring ${originalDoctors.length} doctors from your original data`)

    let successCount = 0
    let errorCount = 0

    for (const doctor of originalDoctors) {
        try {
            console.log(`\n👨‍⚕️ Creating ${doctor.name}...`)

            // Extract first and last name
            const nameParts = doctor.name.replace('Dr. ', '').split(' ')
            const firstName = nameParts[0]
            const lastName = nameParts.slice(1).join(' ')

            // Create auth user first
            const { data: authData, error: signUpError } = await supabase.auth.admin.createUser({
                email: doctor.email,
                password: 'mediconnect123',
                email_confirm: true,
                user_metadata: {
                    first_name: firstName,
                    last_name: lastName,
                    role: 'doctor'
                }
            })

            if (signUpError) {
                console.error(`❌ Error creating auth user for ${doctor.name}:`, signUpError.message)
                errorCount++
                continue
            }

            console.log(`✅ Auth user created for ${doctor.name}`)

            // Create profile
            const { data: profile, error: profileError } = await supabase
                .from('profiles')
                .insert({
                    user_id: authData.user.id,
                    email: doctor.email,
                    first_name: firstName,
                    last_name: lastName,
                    role: 'doctor',
                    phone: doctor.phone
                })
                .select()
                .single()

            if (profileError) {
                console.error(`❌ Error creating profile for ${doctor.name}:`, profileError.message)
                errorCount++
                continue
            }

            console.log(`✅ Profile created for ${doctor.name}`)

            // Create doctor record
            const { data: doctorRecord, error: doctorError } = await supabase
                .from('doctors')
                .insert({
                    profile_id: profile.id,
                    specialization: doctor.specialty,
                    experience_years: doctor.experience,
                    qualifications: doctor.qualification,
                    license_number: `LIC${Date.now()}${Math.floor(Math.random() * 1000)}`,
                    consultation_fee: doctor.consultationFee
                })
                .select()
                .single()

            if (doctorError) {
                console.error(`❌ Error creating doctor record for ${doctor.name}:`, doctorError.message)
                errorCount++
                continue
            }

            console.log(`✅ Doctor record created for ${doctor.name}`)
            successCount++

        } catch (error) {
            console.error(`💥 Unexpected error creating ${doctor.name}:`, error.message)
            errorCount++
        }
    }

    console.log(`\n🎉 Restoration complete!`)
    console.log(`✅ Successfully restored: ${successCount} doctors`)
    console.log(`❌ Failed to restore: ${errorCount} doctors`)

    // Verify the restoration
    const { data: restoredDoctors, error } = await supabase
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
        console.error('❌ Error verifying restoration:', error)
    } else {
        console.log(`\n📊 Current doctors in database: ${restoredDoctors?.length || 0}`)
        if (restoredDoctors && restoredDoctors.length > 0) {
            console.log('👨‍⚕️ Available doctors:')
            restoredDoctors.forEach((doc, index) => {
                console.log(`  ${index + 1}. Dr. ${doc.profiles.first_name} ${doc.profiles.last_name} - ${doc.specialization}`)
            })
        }
    }
}

restoreOriginalDoctors()