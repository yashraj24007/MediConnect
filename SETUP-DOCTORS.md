## How to Add Doctors to Test Booking

Since the database was cleaned and RLS policies prevent direct insertion, you need to create doctor accounts through the normal signup process:

### Option 1: Manual Signup (Recommended)
1. Start your app: `npm run dev`
2. Go to the signup page
3. Create accounts with these details:

**Doctor 1:**
- Email: `dr.smith@mediconnect.com`
- Password: `password123`
- First Name: `John`
- Last Name: `Smith`
- Role: `Doctor`

**Doctor 2:**
- Email: `dr.johnson@mediconnect.com`
- Password: `password123`
- First Name: `Sarah`
- Last Name: `Johnson`
- Role: `Doctor`

### Option 2: Use Supabase Dashboard
1. Go to: https://supabase.com/dashboard/project/zezrhlilrafxwqmslubo/auth/users
2. Click "Add user"
3. Create doctor accounts manually
4. Add their profiles in the Table Editor

### Option 3: Seed Data Script (Advanced)
You can use the Supabase service role key to bypass RLS, but this requires the service key which is more sensitive.

### After Creating Doctor Accounts:
1. The doctors need to complete their profiles
2. Doctor records will be automatically created via triggers
3. Then patients can book appointments with them

### Current Status:
- ✅ Booking system is fixed and improved
- ✅ Better error handling added
- ✅ Form validation enhanced
- ❌ No doctors in database (need to create via signup)

### Next Steps:
1. Create at least one doctor account via signup
2. Test patient signup and booking
3. Verify appointment creation works