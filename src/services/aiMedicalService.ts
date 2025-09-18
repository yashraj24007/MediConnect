import { GroqChatService, ChatMessage } from './groqService';

export interface SymptomAnalysis {
  condition: string;
  confidence: number;
  recommendations: string[];
  urgency: 'low' | 'medium' | 'high' | 'emergency';
  nextSteps: string[];
}

export interface HealthAdvice {
  category: 'nutrition' | 'exercise' | 'mental-health' | 'general' | 'medication';
  advice: string;
  tips: string[];
  warnings?: string[];
}

export interface AppointmentSuggestion {
  specialty: string;
  reason: string;
  urgency: 'routine' | 'soon' | 'urgent';
  timeframe: string;
}

export type AIFeatureType = 
  | 'symptom-analysis' 
  | 'health-advice' 
  | 'appointment-booking' 
  | 'medication-info'
  | 'nutrition-guidance'
  | 'exercise-planning'
  | 'mental-health'
  | 'general-chat';

export interface AIResponse {
  type: AIFeatureType;
  content: string;
  data?: SymptomAnalysis | HealthAdvice | AppointmentSuggestion | any;
  actionButtons?: Array<{
    label: string;
    action: string;
    variant?: 'primary' | 'secondary' | 'outline';
  }>;
}

export class AIMedicalService {
  private static readonly SYSTEM_PROMPTS = {
    'symptom-analysis': `You are Aura, an AI medical assistant specializing in symptom analysis for MediConnect. 

Analyze user symptoms and provide:
1. Potential conditions (with confidence levels)
2. Urgency assessment (low/medium/high/emergency)
3. Specific recommendations
4. Next steps including specialist suggestions

ALWAYS remind users this is not a medical diagnosis and to consult healthcare professionals.
Format responses with clear sections and bullet points.
If symptoms suggest emergency (chest pain, difficulty breathing, severe injury), immediately recommend emergency care.`,

    'health-advice': `You are Aura, providing general health and wellness advice for MediConnect users.

Provide evidence-based advice on:
- Nutrition and diet
- Exercise and fitness
- Preventive care
- Lifestyle modifications
- Mental wellness

Always emphasize consulting healthcare providers for personalized advice.
Provide actionable, practical tips.`,

    'appointment-booking': `You are Aura, helping users understand when and which type of doctor to see.

Help users determine:
- Which medical specialty they need
- Urgency of appointment
- What to prepare for the visit
- Questions to ask the doctor

Guide them to use MediConnect's booking system for scheduling.`,

    'medication-info': `You are Aura, providing general medication information for MediConnect users.

Provide general information about:
- Common medications and their uses
- General side effects to be aware of
- Importance of following prescriptions
- When to contact healthcare providers

NEVER provide specific dosing advice or contraindications.
Always recommend consulting pharmacists or doctors for specific medication questions.`,

    'mental-health': `You are Aura, providing supportive mental health guidance for MediConnect users.

Offer:
- General mental wellness strategies
- Stress management techniques
- When to seek professional help
- Resources and coping strategies

Be empathetic and supportive. Always recommend professional help for serious mental health concerns.`,

    'general-chat': `You are Aura, a friendly AI health assistant for MediConnect.

You can help with:
- General health questions
- Platform navigation
- Finding doctors and hospitals
- Health education
- Preventive care information

Be helpful, empathetic, and always prioritize user safety by recommending professional medical care when appropriate.`
  };

  static async processUserMessage(message: string, conversationHistory: ChatMessage[] = []): Promise<AIResponse> {
    const featureType = this.detectFeatureType(message);
    const systemPrompt = this.SYSTEM_PROMPTS[featureType];

    try {
      // Prepare messages with appropriate system prompt
      const messages: ChatMessage[] = [
        { role: 'system', content: systemPrompt },
        ...conversationHistory.slice(-8), // Keep last 8 messages for context
        { role: 'user', content: message }
      ];

      const response = await GroqChatService.sendMessage(message, messages);
      
      return {
        type: featureType,
        content: response,
        actionButtons: this.getActionButtons(featureType, message)
      };
    } catch (error) {
      console.error('AI Medical Service error:', error);
      return {
        type: 'general-chat',
        content: "I'm experiencing technical difficulties. Please try again or contact our support team.",
        actionButtons: [
          { label: "Try Again", action: "retry", variant: "primary" },
          { label: "Contact Support", action: "support", variant: "outline" }
        ]
      };
    }
  }

  private static detectFeatureType(message: string): AIFeatureType {
    const lowerMessage = message.toLowerCase();

    // Emergency keywords
    if (this.containsEmergencyKeywords(lowerMessage)) {
      return 'symptom-analysis';
    }

    // Symptom analysis keywords
    if (this.containsSymptomKeywords(lowerMessage)) {
      return 'symptom-analysis';
    }

    // Appointment booking keywords
    if (this.containsAppointmentKeywords(lowerMessage)) {
      return 'appointment-booking';
    }

    // Medication keywords
    if (this.containsMedicationKeywords(lowerMessage)) {
      return 'medication-info';
    }

    // Nutrition keywords
    if (this.containsNutritionKeywords(lowerMessage)) {
      return 'health-advice';
    }

    // Exercise keywords
    if (this.containsExerciseKeywords(lowerMessage)) {
      return 'health-advice';
    }

    // Mental health keywords
    if (this.containsMentalHealthKeywords(lowerMessage)) {
      return 'mental-health';
    }

    return 'general-chat';
  }

  private static containsEmergencyKeywords(message: string): boolean {
    const emergencyKeywords = [
      'chest pain', 'can\'t breathe', 'difficulty breathing', 'severe pain',
      'unconscious', 'bleeding heavily', 'broken bone', 'severe injury',
      'heart attack', 'stroke', 'emergency', 'urgent', 'severe allergic reaction'
    ];
    return emergencyKeywords.some(keyword => message.includes(keyword));
  }

  private static containsSymptomKeywords(message: string): boolean {
    const symptomKeywords = [
      'pain', 'ache', 'hurt', 'fever', 'headache', 'nausea', 'vomiting',
      'diarrhea', 'constipation', 'rash', 'swelling', 'cough', 'cold',
      'flu', 'sore throat', 'fatigue', 'tired', 'dizzy', 'symptoms',
      'feeling sick', 'not well', 'illness', 'infection'
    ];
    return symptomKeywords.some(keyword => message.includes(keyword));
  }

  private static containsAppointmentKeywords(message: string): boolean {
    const appointmentKeywords = [
      'appointment', 'book', 'schedule', 'doctor', 'specialist',
      'cardiologist', 'dermatologist', 'neurologist', 'pediatrician',
      'gynecologist', 'orthopedic', 'psychiatrist', 'see a doctor',
      'need a doctor', 'find a doctor'
    ];
    return appointmentKeywords.some(keyword => message.includes(keyword));
  }

  private static containsMedicationKeywords(message: string): boolean {
    const medicationKeywords = [
      'medication', 'medicine', 'pill', 'tablet', 'capsule', 'drug',
      'prescription', 'dosage', 'side effect', 'interaction', 'pharmacy'
    ];
    return medicationKeywords.some(keyword => message.includes(keyword));
  }

  private static containsNutritionKeywords(message: string): boolean {
    const nutritionKeywords = [
      'diet', 'nutrition', 'food', 'eating', 'weight', 'calories',
      'vitamin', 'supplement', 'healthy eating', 'meal plan'
    ];
    return nutritionKeywords.some(keyword => message.includes(keyword));
  }

  private static containsExerciseKeywords(message: string): boolean {
    const exerciseKeywords = [
      'exercise', 'workout', 'fitness', 'gym', 'running', 'walking',
      'physical activity', 'training', 'sports', 'yoga'
    ];
    return exerciseKeywords.some(keyword => message.includes(keyword));
  }

  private static containsMentalHealthKeywords(message: string): boolean {
    const mentalHealthKeywords = [
      'stress', 'anxiety', 'depression', 'mental health', 'mood',
      'sad', 'worried', 'panic', 'therapy', 'counseling', 'emotional'
    ];
    return mentalHealthKeywords.some(keyword => message.includes(keyword));
  }

  private static getActionButtons(type: AIFeatureType, message: string): Array<{
    label: string;
    action: string;
    variant?: 'primary' | 'secondary' | 'outline';
  }> {
    switch (type) {
      case 'symptom-analysis':
        return [
          { label: "Book Appointment", action: "book-appointment", variant: "primary" },
          { label: "Find Specialists", action: "find-specialists", variant: "outline" },
          { label: "Emergency Guide", action: "emergency-guide", variant: "secondary" }
        ];
      
      case 'appointment-booking':
        return [
          { label: "Book Now", action: "book-appointment", variant: "primary" },
          { label: "Find Doctors", action: "find-doctors", variant: "outline" }
        ];
      
      case 'medication-info':
        return [
          { label: "Find Pharmacy", action: "find-pharmacy", variant: "outline" },
          { label: "Consult Doctor", action: "consult-doctor", variant: "primary" }
        ];
      
      case 'health-advice':
        return [
          { label: "Health Tips", action: "health-tips", variant: "outline" },
          { label: "Nutrition Guide", action: "nutrition-guide", variant: "secondary" }
        ];
      
      case 'mental-health':
        return [
          { label: "Find Counselor", action: "find-counselor", variant: "primary" },
          { label: "Mental Health Resources", action: "mental-health-resources", variant: "outline" }
        ];
      
      default:
        return [
          { label: "Book Appointment", action: "book-appointment", variant: "primary" },
          { label: "Browse Services", action: "browse-services", variant: "outline" }
        ];
    }
  }

  // Quick analysis methods for different features
  static async analyzeSymptoms(symptoms: string): Promise<SymptomAnalysis> {
    const prompt = `Analyze these symptoms: "${symptoms}"
    
Please provide a structured analysis including:
1. Potential conditions with confidence levels
2. Urgency assessment
3. Specific recommendations
4. Next steps
    
Remember to emphasize this is not a medical diagnosis.`;

    try {
      const response = await GroqChatService.sendMessage(prompt, []);
      
      // Parse the response to extract structured data
      // This is a simplified version - in a real app, you'd have more sophisticated parsing
      return {
        condition: "General assessment based on described symptoms",
        confidence: 0.7,
        recommendations: [
          "Consult with a healthcare professional for proper diagnosis",
          "Monitor symptoms and note any changes",
          "Consider booking an appointment through MediConnect"
        ],
        urgency: this.containsEmergencyKeywords(symptoms.toLowerCase()) ? 'emergency' : 'medium',
        nextSteps: [
          "Schedule an appointment with a general practitioner",
          "Prepare a list of all symptoms with timelines",
          "Bring any relevant medical history"
        ]
      };
    } catch (error) {
      console.error('Symptom analysis error:', error);
      throw error;
    }
  }

  static async getHealthAdvice(topic: string): Promise<HealthAdvice> {
    const prompt = `Provide health advice about: "${topic}"
    
Include practical tips and general recommendations while emphasizing the need for professional medical advice.`;

    try {
      const response = await GroqChatService.sendMessage(prompt, []);
      
      return {
        category: 'general',
        advice: response,
        tips: [
          "Maintain a balanced lifestyle",
          "Stay hydrated and eat nutritious foods",
          "Get regular exercise and adequate sleep",
          "Consult healthcare providers for personalized advice"
        ]
      };
    } catch (error) {
      console.error('Health advice error:', error);
      throw error;
    }
  }
}