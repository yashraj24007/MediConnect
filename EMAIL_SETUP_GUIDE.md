# Email Configuration Guide - MediConnect

## Current Issue
Your SMTP settings in Supabase are configured, but the application needs additional setup to send emails automatically.

## ✅ SMTP Settings (Already Configured)
- **Host**: mediconnect-drab.vercel.app
- **Port**: 465
- **Sender**: yashraj24007@gmail.com
- **Name**: Yash Raj

## 🔧 Required Setup Options

### Option 1: Use Supabase Database Webhooks (Recommended)

1. **Go to Supabase Dashboard**
   - Navigate to: Database → Webhooks
   - Click "Create a new webhook"

2. **Configure Webhook**
   ```
   Name: Send Email Notifications
   Table: email_notifications
   Events: INSERT
   Type: HTTP Request
   Method: POST
   URL: https://your-email-service.com/send
   ```

3. **Create Email Sending Service**
   You need a service that:
   - Receives webhook POST requests
   - Reads email_notifications table
   - Sends email via SMTP
   - Updates sent_at timestamp

### Option 2: Deploy Edge Function with Environment Variables

1. **Set Environment Variables in Supabase**
   ```bash
   # Go to Supabase Dashboard → Edge Functions → Settings
   RESEND_API_KEY=your_resend_key
   # OR use your SMTP credentials
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=yashraj24007@gmail.com
   SMTP_PASS=your_app_password
   ```

2. **Deploy the Edge Function**
   ```bash
   cd supabase
   supabase functions deploy send-appointment-email
   ```

### Option 3: Use Resend API (Easiest)

1. **Sign up for Resend** (Free tier: 100 emails/day)
   - Visit: https://resend.com
   - Get API key

2. **Add to .env file**
   ```
   VITE_RESEND_API_KEY=re_xxxxxxxxxxxxx
   ```

3. **Update Edge Function environment**
   ```bash
   supabase secrets set RESEND_API_KEY=re_xxxxxxxxxxxxx
   supabase functions deploy send-appointment-email
   ```

### Option 4: Gmail App Password (For Testing)

1. **Enable 2-Factor Authentication** on your Gmail
2. **Generate App Password**:
   - Go to: Google Account → Security → 2-Step Verification
   - Scroll to "App passwords"
   - Generate password for "Mail"

3. **Update Supabase SMTP Settings**:
   - Host: smtp.gmail.com
   - Port: 587 (or 465 for SSL)
   - Username: yashraj24007@gmail.com
   - Password: [16-character app password]

4. **Configure Database Webhook** (see Option 1)

## 🚀 Quick Fix for Testing

For immediate testing, you can use a third-party email service:

### Using EmailJS (No Backend Required)

1. **Sign up at** https://www.emailjs.com
2. **Get Service ID, Template ID, and Public Key**
3. **Install EmailJS**:
   ```bash
   npm install @emailjs/browser
   ```

4. **Use in your app**:
   ```typescript
   import emailjs from '@emailjs/browser';
   
   emailjs.send(
     'service_id',
     'template_id',
     {
       to_email: data.patientEmail,
       patient_name: data.patientName,
       doctor_name: data.doctorName,
       // ... other fields
     },
     'public_key'
   );
   ```

## 📊 Current Status

✅ SMTP configured in Supabase
✅ Email templates ready
✅ Database table created
❌ Email sending mechanism not connected
❌ Edge function not deployed OR webhook not configured

## 🔍 Debugging Steps

1. **Check Supabase Logs**:
   - Dashboard → Logs → Edge Functions
   - Look for errors

2. **Test Edge Function**:
   ```bash
   curl -i --location --request POST \
     'https://your-project.supabase.co/functions/v1/send-appointment-email' \
     --header 'Authorization: Bearer YOUR_ANON_KEY' \
     --header 'Content-Type: application/json' \
     --data '{"to":"test@example.com","patientName":"Test"}'
   ```

3. **Check Database**:
   ```sql
   SELECT * FROM email_notifications 
   WHERE sent_at IS NULL 
   ORDER BY created_at DESC;
   ```

## 💡 Recommended Solution

**For Production**: Use Resend API with deployed Edge Function
- Most reliable
- Easy to set up
- Free tier sufficient for testing
- Automatic retry logic
- Delivery tracking

**For Development**: Use EmailJS
- No backend required
- Works immediately
- Good for testing UI

**For Full Control**: Configure Database Webhook + Custom Email Service
- Use your SMTP settings
- Complete control
- Can implement custom logic

## 📞 Need Help?

If you choose Option 1 (Recommended - Resend):
1. Get Resend API key
2. Run: `supabase secrets set RESEND_API_KEY=your_key`
3. Deploy: `supabase functions deploy send-appointment-email`
4. Test booking to receive emails

Let me know which option you'd like to implement!
