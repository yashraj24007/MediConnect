# AI Integration Setup Guide

## Overview
The MediConnect platform now includes a comprehensive AI health assistant named "Aura" that integrates multiple medical AI features into a single chatbot interface.

## Features Integrated

### 🩺 **Symptom Analysis**
- Users can describe symptoms and get AI-powered guidance
- Provides potential condition assessments with confidence levels
- Offers urgency classification (low/medium/high/emergency)
- Suggests appropriate next steps and specialist recommendations

### 💊 **Medication Information**
- General medication guidance and information
- Side effect awareness
- Interaction warnings (general)
- Pharmacy location assistance

### 📅 **Smart Appointment Booking**
- Determines appropriate medical specialties
- Assesses appointment urgency
- Guides users to the right type of healthcare provider
- Integrates with existing booking system

### 🧠 **Mental Health Support**
- Stress management guidance
- Emotional wellness strategies
- Mental health resource recommendations
- Crisis intervention awareness

### 💪 **Health & Wellness Advice**
- Nutrition guidance
- Exercise recommendations
- Preventive care suggestions
- Lifestyle modification tips

## Technical Architecture

### AI Service Layer (`aiMedicalService.ts`)
- **Feature Detection**: Automatically detects the type of query (symptom analysis, appointment booking, etc.)
- **Specialized Prompts**: Different system prompts for different medical contexts
- **Response Processing**: Structures AI responses with actionable buttons
- **Safety Measures**: Always emphasizes professional medical consultation

### Enhanced ChatBot (`ChatWidget.tsx`)
- **Quick Actions**: Preset buttons for common medical queries
- **Contextual UI**: Different styling based on query type
- **Action Buttons**: Direct integration with booking system and other features
- **Professional Design**: Medical-grade UI with pastel color scheme

### Integration Points
- **Home Page**: Promotes the AI assistant instead of standalone symptom checker
- **Booking System**: Direct links from AI recommendations
- **Navigation**: Seamless flow between AI advice and platform features

## Setup Instructions

### 1. Environment Configuration
Create a `.env` file in the root directory with:
```bash
# Groq API Configuration (Required for AI features)
VITE_GROQ_API_KEY="your_groq_api_key_here"

# Supabase Configuration (Already configured)
VITE_SUPABASE_PROJECT_ID="your_supabase_project_id"
VITE_SUPABASE_PUBLISHABLE_KEY="your_supabase_publishable_key"
VITE_SUPABASE_URL="your_supabase_url"
```

### 2. Get Groq API Key
1. Visit [Groq Console](https://console.groq.com/)
2. Create an account or sign in
3. Navigate to API Keys section
4. Generate a new API key
5. Copy the key to your `.env` file

### 3. Test the Integration
1. Start the development server: `npm run dev`
2. Open the application in browser
3. Click the floating chat button (bottom right)
4. Try different types of queries:
   - "I have a headache and fever"
   - "I need to book an appointment with a cardiologist"
   - "Can you give me nutrition advice?"
   - "I'm feeling stressed and anxious"

## Usage Examples

### Symptom Analysis
**User**: "I have chest pain and shortness of breath"
**AI Response**: Emergency guidance with immediate action recommendations

### Appointment Booking
**User**: "I need to see a skin doctor"
**AI Response**: Dermatologist recommendation with booking button

### Health Advice
**User**: "What's a good diet for heart health?"
**AI Response**: Nutrition guidelines with actionable tips

### Mental Health
**User**: "I'm feeling very stressed lately"
**AI Response**: Stress management techniques with counselor recommendations

## Safety Features

- **Medical Disclaimers**: Every response includes appropriate medical disclaimers
- **Emergency Detection**: Recognizes emergency keywords and prioritizes urgent care
- **Professional Referrals**: Always recommends consulting healthcare professionals
- **Context Awareness**: Maintains conversation context for better assistance

## Benefits

1. **Unified Experience**: All AI features in one interface
2. **Contextual Help**: Right assistance at the right time
3. **Seamless Integration**: Direct connections to booking and services
4. **Professional Quality**: Medical-grade AI responses and UI
5. **24/7 Availability**: Always available for health guidance

## Future Enhancements

- **Voice Input**: Speech-to-text for accessibility
- **Medical History Integration**: Personalized responses based on user history
- **Multilingual Support**: Support for multiple languages
- **Advanced Analytics**: Health trend analysis and insights
- **Telemedicine Integration**: Direct video consultation booking

The AI integration transforms MediConnect from a booking platform into a comprehensive health assistant that guides users through their entire healthcare journey.