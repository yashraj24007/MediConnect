# 🤖 AI Services Setup Guide

## ⚠️ REQUIRED: Configure Groq API Key

All AI features in MediConnect require a **Groq API key** to function. Without this key, you'll see error messages when trying to use AI services.

---

## 🚀 Quick Setup (2 minutes)

### Step 1: Get Your Free Groq API Key

1. Go to **[Groq Console](https://console.groq.com/keys)**
2. Sign up or log in (free account, no credit card required)
3. Click **"Create API Key"**
4. Copy your API key (starts with `gsk_...`)

### Step 2: Add API Key to Your Project

1. Open the `.env` file in the root of your project
2. Find this line:
   ```env
   VITE_GROQ_API_KEY="your_groq_api_key_here"
   ```
3. Replace `your_groq_api_key_here` with your actual API key:
   ```env
   VITE_GROQ_API_KEY="gsk_YOUR_ACTUAL_KEY_HERE"
   ```
4. Save the file

### Step 3: Restart Development Server

```bash
# Stop the current server (Ctrl+C)
# Then restart:
npm run dev
```

---

## ✅ Verify It's Working

1. Go to **AI Services** → **Symptom Analyzer**
2. Click **"Analyze Symptoms Now"**
3. Enter a test symptom like "headache and fever"
4. Click **"Analyze Symptoms"**

✅ **Success**: You should see AI-generated analysis with urgency level, possible conditions, and recommendations

❌ **Error**: If you see "AI Service Not Configured", the API key is not set correctly

---

## 🎯 What AI Services Are Available?

### 1. **AI Health Assistant (Aura)** 🩺
- **Location**: Chat widget (bottom-right corner on all pages)
- **What it does**: 24/7 AI chatbot for health questions
- **How to use**: Click the chat icon and start typing

### 2. **Symptom Analyzer** 🔍
- **Route**: `/ai/symptom-analyzer`
- **What it does**: Analyzes symptoms and provides urgency assessment
- **How to use**: Describe symptoms → Get AI analysis with specialist recommendations

### 3. **Smart Booking** 📅
- **Route**: `/ai/smart-booking`
- **What it does**: Matches you with the right doctor based on your health concern
- **How to use**: Describe health issue → Get matched with top 3 specialists

### 4. **Health Insights** 📊
- **Route**: `/ai/health-insights`
- **What it does**: Analyzes your health data and provides personalized recommendations
- **How to use**: Share health info → Get overall score and category insights

### 5. **Medication Reminders** 💊
- **Route**: `/ai/medication-reminders`
- **What it does**: Tracks medications and checks for drug interactions
- **How to use**: Add medications → Click "Check Drug Interactions (AI)"

---

## 🔧 Troubleshooting

### Problem: "AI Service Not Configured" error

**Solution**: 
- Check that `.env` file has the API key
- Make sure the key is NOT in quotes inside quotes: `"gsk_..."` ✅ NOT `"'gsk_...'"`
- Restart your dev server after changing `.env`

### Problem: "Analysis Error" or "Matching Error"

**Possible causes**:
1. **API key invalid**: Get a new key from Groq Console
2. **Rate limit exceeded**: Wait a few minutes and try again
3. **Network issue**: Check your internet connection

### Problem: AI responses are slow

**Normal**: First request may take 2-5 seconds (Groq is initializing)
**Fast**: Subsequent requests should be < 1 second (Groq is very fast!)

### Problem: AI Health Assistant redirects to home

**This is correct behavior**: The AI Health Assistant page redirects you to the home page and opens the chat widget (bottom-right corner). Look for the blue chat icon at the bottom-right of the screen.

---

## 💡 Tips for Best Results

### For Symptom Analyzer:
✅ **Good**: "I've had a persistent headache for 3 days on the right side, worse in afternoons, with occasional nausea"
❌ **Bad**: "headache"

### For Smart Booking:
✅ **Good**: "I have chest pain and shortness of breath when climbing stairs"
❌ **Bad**: "heart problem"

### For Health Insights:
✅ **Good**: "35 years old, 75kg, exercise 3x/week, sleep 5-6 hours, BP 130/85, eat home-cooked meals"
❌ **Bad**: "healthy person"

---

## 📊 Groq Free Tier Limits

- ✅ **Free forever** (no credit card)
- ✅ **Fast inference** (500+ tokens/sec)
- ✅ **Multiple models** (Llama, Mixtral, Gemma)
- ⚠️ **Rate limits**: ~30 requests/minute (more than enough for testing)

---

## 🆘 Still Need Help?

1. Check browser console (F12 → Console) for error details
2. Verify API key is correct at [Groq Console](https://console.groq.com/keys)
3. Make sure you restarted the dev server after changing `.env`
4. Contact support: yashraj24007@gmail.com

---

**Once configured, all AI services will work seamlessly! 🎉**
