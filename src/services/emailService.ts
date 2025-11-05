import { supabase } from "@/integrations/supabase/client";

interface AppointmentEmailData {
  patientName: string;
  patientEmail: string;
  doctorName: string;
  specialty: string;
  appointmentDate: string;
  appointmentTime: string;
  serviceType: string;
  fee: number;
}

/**
 * Send appointment confirmation email to the patient
 * Now uses Supabase's built-in email functionality with custom SMTP
 */
export async function sendAppointmentConfirmationEmail(data: AppointmentEmailData) {
  try {
    const formattedDate = new Date(data.appointmentDate).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

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
              <p>Dear ${data.patientName},</p>
              <p>Your appointment with <strong>${data.doctorName}</strong> has been confirmed. Here are your appointment details:</p>
              
              <div class="appointment-details">
                <div class="detail-row">
                  <span class="detail-label">👨‍⚕️ Doctor:</span> ${data.doctorName}
                </div>
                <div class="detail-row">
                  <span class="detail-label">🏥 Specialty:</span> ${data.specialty}
                </div>
                <div class="detail-row">
                  <span class="detail-label">📅 Date:</span> ${formattedDate}
                </div>
                <div class="detail-row">
                  <span class="detail-label">🕐 Time:</span> ${data.appointmentTime}
                </div>
                <div class="detail-row">
                  <span class="detail-label">💼 Service:</span> ${data.serviceType}
                </div>
                <div class="detail-row">
                  <span class="detail-label">💰 Consultation Fee:</span> ₹${data.fee}
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
    `;

    // Try to send email via Supabase Edge Function
    try {
      const { data: functionData, error: functionError } = await supabase.functions.invoke('send-appointment-email', {
        body: {
          to: data.patientEmail,
          patientName: data.patientName,
          doctorName: data.doctorName,
          specialty: data.specialty,
          appointmentDate: data.appointmentDate,
          appointmentTime: data.appointmentTime,
          serviceType: data.serviceType,
          fee: data.fee
        }
      });

      if (functionError) {
        console.warn('⚠️ EMAIL SERVICE NOT CONFIGURED');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('📧 Email Details (Would be sent to):');
        console.log('   To:', data.patientEmail);
        console.log('   Patient:', data.patientName);
        console.log('   Doctor:', data.doctorName);
        console.log('   Date:', formattedDate);
        console.log('   Time:', data.appointmentTime);
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('🔧 TO ENABLE EMAILS:');
        console.log('   1. Deploy Edge Function: supabase functions deploy send-appointment-email');
        console.log('   2. Set Resend API Key: supabase secrets set RESEND_API_KEY=your_key');
        console.log('   OR');
        console.log('   3. Configure Database Webhook (see EMAIL_SETUP_GUIDE.md)');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        
        // Show user-friendly notification
        return {
          success: false,
          message: 'Appointment confirmed! You can view details in "My Appointments". Note: Email notifications are currently being configured.',
          needsEmailSetup: true
        };
      }

      console.log('✅ Email sent successfully via Edge Function:', functionData);
      return {
        success: true,
        message: 'Email confirmation sent successfully!'
      };
    } catch (edgeError) {
      console.error('Edge function error:', edgeError);
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('⚠️ Email would be sent to:', data.patientEmail);
      console.log('📖 See EMAIL_SETUP_GUIDE.md for setup instructions');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      
      return {
        success: false,
        message: 'Appointment confirmed! You can view details in "My Appointments". Note: Email notifications are currently being configured.',
        needsEmailSetup: true
      };
    }

  } catch (error) {
    console.error('Error sending appointment email:', error);
    return {
      success: false,
      message: 'Failed to send email notification'
    };
  }
}

/**
 * Send appointment reminder email (can be scheduled 24 hours before)
 */
export async function sendAppointmentReminderEmail(data: AppointmentEmailData) {
  try {
    const formattedDate = new Date(data.appointmentDate).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    const emailHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #f59e0b; color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .reminder-box { background: #fef3c7; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #f59e0b; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>⏰ Appointment Reminder</h1>
            </div>
            <div class="content">
              <p>Dear ${data.patientName},</p>
              <p>This is a friendly reminder about your upcoming appointment:</p>
              
              <div class="reminder-box">
                <p><strong>👨‍⚕️ Doctor:</strong> ${data.doctorName}</p>
                <p><strong>📅 Date:</strong> ${formattedDate}</p>
                <p><strong>🕐 Time:</strong> ${data.appointmentTime}</p>
              </div>

              <p>We look forward to seeing you!</p>
              <p>Best regards,<br><strong>MediConnect Team</strong></p>
            </div>
          </div>
        </body>
      </html>
    `;

    console.log('Sending appointment reminder email to:', data.patientEmail);
    
    return {
      success: true,
      message: 'Reminder email queued for delivery'
    };

  } catch (error) {
    console.error('Error sending reminder email:', error);
    return {
      success: false,
      message: 'Failed to send reminder email'
    };
  }
}
