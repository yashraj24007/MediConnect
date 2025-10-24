# 🏥 MediConnect#  MediConnect



**Your Health, Your Doctor, One Click Away****Your Health, Your Doctor, One Click Away**



MediConnect is a comprehensive AI-powered healthcare platform that connects patients with healthcare providers, enabling seamless appointment booking, intelligent health consultations, and secure medical record management.MediConnect is a comprehensive healthcare platform that connects patients with healthcare providers, enabling seamless appointment booking, health consultations, and medical record management.



🌐 **Live Demo**: [https://mediconnect-drab.vercel.app](https://mediconnect-drab.vercel.app)##  Features



---###  Authentication & User Management

- **Multi-role Authentication**: Support for patients and doctors

## ✨ Key Features- **Profile Management**: Complete user profiles with medical history

- **Secure Login/Signup**: Email-based authentication with role selection

### 🔐 Authentication & User Management- **Guest Access**: Browse features without registration

- **Multi-role Authentication**: Separate portals for patients and doctors

- **Secure Profile Management**: Complete user profiles with medical history###  Doctor Features

- **Role-based Access Control**: Protected routes with proper authorization- **Doctor Dashboard**: Comprehensive dashboard for managing practice

- **Email Authentication**: Powered by Supabase Auth- **Appointment Management**: View and manage patient appointments

- **Profile Management**: Professional profiles with specializations

### 👨‍⚕️ Doctor Portal- **Patient Records**: Access to patient information and history

- **Comprehensive Dashboard**: Manage appointments, patients, and schedule

- **Patient Management**: View patient records and consultation history###  Patient Features

- **Schedule Management**: Set availability and manage time slots- **Appointment Booking**: Easy-to-use booking system with doctor selection

- **Consultation Tracking**: Track completed and pending consultations- **My Appointments**: View and manage upcoming appointments

- **Profile Customization**: Specialty, fees, experience, and bio management- **Health Records**: Personal health information management

- **File Sharing**: Secure document sharing with healthcare providers

### 👤 Patient Portal

- **Smart Appointment Booking**: Book appointments with preferred doctors###  AI-Powered Healthcare Assistant

- **My Appointments**: View and manage upcoming consultations- **AI Chatbot (Aura)**: Intelligent health assistant powered by Groq AI

- **Health Dashboard**: Personal health information and vitals tracking- **Symptom Analysis**: AI-driven preliminary symptom assessment

- **Medical Records**: Secure file sharing with healthcare providers- **Health Advice**: Personalized health recommendations

- **Payment Integration**: Razorpay payment gateway for consultations- **Appointment Suggestions**: Smart doctor recommendations based on symptoms

- **Mental Health Support**: Stress and wellness guidance

### 🤖 AI-Powered Features

###  Healthcare Directory

#### 1. **AI Health Assistant (Aura)** 🩺- **Doctor Directory**: Browse doctors by specialty, location, and ratings

- 24/7 intelligent health companion- **Hospital Listings**: Comprehensive hospital information

- Real-time medical guidance powered by Groq AI- **Specialty Search**: Find healthcare providers by medical specialty

- Multi-model support (Llama 3.1, Mixtral, Gemma 2)- **Ratings & Reviews**: Patient feedback and ratings

- Contextual health conversations

- **Route**: `/ai/health-assistant`###  Modern UI/UX

- **Dark/Light Theme**: Toggle between themes for user preference

#### 2. **Symptom Analyzer** 🔍- **Responsive Design**: Optimized for desktop, tablet, and mobile

- AI-driven preliminary symptom assessment- **Modern Components**: Built with shadcn/ui for consistent design

- Urgency level detection (low/medium/high/emergency)- **Smooth Animations**: Enhanced user experience with Tailwind CSS

- Condition predictions with confidence levels

- Specialist recommendations##  Technology Stack

- **Route**: `/ai/symptom-analyzer`

### Frontend

#### 3. **Smart Appointment Booking** 📅- **React 18** - Modern React with TypeScript

- AI-powered doctor matching based on symptoms- **TypeScript** - Type-safe development

- Intelligent scheduling suggestions- **Vite** - Fast build tool and development server

- Specialty-based recommendations- **Tailwind CSS** - Utility-first CSS framework

- **Route**: `/ai/smart-booking`- **shadcn/ui** - Modern component library

- **Lucide React** - Beautiful icons

#### 4. **Health Insights Dashboard** 📊- **React Router** - Client-side routing

- Personalized health analytics- **React Hook Form** - Form management

- Wellness tracking and recommendations- **Zod** - Schema validation

- Health trend visualization

- Preventive care suggestions### Backend & Database

- **Route**: `/ai/health-insights`- **Supabase** - Backend-as-a-Service

- **PostgreSQL** - Relational database

#### 5. **Medication Reminders** 💊- **Row Level Security** - Secure data access

- AI-powered medication tracking- **Real-time subscriptions** - Live data updates

- Automated reminders and alerts

- Dosage management### AI Integration

- Treatment adherence monitoring- **Groq API** - Fast AI inference

- **Route**: `/ai/medication-reminders`- **Multiple LLM Models** - Llama, Gemma support

- **Medical AI Prompting** - Specialized healthcare AI responses

### 🏥 Healthcare Directory

- **Doctor Directory**: 25+ doctors across specialties in Hyderabad##  Getting Started

- **Hospital Listings**: 13 top-rated hospitals

- **Advanced Filters**: Search by specialty, location, fees### Prerequisites

- **Detailed Profiles**: Doctor credentials, experience, ratings- Node.js 18+ 

- **Hospital Information**: Services, facilities, emergency availability- npm or yarn

- Groq API key (for AI features)

### 🎨 Modern UI/UX

- **Dark/Light Theme**: Seamless theme switching with persistence### Installation

- **Fully Responsive**: Optimized for desktop, tablet, and mobile

- **Modern Components**: Built with shadcn/ui component library1. **Clone the repository**

- **Smooth Animations**: Enhanced UX with Tailwind CSS transitions   `ash

- **Accessibility**: WCAG compliant with keyboard navigation   git clone https://github.com/yashraj24007/MediConnect.git

- **Creative Design**: Emojis and Lucide React icons throughout   cd MediConnect

   `

### 🔒 Security & Privacy

- **Row Level Security (RLS)**: Database-level access control2. **Install dependencies**

- **Protected Routes**: Role-based route protection   `ash

- **Secure Authentication**: Email verification and secure sessions   npm install

- **HIPAA-Ready**: Privacy-focused design for medical data   `

- **Unauthorized Access Handling**: Custom error pages

3. **Environment Setup**

---   `ash

   cp .env.example .env

## 🛠️ Technology Stack   `

   

### Frontend   Update the .env file with your Groq API key:

- **React 18** - Modern React with Hooks and Context API   `env

- **TypeScript** - Type-safe development   VITE_GROQ_API_KEY=your_groq_api_key_here

- **Vite** - Lightning-fast build tool and HMR   `

- **Tailwind CSS** - Utility-first CSS framework   

- **shadcn/ui** - High-quality React components   > **Get your free Groq API key**: [https://console.groq.com/keys](https://console.groq.com/keys)

- **Lucide React** - Beautiful, consistent icons (500+ icons)

- **React Router v6** - Client-side routing with hash navigation4. **Start the development server**

- **React Hook Form** - Performant form handling   `ash

- **Zod** - TypeScript-first schema validation   npm run dev

- **Sonner** - Toast notifications   `



### Backend & Database5. **Open your browser**

- **Supabase** - Backend-as-a-Service platform   Navigate to http://localhost:5173

- **PostgreSQL** - Powerful relational database

- **Row Level Security** - Fine-grained access control### Building for Production

- **Real-time Subscriptions** - Live data updates

- **Edge Functions** - Serverless functions for AI chat`ash

npm run build

### AI & Machine Learning`

- **Groq API** - Ultra-fast AI inference (500+ tokens/sec)

- **Llama 3.1 70B** - Primary medical AI modelThe built files will be in the dist directory.

- **Mixtral 8x7B** - Alternative AI model

- **Gemma 2 9B** - Lightweight AI model##  Usage

- **Custom Medical Prompts** - Specialized healthcare responses

### For Patients

### Payment Integration1. **Sign Up** as a patient

- **Razorpay** - Secure payment gateway2. **Complete your profile** with health information

- **Test Mode** - Safe testing environment3. **Browse doctors** by specialty or location

- **Order Management** - Transaction tracking4. **Book appointments** with your preferred healthcare providers

- **Payment Verification** - Secure payment confirmation5. **Chat with AI assistant** for health guidance

6. **Manage appointments** in your dashboard

### Deployment

- **Vercel** - Frontend hosting with automatic deployments### For Doctors

- **Supabase Cloud** - Database and backend hosting1. **Sign Up** as a healthcare provider

- **Environment Variables** - Secure configuration management2. **Complete professional profile** with credentials

- **CI/CD** - GitHub integration for auto-deployment3. **Manage patient appointments** through the dashboard

4. **Access patient information** securely

---5. **Update availability** and consultation fees



## 🚀 Getting Started##  Configuration



### Prerequisites### Database Schema

- **Node.js** 18+ or **Bun**The application uses Supabase with the following main tables:

- **npm**, **yarn**, or **bun** package manager- profiles - User profiles (patients & doctors)

- **Groq API key** (for AI features) - [Get free key](https://console.groq.com/keys)- patients - Patient-specific information

- **Supabase account** (for backend) - [Sign up](https://supabase.com)- doctors - Doctor credentials and specializations

- ppointments - Appointment bookings

### Installation- hospitals - Healthcare facility information



1. **Clone the repository**### Environment Variables

   ```bash- VITE_GROQ_API_KEY - Required for AI chatbot functionality

   git clone https://github.com/yashraj24007/MediConnect.git- VITE_SUPABASE_URL - Supabase project URL (pre-configured)

   cd MediConnect- VITE_SUPABASE_PUBLISHABLE_KEY - Supabase public key (pre-configured)

   ```

##  Contributing

2. **Install dependencies**

   ```bash1. Fork the repository

   npm install2. Create your feature branch (git checkout -b feature/AmazingFeature)

   # or3. Commit your changes (git commit -m 'Add some AmazingFeature')

   bun install4. Push to the branch (git push origin feature/AmazingFeature)

   ```5. Open a Pull Request



3. **Environment Setup**##  License

   

   Create a `.env` file in the root directory:This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

   ```env

   # Supabase Configuration##  Acknowledgments

   VITE_SUPABASE_URL=your_supabase_project_url

   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key- **Supabase** - For providing the backend infrastructure

- **Groq** - For fast AI inference capabilities

   # Groq AI Configuration- **shadcn/ui** - For the beautiful component library

   VITE_GROQ_API_KEY=your_groq_api_key- **Tailwind CSS** - For the utility-first styling approach



   # Razorpay Configuration (Optional - for payments)##  Support

   VITE_RAZORPAY_KEY_ID=your_razorpay_test_key

   VITE_RAZORPAY_KEY_SECRET=your_razorpay_secretFor support, email yashraj24007@gmail.com or create an issue in this repository.

   ```

---

   **Get your API keys**:

   - **Groq API**: [https://console.groq.com/keys](https://console.groq.com/keys)**Made with  for better healthcare accessibility**

   - **Supabase**: [https://supabase.com/dashboard](https://supabase.com/dashboard) → Your Project → Settings → API
   - **Razorpay**: [https://dashboard.razorpay.com](https://dashboard.razorpay.com) → Account & Settings → API Keys

4. **Run Database Migrations**
   ```bash
   # Navigate to your Supabase project dashboard
   # Go to SQL Editor and run the migration files in supabase/migrations/
   ```

5. **Start the development server**
   ```bash
   npm run dev
   # or
   bun dev
   ```

6. **Open your browser**
   
   Navigate to [http://localhost:5173](http://localhost:5173)

### Building for Production

```bash
npm run build
# or
bun run build
```

The built files will be in the `dist/` directory.

---

## 📱 Usage Guide

### For Patients

1. **Sign Up**
   - Click "Get Started" or "Login"
   - Select "Patient" role
   - Enter email and password
   - Complete profile with health information

2. **Explore AI Features**
   - **AI Health Assistant**: Click chat icon (bottom right) or visit `/ai/health-assistant`
   - **Symptom Checker**: Analyze symptoms at `/ai/symptom-analyzer`
   - **Health Insights**: View personalized analytics at `/ai/health-insights`
   - **Medication Reminders**: Set up reminders at `/ai/medication-reminders`

3. **Book Appointments**
   - Browse doctors by specialty/location
   - Select a doctor and view profile
   - Choose date and time
   - Complete booking (payment integration ready)

4. **Manage Health**
   - View appointments in "My Appointments"
   - Upload medical records in "File Share"
   - Track health metrics in "Health Dashboard"

### For Doctors

1. **Sign Up**
   - Register with "Doctor" role
   - Complete professional profile
   - Set consultation fees and specialization

2. **Manage Practice**
   - Access dashboard at `/doctor`
   - View patient appointments
   - Update schedule and availability
   - Manage patient records

3. **Dashboard Features**
   - **Appointments**: View today's schedule
   - **Patients**: Access patient information
   - **Schedule**: Manage time slots
   - **Consultations**: Track consultation history
   - **Profile**: Update credentials and fees

---

## 🗂️ Project Structure

```
MediConnect/
├── public/                    # Static assets
│   ├── favicon.ico
│   ├── placeholder.svg
│   └── robots.txt
├── src/
│   ├── assets/               # Images and media
│   ├── components/           # React components
│   │   ├── Chat/            # Chat widget
│   │   ├── Gallery/         # Image gallery
│   │   ├── Layout/          # Header, Footer, Layout
│   │   └── ui/              # shadcn/ui components
│   ├── data/                # Static data
│   │   ├── doctors.ts       # Doctor profiles
│   │   └── hospitals.ts     # Hospital information
│   ├── hooks/               # Custom React hooks
│   ├── integrations/        # External integrations
│   │   └── supabase/       # Supabase client
│   ├── lib/                 # Utilities
│   ├── pages/               # Page components
│   │   ├── AI services/    # AI feature pages
│   │   ├── Patient pages/  # Patient portal
│   │   └── Doctor pages/   # Doctor portal
│   ├── services/            # API services
│   ├── App.tsx             # Main app component
│   └── main.tsx            # Entry point
├── supabase/
│   ├── functions/          # Edge functions
│   └── migrations/         # Database migrations
├── .env                    # Environment variables
├── package.json           # Dependencies
├── tailwind.config.ts     # Tailwind configuration
└── vite.config.ts         # Vite configuration
```

---

## 🌐 AI Service Routes

All AI services are fully functional and accessible:

| Service | Route | Description | Status |
|---------|-------|-------------|--------|
| **AI Health Assistant (Aura)** | `/ai/health-assistant` | 24/7 AI medical chatbot | ✅ Working |
| **Symptom Analyzer** | `/ai/symptom-analyzer` | Symptom assessment tool | ✅ Working |
| **Smart Booking** | `/ai/smart-booking` | AI-powered appointment booking | ✅ Working |
| **Health Insights** | `/ai/health-insights` | Health analytics dashboard | ✅ Working |
| **Medication Reminders** | `/ai/medication-reminders` | Medication tracking | ✅ Working |

**Chat Widget**: Available on all pages (bottom-right corner) for instant AI health assistance.

---

## 🔧 Configuration

### Database Schema

Main Supabase tables:
- **profiles** - User profiles (patients & doctors)
- **patients** - Patient-specific information
- **doctors** - Doctor credentials and specializations
- **appointments** - Appointment bookings
- **hospitals** - Healthcare facility information
- **payments** - Payment transactions (Razorpay integration)

### Test Accounts

**Patient Account**:
- Email: `yashraj24007@gmail.com`
- Password: `12345678`

**Doctor Account**:
- Email: `yashraj240307@gmail.com`
- Password: `12345678`

---

## 🤝 Contributing

We welcome contributions! Here's how:

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/AmazingFeature
   ```
3. **Commit your changes**
   ```bash
   git commit -m 'Add some AmazingFeature'
   ```
4. **Push to the branch**
   ```bash
   git push origin feature/AmazingFeature
   ```
5. **Open a Pull Request**

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **Supabase** - For providing the backend infrastructure
- **Groq** - For ultra-fast AI inference capabilities
- **shadcn/ui** - For the beautiful component library
- **Tailwind CSS** - For the utility-first styling approach
- **Lucide** - For the amazing icon library
- **Vercel** - For seamless deployment and hosting
- **Razorpay** - For secure payment processing

---

## 📧 Support & Contact

- **Email**: yashraj24007@gmail.com
- **GitHub Issues**: [Create an issue](https://github.com/yashraj24007/MediConnect/issues)
- **Live Demo**: [https://mediconnect-drab.vercel.app](https://mediconnect-drab.vercel.app)

---

## 🎯 Roadmap

- [ ] Real-time video consultations (Telemedicine)
- [ ] Mobile app (React Native)
- [ ] Multi-language support
- [ ] Lab test booking integration
- [ ] Prescription management system
- [ ] Health insurance integration
- [ ] Wearable device integration
- [ ] Emergency SOS feature

---

**Made with ❤️ for better healthcare accessibility**

© 2025 MediConnect. All rights reserved.
