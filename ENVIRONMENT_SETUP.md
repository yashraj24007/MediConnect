# Environment Setup

## Required Environment Variables

The application requires a `.env` file in the root directory with the following variables:

### 1. Supabase (Already Configured)
The Supabase connection is already configured in the application, but these variables are available for reference:
```
VITE_SUPABASE_PROJECT_ID=zezrhlilrafxwqmslubo
VITE_SUPABASE_PUBLISHABLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InplenJobGlscmFmeHdxbXNsdWJvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTczODUzMDksImV4cCI6MjA3Mjk2MTMwOX0.wSn4pG0Q4JU4lZSTsIY5n6-kl8M9NQ79D08iM2zkMJ8
VITE_SUPABASE_URL=https://zezrhlilrafxwqmslubo.supabase.co
```

### 2. Groq API Key (Required for AI Chat)
To enable the AI chatbot feature, you need to:

1. Go to [Groq Console](https://console.groq.com/keys)
2. Sign up for a free account
3. Generate an API key
4. Add it to your `.env` file:

```
VITE_GROQ_API_KEY=your_actual_groq_api_key_here
```

**Without the Groq API key, the AI chatbot will not function.**

## Setup Instructions

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Update the `VITE_GROQ_API_KEY` in `.env` with your actual Groq API key

3. Restart the development server:
   ```bash
   npm run dev
   ```

## Features Requiring Environment Variables

- **AI Chatbot**: Requires `VITE_GROQ_API_KEY`
- **Database & Authentication**: Uses hardcoded Supabase configuration (already working)