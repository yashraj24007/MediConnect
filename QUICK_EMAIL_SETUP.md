    # Quick Email Setup Guide for MediConnect

## 🚨 Current Status: Emails are NOT being sent

Users will see appointment confirmations on the website but won't receive email notifications.

## ⚡ Fastest Solution (5 minutes)

### Option 1: Use Resend (Recommended - FREE 3000 emails/month)

1. **Sign up at** https://resend.com/signup
2. **Get your API key** from dashboard
3. **Deploy Edge Function**:
   ```bash
   cd supabase
   supabase login
   supabase secrets set RESEND_API_KEY=re_your_key_here
   supabase functions deploy send-appointment-email
   ```

4. **Test it**: Book a test appointment

✅ **Done!** Emails will now be sent automatically.

---

### Option 2: Use Gmail SMTP (For Testing Only)

1. **Enable 2FA** on your Gmail account
2. **Generate App Password**:
   - Go to: https://myaccount.google.com/security
   - Click "2-Step Verification" → "App passwords"
   - Generate password for "Mail"
   - Copy the 16-character password

3. **Configure Supabase SMTP**:
   - Go to: Supabase Dashboard → Project Settings → Auth → SMTP Settings
   - Enable custom SMTP
   - Host: `smtp.gmail.com`
   - Port: `587`
   - Username: `your-email@gmail.com`
   - Password: [16-character app password from step 2]
   - Sender Email: `your-email@gmail.com`
   - Sender Name: `MediConnect`

4. **Create Database Webhook**:
   - Go to: Database → Webhooks → Create webhook
   - This requires additional backend setup (see EMAIL_SETUP_GUIDE.md)

---

### Option 3: Use EmailJS (No Backend Required)

1. **Sign up** at https://www.emailjs.com (Free: 200 emails/month)
2. **Create email service** and template
3. **Get credentials**: Service ID, Template ID, Public Key
4. **Install package**:
   ```bash
   npm install @emailjs/browser
   ```

5. **Update emailService.ts** to use EmailJS instead of Supabase Edge Function

---

## 📝 What Happens Without Email Setup?

✅ Appointments are still saved to database
✅ Users can see appointments in "My Appointments"
✅ Booking confirmation shows on screen
❌ No email notification sent
ℹ️ Console shows email details that would have been sent

---

## 🎯 For Production Deployment

1. **Set up proper email service** (Resend, SendGrid, or AWS SES)
2. **Deploy Edge Functions** with environment variables
3. **Configure proper domain** for sender email
4. **Test thoroughly** before going live
5. **Monitor email delivery** rates

---

## 🔗 Useful Links

- Resend: https://resend.com
- EmailJS: https://www.emailjs.com
- SendGrid: https://sendgrid.com
- Supabase Edge Functions: https://supabase.com/docs/guides/functions

---

## 💡 Quick Test

To test if emails work:
1. Book an appointment
2. Check browser console
3. If you see "✅ Email sent successfully" → Working!
4. If you see "⚠️ EMAIL SERVICE NOT CONFIGURED" → Not working (follow steps above)
