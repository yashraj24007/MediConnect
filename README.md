#  MediConnect

**Your Health, Your Doctor, One Click Away**

MediConnect is a comprehensive healthcare platform that connects patients with healthcare providers, enabling seamless appointment booking, health consultations, and medical record management.

##  Features

###  Authentication & User Management
- **Multi-role Authentication**: Support for patients and doctors
- **Profile Management**: Complete user profiles with medical history
- **Secure Login/Signup**: Email-based authentication with role selection
- **Guest Access**: Browse features without registration

###  Doctor Features
- **Doctor Dashboard**: Comprehensive dashboard for managing practice
- **Appointment Management**: View and manage patient appointments
- **Profile Management**: Professional profiles with specializations
- **Patient Records**: Access to patient information and history

###  Patient Features
- **Appointment Booking**: Easy-to-use booking system with doctor selection
- **My Appointments**: View and manage upcoming appointments
- **Health Records**: Personal health information management
- **File Sharing**: Secure document sharing with healthcare providers

###  AI-Powered Healthcare Assistant
- **AI Chatbot (Aura)**: Intelligent health assistant powered by Groq AI
- **Symptom Analysis**: AI-driven preliminary symptom assessment
- **Health Advice**: Personalized health recommendations
- **Appointment Suggestions**: Smart doctor recommendations based on symptoms
- **Mental Health Support**: Stress and wellness guidance

###  Healthcare Directory
- **Doctor Directory**: Browse doctors by specialty, location, and ratings
- **Hospital Listings**: Comprehensive hospital information
- **Specialty Search**: Find healthcare providers by medical specialty
- **Ratings & Reviews**: Patient feedback and ratings

###  Modern UI/UX
- **Dark/Light Theme**: Toggle between themes for user preference
- **Responsive Design**: Optimized for desktop, tablet, and mobile
- **Modern Components**: Built with shadcn/ui for consistent design
- **Smooth Animations**: Enhanced user experience with Tailwind CSS

##  Technology Stack

### Frontend
- **React 18** - Modern React with TypeScript
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and development server
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - Modern component library
- **Lucide React** - Beautiful icons
- **React Router** - Client-side routing
- **React Hook Form** - Form management
- **Zod** - Schema validation

### Backend & Database
- **Supabase** - Backend-as-a-Service
- **PostgreSQL** - Relational database
- **Row Level Security** - Secure data access
- **Real-time subscriptions** - Live data updates

### AI Integration
- **Groq API** - Fast AI inference
- **Multiple LLM Models** - Llama, Gemma support
- **Medical AI Prompting** - Specialized healthcare AI responses

##  Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Groq API key (for AI features)

### Installation

1. **Clone the repository**
   `ash
   git clone https://github.com/yashraj24007/MediConnect.git
   cd MediConnect
   `

2. **Install dependencies**
   `ash
   npm install
   `

3. **Environment Setup**
   `ash
   cp .env.example .env
   `
   
   Update the .env file with your Groq API key:
   `env
   VITE_GROQ_API_KEY=your_groq_api_key_here
   `
   
   > **Get your free Groq API key**: [https://console.groq.com/keys](https://console.groq.com/keys)

4. **Start the development server**
   `ash
   npm run dev
   `

5. **Open your browser**
   Navigate to http://localhost:5173

### Building for Production

`ash
npm run build
`

The built files will be in the dist directory.

##  Usage

### For Patients
1. **Sign Up** as a patient
2. **Complete your profile** with health information
3. **Browse doctors** by specialty or location
4. **Book appointments** with your preferred healthcare providers
5. **Chat with AI assistant** for health guidance
6. **Manage appointments** in your dashboard

### For Doctors
1. **Sign Up** as a healthcare provider
2. **Complete professional profile** with credentials
3. **Manage patient appointments** through the dashboard
4. **Access patient information** securely
5. **Update availability** and consultation fees

##  Configuration

### Database Schema
The application uses Supabase with the following main tables:
- profiles - User profiles (patients & doctors)
- patients - Patient-specific information
- doctors - Doctor credentials and specializations
- ppointments - Appointment bookings
- hospitals - Healthcare facility information

### Environment Variables
- VITE_GROQ_API_KEY - Required for AI chatbot functionality
- VITE_SUPABASE_URL - Supabase project URL (pre-configured)
- VITE_SUPABASE_PUBLISHABLE_KEY - Supabase public key (pre-configured)

##  Contributing

1. Fork the repository
2. Create your feature branch (git checkout -b feature/AmazingFeature)
3. Commit your changes (git commit -m 'Add some AmazingFeature')
4. Push to the branch (git push origin feature/AmazingFeature)
5. Open a Pull Request

##  License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

##  Acknowledgments

- **Supabase** - For providing the backend infrastructure
- **Groq** - For fast AI inference capabilities
- **shadcn/ui** - For the beautiful component library
- **Tailwind CSS** - For the utility-first styling approach

##  Support

For support, email yashraj24007@gmail.com or create an issue in this repository.

---

**Made with  for better healthcare accessibility**
