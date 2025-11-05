# 🏥 MediConnect - AI-Powered Healthcare Platform

**MediConnect** is a modern, comprehensive healthcare management platform that connects patients with doctors, enables telemedicine consultations, and provides AI-powered health insights. Built with React, TypeScript, and Supabase, MediConnect offers a seamless experience for managing healthcare needs.

---

## ✨ Features

### 🤖 AI-Powered Services
- **AI Health Assistant (Aura)** - 24/7 AI-powered chat assistant for health queries and guidance
- **Symptom Analyzer** - Intelligent symptom analysis with personalized recommendations
- **Health Insights** - Get AI-driven health insights from your medical data
- **Smart Appointment Booking** - AI recommendations for the right doctor based on your symptoms

### 👨‍⚕️ Doctor & Hospital Management
- **Find Doctors** - Browse verified doctors by specialty, rating, and availability
- **Hospital Directory** - Comprehensive list of hospitals with detailed profiles
- **Doctor Profiles** - View qualifications, experience, consultation fees, and patient reviews
- **Real-time Availability** - Check doctor schedules and book available slots

### 📅 Appointment Management
- **Smart Booking System** - Easy-to-use appointment scheduling with calendar integration
- **My Appointments** - View, cancel, or reschedule appointments
- **Appointment History** - Track past, upcoming, and cancelled appointments
- **Email Notifications** - Beautiful HTML emails sent via Resend API with appointment details
- **Automatic Confirmations** - Instant email confirmations with doctor info, date, time, and fee

### 💊 Medication & Health Tracking
- **Medication Reminders** - AI-powered medication tracking and reminder system
- **Drug Interaction Checker** - AI analysis of potential drug interactions
- **Medication History** - Track medication adherence and refill reminders
- **Pause/Resume Medications** - Flexible medication management

### 📊 Patient Dashboard
- **Health Records** - Secure access to medical records and reports
- **Appointment Analytics** - Visual insights into appointment history
- **Wallet System** - Manage payments and transaction history
- **Account Settings** - Personalized profile and preferences

### 🎥 Telemedicine
- **Video Consultations** - Secure video calls with healthcare providers
- **File Sharing** - Share medical documents during consultations
- **Prescription Management** - Receive digital prescriptions instantly

### 🔒 Security & Privacy
- **Role-Based Access Control** - Separate patient and doctor portals
- **Secure Authentication** - Supabase-powered authentication with Row Level Security
- **HIPAA Compliance Ready** - Privacy-first design and data handling
- **Protected Routes** - Secure access to sensitive health information

---

## 🚀 Tech Stack

### Frontend
- **React 18** - Modern UI library with hooks
- **TypeScript** - Type-safe development
- **Vite** - Lightning-fast build tool
- **React Router v6** - Client-side routing
- **Tailwind CSS** - Utility-first styling
- **shadcn/ui** - Beautiful, accessible component library

### Backend & Services
- **Supabase** - PostgreSQL database with real-time capabilities
- **Supabase Edge Functions** - Serverless functions for email notifications
- **Groq AI** - Advanced AI language models for health services
- **Resend API** - Transactional email service for appointment confirmations

### State Management & Data
- **React Query** - Server state management
- **React Hook Form** - Form handling with validation
- **Zod** - Schema validation

### UI Components
- **Radix UI** - Accessible component primitives
- **Lucide Icons** - Beautiful icon library
- **Recharts** - Data visualization
- **date-fns** - Date manipulation

---

## 📦 Installation

### Prerequisites
- Node.js 18+ 
- npm or bun
- Supabase account
- Groq API key (for AI features)

### Setup Instructions

1. **Clone the repository**
   ```bash
   git clone https://github.com/yashraj24007/MediConnect.git
   cd MediConnect
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   bun install
   ```

3. **Environment Configuration**
   
   Create a `.env` file in the root directory:
   ```env
   # Supabase Configuration
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   VITE_SUPABASE_PROJECT_ID=your_project_id
   
   # Groq AI Configuration (Required for AI features)
   VITE_GROQ_API_KEY=your_groq_api_key
   
   # Resend API Key (Stored in Supabase Secrets for Edge Functions)
   # Get your key from: https://resend.com/api-keys
   RESEND_API_KEY=your_resend_api_key
   ```

4. **Database Setup**
   
   Run the Supabase migrations:
   ```bash
   # Make sure Supabase CLI is installed
   npm install -g supabase
   
   # Login to Supabase
   supabase login
   
   # Link your project
   supabase link --project-ref your-project-ref
   
   # Push database migrations
   supabase db push
   ```

5. **Email Service Setup (Optional but Recommended)**
   
   Configure email notifications:
   ```bash
   # Set Resend API key in Supabase secrets
   supabase secrets set RESEND_API_KEY=your_resend_api_key
   
   # Deploy the email Edge Function
   supabase functions deploy resendmail
   ```
   
   **Get Resend API Key:**
   - Sign up at https://resend.com (Free: 3,000 emails/month)
   - Get API key from dashboard
   - Configure in Supabase secrets as shown above

6. **Start Development Server**
   ```bash
   npm run dev
   # or
   bun run dev
   ```

   The app will be available at `http://localhost:5173`

---

## 🗄️ Database Schema

### Core Tables
- **users** - User profiles and authentication
- **doctors** - Doctor information, specialties, and availability
- **hospitals** - Hospital profiles and details
- **appointments** - Appointment bookings and history
- **doctor_availability** - Doctor schedule management
- **contact_inquiries** - Contact form submissions

### Key Features
- **Row Level Security (RLS)** - Database-level access control
- **Real-time subscriptions** - Live data updates
- **Automatic timestamps** - Created/updated tracking

---

## 🎨 Project Structure

```
MediConnect/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── Layout/         # Header, Footer, Layout
│   │   ├── Chat/           # Chat widget components
│   │   ├── Gallery/        # Medical gallery
│   │   └── ui/             # shadcn/ui components
│   ├── pages/              # Application pages/routes
│   │   ├── Home.tsx
│   │   ├── Doctors.tsx
│   │   ├── Booking.tsx
│   │   ├── MyAppointments.tsx
│   │   ├── AIHealthAssistant.tsx
│   │   ├── SymptomAnalyzer.tsx
│   │   └── ...
│   ├── services/           # API and business logic
│   │   ├── groqService.ts
│   │   ├── aiMedicalService.ts
│   │   └── doctorService.ts
│   ├── hooks/              # Custom React hooks
│   ├── lib/                # Utility functions
│   ├── data/               # Static data
│   └── integrations/       # Third-party integrations
├── supabase/
│   ├── migrations/         # Database migrations
│   ├── functions/          # Edge functions
│   │   ├── resendmail/    # Email notification function
│   │   └── chat-ai/       # AI chat function
│   └── config.toml         # Supabase configuration
├── public/                 # Static assets
└── package.json
```

---

## 🧩 Key Components

### Patient Features
- **Home Page** - Landing page with hero section and features
- **Doctor Search** - Browse and filter doctors by specialty
- **Smart Booking** - AI-powered appointment scheduling
- **My Appointments** - Manage all appointments (view, cancel, reschedule)
- **AI Health Assistant** - Interactive chat with health AI
- **Symptom Analyzer** - Input symptoms for AI analysis
- **Medication Reminders** - Track and manage medications

### Doctor Features
- **Doctor Dashboard** - Appointment overview and analytics
- **Doctor Profile** - Manage profile, qualifications, and fees
- **Patient Management** - View patient information
- **Availability Management** - Set working hours and time slots

---

## 🔑 Key Features Explained

### AI Health Assistant (Aura)
- Powered by Groq's advanced AI models
- Contextual conversation with medical knowledge
- 24/7 availability for health queries
- Floating chat widget accessible from anywhere

### Smart Appointment Booking
- AI analyzes symptoms and health concerns
- Recommends appropriate doctors by specialty
- Shows doctor availability in real-time
- One-click booking with confirmation

### Medication Reminders
- Add medications with dosage and schedule
- Pause/resume reminders as needed
- AI-powered drug interaction checking
- Track medication adherence

### Email Notifications
- Professional HTML email templates
- Appointment confirmation emails with all details
- Includes doctor name, specialty, date, time, and consultation fee
- Sent via Resend API through Supabase Edge Functions
- Automatic error handling and retry logic
- Beautiful gradient design matching brand identity

### Appointment Management
- View all appointments (scheduled, completed, cancelled)
- Cancel with reason and policy warning
- Reschedule with date/time picker
- Status badges and visual indicators

---

## 🌐 API Integration

### Groq AI Service
```typescript
// services/groqService.ts
- sendMessage() - Send chat messages to AI
- Used by: AI Health Assistant, Symptom Analyzer, Health Insights
```

### Supabase Integration
```typescript
// integrations/supabase/
- Authentication - User login/signup
- Database - Real-time data access
- Storage - File uploads
- Edge Functions - Serverless functions

// Edge Functions
- resendmail - Send appointment confirmation emails
- chat-ai - AI-powered chat responses
```

### Email Service
```typescript
// services/emailService.ts
- sendAppointmentConfirmationEmail() - Send booking confirmations
- Beautiful HTML email templates with appointment details
- Automatic error handling and logging
```

---

## 🎯 User Roles

### Patient
- Book and manage appointments
- Access AI health services
- View medical records
- Manage medications
- Telemedicine consultations

### Doctor
- View patient appointments
- Manage availability
- Access patient information
- Update profile and fees
- Conduct virtual consultations

---

## 🚦 Getting Started (Quick)

```bash
# Install dependencies
bun install

# Configure environment
cp .env.example .env
# Add your API keys to .env

# Start development
bun run dev

# Build for production
bun run build

# Preview production build
bun run preview
```

---

## 📱 Features by Page

| Page | Features |
|------|----------|
| **Home** | Hero section, feature highlights, doctor showcase, testimonials |
| **Doctors** | Browse doctors, filter by specialty, view profiles, book appointments |
| **Booking** | Select doctor, choose date/time, fill patient details, confirm |
| **My Appointments** | View all appointments, cancel, reschedule, status tracking |
| **AI Health Assistant** | Chat with Aura, get health advice, 24/7 support |
| **Symptom Analyzer** | Input symptoms, AI analysis, doctor recommendations |
| **Health Insights** | Upload health data, get AI-powered insights |
| **Medication Reminders** | Add medications, set reminders, drug interaction checks |
| **Telemedicine** | Video consultations, file sharing, chat |
| **Account** | Profile management, wallet, settings |

---

## 🔧 Configuration

### Tailwind CSS
- Custom color scheme with primary/accent colors
- Dark mode support with `next-themes`
- Custom animations and transitions
- Typography plugin for rich content

### ESLint
- TypeScript strict rules
- React hooks linting
- Consistent code style enforcement

### Vite
- Fast HMR (Hot Module Replacement)
- Optimized production builds
- Environment variable support

---

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## 🙏 Acknowledgments

- **shadcn/ui** - Beautiful component library
- **Supabase** - Amazing backend platform
- **Groq** - Fast AI inference
- **Radix UI** - Accessible components
- **Tailwind CSS** - Utility-first CSS framework

---

## 📞 Support

For support, email support@mediconnect.com or join our Slack channel.

---

## 🗺️ Roadmap

- [x] Email notifications for appointments
- [x] AI-powered health assistant
- [x] Symptom analyzer
- [x] Medication reminders
- [ ] SMS notifications
- [ ] Mobile app (React Native)
- [ ] Video consultation recording
- [ ] AI prescription validation
- [ ] Integration with pharmacy services
- [ ] Health insurance verification
- [ ] Multi-language support
- [ ] Wearable device integration
- [ ] Advanced analytics dashboard
- [ ] Appointment reminder emails (24 hours before)

---

## 💡 Tips for Developers

### AI Services Setup
See `SETUP_AI_SERVICES.md` for detailed AI configuration instructions.

### Database Migrations
All migrations are in `supabase/migrations/`. Run them in order.

### Testing
- Use sample doctors data for development
- Test both light and dark modes
- Verify responsive design on mobile

### Common Issues
- **AI not working**: Check GROQ API key in `.env`
- **Database errors**: Verify Supabase connection
- **Build fails**: Clear `node_modules` and reinstall
- **Emails not sending**: 
  - Verify `RESEND_API_KEY` is set in Supabase secrets
  - Check Edge Function logs in Supabase dashboard
  - Ensure `resendmail` function is deployed
  - Test with: `supabase functions invoke resendmail --body '{"to":"test@example.com",...}'`

---

**Built with ❤️ by the MediConnect Team**

*Making healthcare accessible through technology*
