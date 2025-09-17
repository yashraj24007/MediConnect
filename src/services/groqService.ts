// Using fetch API directly for better browser compatibility
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export class GroqChatService {
  private static readonly SYSTEM_PROMPT = `You are Aura, a helpful AI health assistant for MediConnect, a medical platform that helps users find doctors, hospitals, and medical services. 

Guidelines:
- You can provide general health information and guidance
- Always remind users that you're not a replacement for professional medical advice
- For serious medical concerns, recommend consulting with a healthcare professional
- You can help with finding doctors, booking appointments, and general health questions
- Be empathetic and supportive
- Keep responses concise and helpful
- If asked about specific medical conditions, provide general information but always recommend consulting a doctor
- Your name is Aura and you're here to assist with healthcare journeys

Your role is to assist users with their healthcare journey through the MediConnect platform.`;

  private static readonly AVAILABLE_MODELS = [
    'llama-3.1-8b-instant',
    'llama-3.1-70b-versatile', 
    'llama3-8b-8192',
    'gemma-7b-it',
    'gemma2-9b-it'
  ];

  private static async makeAPICall(apiKey: string, messages: ChatMessage[], modelIndex: number = 0): Promise<any> {
    if (modelIndex >= this.AVAILABLE_MODELS.length) {
      throw new Error('All models failed');
    }

    const model = this.AVAILABLE_MODELS[modelIndex];
    console.log(`Trying model: ${model} (attempt ${modelIndex + 1})`);

    const requestBody = {
      model: model,
      messages: messages,
      temperature: 0.7,
      max_tokens: 500,
      stream: false,
    };

    console.log('Request body:', JSON.stringify(requestBody, null, 2));

    const response = await fetch(GROQ_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    console.log(`Model ${model} response status:`, response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Model ${model} error response:`, errorText);
      
      // Parse error to check if model is decommissioned
      try {
        const errorData = JSON.parse(errorText);
        if (errorData.error?.code === 'model_decommissioned') {
          console.log(`Model ${model} is decommissioned, trying next model...`);
          if (modelIndex < this.AVAILABLE_MODELS.length - 1) {
            return this.makeAPICall(apiKey, messages, modelIndex + 1);
          }
        }
      } catch (e) {
        // Error text is not JSON, continue with normal error handling
      }
      
      // If it's a 400 error or model issue, try the next model
      if ((response.status === 400 || response.status === 404) && modelIndex < this.AVAILABLE_MODELS.length - 1) {
        return this.makeAPICall(apiKey, messages, modelIndex + 1);
      }
      
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }

    return response.json();
  }

  static async sendMessage(userMessage: string, conversationHistory: ChatMessage[] = []): Promise<string> {
    try {
      // Check if API key is properly configured
      const apiKey = import.meta.env.VITE_GROQ_API_KEY;
      console.log('API Key configured:', !!apiKey, apiKey ? `${apiKey.substring(0, 8)}...` : 'None');
      
      if (!apiKey || apiKey === 'your_groq_api_key_here') {
        throw new Error('Groq API key is not properly configured');
      }

      // Prepare messages with system prompt and conversation history
      const messages: ChatMessage[] = [
        { role: 'system', content: this.SYSTEM_PROMPT },
        ...conversationHistory,
        { role: 'user', content: userMessage }
      ];

      console.log('Sending request to Groq with messages:', messages.length);

      const data = await this.makeAPICall(apiKey, messages);
      console.log('Groq response received:', data);

      const aiResponse = data.choices?.[0]?.message?.content;
      
      if (!aiResponse) {
        throw new Error('No response received from Groq API');
      }

      return aiResponse;
    } catch (error) {
      console.error('Groq API error details:', {
        error,
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined
      });
      
      // Return more specific error messages based on error type
      if (error instanceof Error) {
        if (error.message.includes('API key')) {
          return "❌ API key configuration issue. Please check your Groq API key in the .env file.";
        }
        if (error.message.includes('fetch') || error.message.includes('network')) {
          return "🌐 Network connectivity issue. Please check your internet connection and try again.";
        }
        if (error.message.includes('unauthorized') || error.message.includes('401')) {
          return "🔐 Authentication failed. Please verify your Groq API key is valid.";
        }
        if (error.message.includes('rate limit') || error.message.includes('429')) {
          return "⏱️ Rate limit exceeded. Please wait a moment and try again.";
        }
        if (error.message.includes('400')) {
          return "📝 Request format issue. Please try rephrasing your message.";
        }
        if (error.message.includes('All models failed')) {
          return "🔧 All available models failed. The Groq service might be temporarily unavailable.";
        }
      }
      
      // Fallback response
      return "I apologize, but I'm experiencing technical difficulties right now. Please check the browser console for more details, or contact our support team if the issue persists.";
    }
  }

  static async isApiKeyConfigured(): Promise<boolean> {
    const apiKey = import.meta.env.VITE_GROQ_API_KEY;
    return apiKey && apiKey !== 'your_groq_api_key_here';
  }

  // Get available models from Groq API
  static async getAvailableModels(): Promise<string[]> {
    try {
      const apiKey = import.meta.env.VITE_GROQ_API_KEY;
      if (!apiKey) return this.AVAILABLE_MODELS;

      const response = await fetch('https://api.groq.com/openai/v1/models', {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        const models = data.data?.map((model: any) => model.id) || [];
        console.log('Available models from API:', models);
        return models.length > 0 ? models : this.AVAILABLE_MODELS;
      }
    } catch (error) {
      console.error('Failed to fetch available models:', error);
    }
    
    return this.AVAILABLE_MODELS;
  }

  // Test method to validate API connection
  static async testConnection(): Promise<{ success: boolean; message: string }> {
    try {
      const apiKey = import.meta.env.VITE_GROQ_API_KEY;
      
      if (!apiKey || apiKey === 'your_groq_api_key_here') {
        return { success: false, message: 'API key not configured' };
      }

      // First, let's see what models are available
      const availableModels = await this.getAvailableModels();
      console.log('Testing with available models:', availableModels);

      const testMessages = [{ role: 'user' as const, content: 'Hello, just testing the connection. Please respond with "Connection successful!"' }];
      const data = await this.makeAPICall(apiKey, testMessages);
      
      const aiResponse = data.choices?.[0]?.message?.content;
      
      if (aiResponse) {
        return { success: true, message: `API connection successful! Response: ${aiResponse}` };
      } else {
        return { success: false, message: 'No response received from API' };
      }
    } catch (error) {
      console.error('Connection test error:', error);
      return { 
        success: false, 
        message: `Connection failed: ${error instanceof Error ? error.message : 'Unknown error'}` 
      };
    }
  }

  // Test all models to see which ones work
  static async testAllModels(): Promise<{ workingModels: string[]; failedModels: string[] }> {
    const apiKey = import.meta.env.VITE_GROQ_API_KEY;
    if (!apiKey) return { workingModels: [], failedModels: [] };

    const workingModels: string[] = [];
    const failedModels: string[] = [];
    const availableModels = await this.getAvailableModels();

    for (const model of availableModels) {
      try {
        console.log(`Testing model: ${model}`);
        const response = await fetch(GROQ_API_URL, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: model,
            messages: [{ role: 'user', content: 'test' }],
            max_tokens: 10,
          }),
        });

        if (response.ok) {
          workingModels.push(model);
          console.log(`✅ Model ${model} works`);
        } else {
          const errorText = await response.text();
          failedModels.push(model);
          console.log(`❌ Model ${model} failed:`, errorText);
        }
      } catch (error) {
        failedModels.push(model);
        console.log(`❌ Model ${model} error:`, error);
      }
    }

    console.log('Working models:', workingModels);
    console.log('Failed models:', failedModels);
    return { workingModels, failedModels };
  }
}