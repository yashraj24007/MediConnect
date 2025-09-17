import Groq from 'groq-sdk';

// Initialize Groq client
const groq = new Groq({
  apiKey: import.meta.env.VITE_GROQ_API_KEY,
  dangerouslyAllowBrowser: true // Note: In production, this should be handled on the server
});

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export class GroqChatService {
  private static readonly SYSTEM_PROMPT = `You are a helpful AI assistant for MediConnect, a medical platform that helps users find doctors, hospitals, and medical services. 

Guidelines:
- You can provide general health information and guidance
- Always remind users that you're not a replacement for professional medical advice
- For serious medical concerns, recommend consulting with a healthcare professional
- You can help with finding doctors, booking appointments, and general health questions
- Be empathetic and supportive
- Keep responses concise and helpful
- If asked about specific medical conditions, provide general information but always recommend consulting a doctor

Your role is to assist users with their healthcare journey through the MediConnect platform.`;

  static async sendMessage(userMessage: string, conversationHistory: ChatMessage[] = []): Promise<string> {
    try {
      // Prepare messages with system prompt and conversation history
      const messages: ChatMessage[] = [
        { role: 'system', content: this.SYSTEM_PROMPT },
        ...conversationHistory,
        { role: 'user', content: userMessage }
      ];

      const chatCompletion = await groq.chat.completions.create({
        messages,
        model: 'llama-3.1-70b-versatile', // Using Llama 3.1 70B for better responses
        temperature: 0.7,
        max_tokens: 500,
        top_p: 0.9,
      });

      const response = chatCompletion.choices[0]?.message?.content;
      
      if (!response) {
        throw new Error('No response received from Groq API');
      }

      return response;
    } catch (error) {
      console.error('Groq API error:', error);
      
      // Fallback response
      return "I apologize, but I'm experiencing technical difficulties right now. Please try again in a moment, or contact our support team if the issue persists.";
    }
  }

  static async isApiKeyConfigured(): Promise<boolean> {
    const apiKey = import.meta.env.VITE_GROQ_API_KEY;
    return apiKey && apiKey !== 'your_groq_api_key_here';
  }
}