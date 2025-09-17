# Groq API Integration Setup

## Getting Your Groq API Key

1. Visit [Groq Console](https://console.groq.com/)
2. Sign up or log in to your account
3. Navigate to API Keys section
4. Create a new API key
5. Copy the generated API key

## Configuration

1. Open the `.env` file in your project root
2. Replace `your_groq_api_key_here` with your actual Groq API key:
   ```
   VITE_GROQ_API_KEY="gsk_your_actual_api_key_here"
   ```
3. Save the file and restart your development server

## Features

- **AI-Powered Chat**: Uses Groq's Llama 3.1 70B model for intelligent responses
- **Medical Context**: Trained to assist with health-related queries while emphasizing the need for professional medical advice
- **Conversation History**: Maintains context for better conversations
- **Error Handling**: Graceful fallback when API is unavailable
- **Visual Indicators**: Shows warning icon when API key is not configured

## Usage

The chatbot appears as a floating button in the bottom-right corner of your application. Click it to open the chat interface and start conversations with the AI assistant.

## Security Note

Currently configured for development with `dangerouslyAllowBrowser: true`. For production deployment, consider implementing a backend proxy to handle API calls securely.