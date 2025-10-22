# Supabase Database Update Guide for Razorpay Integration

## Overview
This guide will help you update your Supabase database to support payment integration with Razorpay.

---

## Step 1: Run the Migration Script

1. **Open Supabase Dashboard**
   - Go to https://supabase.com/dashboard
   - Select your project: **MediConnect**

2. **Navigate to SQL Editor**
   - Click on **SQL Editor** in the left sidebar
   - Click **New Query**

3. **Copy and Run the Migration**
   - Open the file: `supabase/migrations/20251022120000_update_consultation_fees.sql`
   - Copy the entire SQL script
   - Paste it into the SQL Editor
   - Click **Run** (or press Ctrl/Cmd + Enter)

---

## What This Migration Does

### 1. **Updates Consultation Fees**
   - Sets consultation_fee to NOT NULL with default ₹500
   - Updates all existing doctors with specialty-based fees:
     - Cardiologists: ₹1,000
     - Oncologists: ₹1,500
     - Neurologists: ₹1,200
     - Nephrologists: ₹1,100
     - General Physicians: ₹500
     - Physiotherapists: ₹400
     - And more...

### 2. **Adds Payment Columns to Appointments**
   - `payment_status`: pending/completed/failed/refunded
   - `payment_id`: Internal payment reference
   - `razorpay_order_id`: Razorpay order ID
   - `razorpay_payment_id`: Razorpay payment ID
   - `razorpay_signature`: For payment verification
   - `amount_paid`: Amount paid in INR
   - `payment_date`: Timestamp of payment

### 3. **Creates Payments Table**
   - Complete payment transaction history
   - Links to appointments, patients, and doctors
   - Stores Razorpay transaction details
   - Supports payment status tracking

### 4. **Adds Security & Constraints**
   - Consultation fee validation (₹100 - ₹10,000)
   - Row Level Security (RLS) policies
   - Indexes for better query performance
   - Payment status constraints

---

## Step 2: Verify the Changes

Run these queries in SQL Editor to verify:

```sql
-- Check doctors table structure
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_name = 'doctors' AND column_name = 'consultation_fee';

-- Check if consultation fees are updated
SELECT specialty, consultation_fee, COUNT(*) as count
FROM public.doctors
GROUP BY specialty, consultation_fee
ORDER BY specialty;

-- Check payments table structure
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'payments'
ORDER BY ordinal_position;

-- Check appointments table for payment columns
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'appointments' 
AND column_name LIKE '%payment%'
ORDER BY ordinal_position;
```

---

## Step 3: Prepare for Razorpay Integration

### Environment Variables Needed
Add these to your `.env` file (you'll provide the actual keys later):

```env
# Razorpay Configuration
VITE_RAZORPAY_KEY_ID=your_razorpay_key_id_here
RAZORPAY_KEY_SECRET=your_razorpay_key_secret_here

# For production
VITE_RAZORPAY_ENABLED=true
```

### What's Next
Once you provide your Razorpay API keys, I'll help you:
1. Install Razorpay SDK
2. Create payment service
3. Update booking flow with payment integration
4. Add payment confirmation page
5. Create webhook handler for payment verification

---

## Important Notes

⚠️ **Security Considerations:**
- Never expose `RAZORPAY_KEY_SECRET` in frontend code
- Payment verification should happen on backend (Supabase Edge Functions)
- Always verify Razorpay signatures before confirming payments

💡 **Testing:**
- Razorpay provides test keys for development
- Use test credit card numbers for testing payments
- Test Mode: No real money is charged

📊 **Payment Flow:**
1. User books appointment → Creates order in Razorpay
2. User pays → Razorpay processes payment
3. Payment success → Verify signature → Update database
4. Send confirmation email/notification

---

## Troubleshooting

**If migration fails:**
- Check if tables exist: `SELECT tablename FROM pg_tables WHERE schemaname = 'public';`
- Check for existing constraints that might conflict
- Run migrations one section at a time

**If RLS policies block operations:**
- Temporarily disable RLS: `ALTER TABLE public.payments DISABLE ROW LEVEL SECURITY;`
- Test your queries
- Re-enable RLS: `ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;`

---

## Next Steps

✅ **Completed:**
- Updated local doctors data with consultation fees
- Created SQL migration script

🔲 **To Do:**
1. Run the SQL migration in Supabase
2. Verify database changes
3. Provide Razorpay API keys
4. Integrate Razorpay SDK in frontend
5. Create payment processing logic
6. Test payment flow

---

**Ready to proceed?** Once you run this migration and provide the Razorpay keys, I'll integrate the complete payment system! 🚀
