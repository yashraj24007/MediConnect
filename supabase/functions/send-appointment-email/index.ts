import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST',
        'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
      }
    })
  }

  try {
    const { 
      to, 
      patientName, 
      doctorName, 
      specialty,
      appointmentDate, 
      appointmentTime,
      serviceType,
      fee 
    } = await req.json()

    // Format date
    const formattedDate = new Date(appointmentDate).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })

    const emailHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .appointment-details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #667eea; }
            .detail-row { padding: 10px 0; border-bottom: 1px solid #eee; }
            .detail-label { font-weight: bold; color: #667eea; }
            .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
            .button { display: inline-block; padding: 12px 30px; background: #667eea; color: white; text-decoration: none; border-radius: 5px; margin-top: 20px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎉 Appointment Confirmed!</h1>
              <p>Your appointment has been successfully booked</p>
            </div>
            <div class="content">
              <p>Dear ${patientName},</p>
              <p>Your appointment with <strong>${doctorName}</strong> has been confirmed. Here are your appointment details:</p>
              
              <div class="appointment-details">
                <div class="detail-row">
                  <span class="detail-label">👨‍⚕️ Doctor:</span> ${doctorName}
                </div>
                <div class="detail-row">
                  <span class="detail-label">🏥 Specialty:</span> ${specialty}
                </div>
                <div class="detail-row">
                  <span class="detail-label">📅 Date:</span> ${formattedDate}
                </div>
                <div class="detail-row">
                  <span class="detail-label">🕐 Time:</span> ${appointmentTime}
                </div>
                <div class="detail-row">
                  <span class="detail-label">💼 Service:</span> ${serviceType}
                </div>
                <div class="detail-row">
                  <span class="detail-label">💰 Consultation Fee:</span> ₹${fee}
                </div>
              </div>

              <p><strong>Important Reminders:</strong></p>
              <ul>
                <li>Please arrive 10 minutes before your scheduled time</li>
                <li>Bring any relevant medical records or test reports</li>
                <li>If you need to reschedule, please contact us at least 24 hours in advance</li>
              </ul>

              <p>You can view and manage your appointments by logging into your MediConnect account.</p>

              <p>If you have any questions, please don't hesitate to contact us.</p>
              
              <p>Best regards,<br><strong>MediConnect Team</strong></p>
            </div>
            <div class="footer">
              <p>This is an automated message. Please do not reply to this email.</p>
              <p>© ${new Date().getFullYear()} MediConnect. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `

    // Send email using Resend
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${RESEND_API_KEY}`
      },
      body: JSON.stringify({
        from: 'MediConnect <onboarding@resend.dev>',
        to: [to],
        subject: '🎉 Appointment Confirmation - MediConnect',
        html: emailHtml
      })
    })

    const data = await res.json()

    return new Response(
      JSON.stringify(data),
      { 
        headers: { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        } 
      },
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 400,
        headers: { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        } 
      },
    )
  }
})
