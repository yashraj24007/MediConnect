import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { MessageCircle, Send, X, AlertCircle, Heart, Brain, Calendar, Pill, Activity, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import { AIMedicalService, AIResponse, AIFeatureType } from "@/services/aiMedicalService";
import { GroqChatService, ChatMessage } from "@/services/groqService";

interface Message {
  id: string;
  content: string;
  isBot: boolean;
  timestamp: Date;
  type?: AIFeatureType;
  actionButtons?: Array<{
    label: string;
    action: string;
    variant?: 'primary' | 'secondary' | 'outline';
  }>;
}

interface QuickAction {
  icon: React.ReactNode;
  label: string;
  prompt: string;
  type: AIFeatureType;
}

export const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content: "Hello! I'm Aura, your AI health assistant powered by advanced AI. I can help you with:\n\n🩺 **Symptom Analysis** - Describe your symptoms for guidance\n💊 **Medication Info** - General medication questions\n📅 **Appointment Booking** - Find the right specialist\n🧠 **Mental Health** - Stress and wellness support\n💪 **Health Advice** - Nutrition, exercise, and lifestyle tips\n\nHow can I assist you today? Remember, I'm here to guide you, but always consult healthcare professionals for medical advice.",
      isBot: true,
      timestamp: new Date(),
      type: 'general-chat'
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [conversationHistory, setConversationHistory] = useState<ChatMessage[]>([]);
  const [apiKeyConfigured, setApiKeyConfigured] = useState<boolean | null>(null);
  const [showQuickActions, setShowQuickActions] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const quickActions: QuickAction[] = [
    {
      icon: <Heart className="w-4 h-4" />,
      label: "Analyze Symptoms",
      prompt: "I'm experiencing some symptoms and would like guidance on what they might indicate.",
      type: 'symptom-analysis'
    },
    {
      icon: <Calendar className="w-4 h-4" />,
      label: "Book Appointment",
      prompt: "I need help finding the right type of doctor for my health concern.",
      type: 'appointment-booking'
    },
    {
      icon: <Pill className="w-4 h-4" />,
      label: "Medication Info",
      prompt: "I have questions about medications and their effects.",
      type: 'medication-info'
    },
    {
      icon: <Brain className="w-4 h-4" />,
      label: "Mental Health",
      prompt: "I could use some guidance on managing stress and mental wellness.",
      type: 'mental-health'
    },
    {
      icon: <Activity className="w-4 h-4" />,
      label: "Health Tips",
      prompt: "I'd like advice on maintaining a healthy lifestyle.",
      type: 'health-advice'
    }
  ];

  // Check if API key is configured on component mount
  useEffect(() => {
    const checkApiKey = async () => {
      const configured = await GroqChatService.isApiKeyConfigured();
      setApiKeyConfigured(configured);
    };
    checkApiKey();
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (message?: string) => {
    const messageToSend = message || inputValue.trim();
    if (!messageToSend) return;

    // Check if API key is configured
    if (!apiKeyConfigured) {
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "⚠️ AI service is not configured. Please add your Groq API key to the .env file to enable AI chat functionality.",
        isBot: true,
        timestamp: new Date(),
        type: 'general-chat'
      };
      setMessages(prev => [...prev, botMessage]);
      return;
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      content: messageToSend,
      isBot: false,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    if (!message) setInputValue(""); // Only clear input if it's from text input
    setIsLoading(true);
    setShowQuickActions(false); // Hide quick actions after first interaction

    try {
      // Use the enhanced AI Medical Service
      const aiResponse: AIResponse = await AIMedicalService.processUserMessage(
        messageToSend, 
        conversationHistory
      );

      // Update conversation history
      const newHistory: ChatMessage[] = [
        ...conversationHistory,
        { role: 'user', content: messageToSend },
        { role: 'assistant', content: aiResponse.content }
      ];
      
      // Keep only last 10 messages to manage context length
      setConversationHistory(newHistory.slice(-10));

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: aiResponse.content,
        isBot: true,
        timestamp: new Date(),
        type: aiResponse.type,
        actionButtons: aiResponse.actionButtons
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Chat error:', error);
      
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "I'm sorry, I'm experiencing technical difficulties. Please try again or contact our support team.",
        isBot: true,
        timestamp: new Date(),
        type: 'general-chat'
      };
      
      setMessages(prev => [...prev, botMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickAction = (action: QuickAction) => {
    handleSendMessage(action.prompt);
  };

  const handleActionButton = (action: string) => {
    switch (action) {
      case 'book-appointment':
        navigate('/booking');
        setIsOpen(false);
        break;
      case 'find-doctors':
        navigate('/doctors');
        setIsOpen(false);
        break;
      case 'find-specialists':
        navigate('/doctors');
        setIsOpen(false);
        break;
      case 'find-pharmacy':
        handleSendMessage("Can you help me find information about pharmacies and medication services?");
        break;
      case 'consult-doctor':
        navigate('/booking');
        setIsOpen(false);
        break;
      case 'find-counselor':
        handleSendMessage("I'd like to find mental health professionals and counseling services.");
        break;
      case 'mental-health-resources':
        handleSendMessage("Can you provide me with mental health resources and coping strategies?");
        break;
      case 'health-tips':
        handleSendMessage("I'd like some general health and wellness tips for maintaining good health.");
        break;
      case 'nutrition-guide':
        handleSendMessage("Can you provide guidance on nutrition and healthy eating habits?");
        break;
      case 'emergency-guide':
        handleSendMessage("What should I do in case of a medical emergency? Please provide emergency guidelines.");
        break;
      case 'browse-services':
        navigate('/');
        setIsOpen(false);
        break;
      case 'retry':
        // Retry last user message
        const lastUserMessage = messages.filter(m => !m.isBot).pop();
        if (lastUserMessage) {
          handleSendMessage(lastUserMessage.content);
        }
        break;
      case 'support':
        handleSendMessage("I need to contact customer support for technical assistance.");
        break;
      default:
        console.log('Unknown action:', action);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleSendClick = () => {
    handleSendMessage();
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Chat Window */}
      {isOpen && (
        <div className="absolute bottom-20 right-0 w-80 md:w-96 bg-card/95 backdrop-blur-lg rounded-xl shadow-2xl border border-border flex flex-col h-[600px]">
          {/* Header */}
          <div className="bg-gradient-to-r from-primary via-primary/90 to-accent text-primary-foreground p-4 rounded-t-xl flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-primary-foreground/20 rounded-full flex items-center justify-center">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-display font-bold text-lg">Aura</h3>
                <p className="text-xs opacity-90 font-body">AI Health Assistant</p>
              </div>
              {!apiKeyConfigured && (
                <AlertCircle className="w-4 h-4 text-yellow-300" />
              )}
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(false)}
              className="text-primary-foreground hover:bg-primary-foreground/20 transition-colors"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Quick Actions */}
          {showQuickActions && messages.length === 1 && (
            <div className="p-4 border-b border-pastel-purple/10 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-slate-800 dark:to-slate-700 dark:border-slate-600/20">
              <p className="text-sm font-body text-muted-foreground dark:text-slate-300 mb-3">Quick Actions:</p>
              <div className="grid grid-cols-2 gap-2">
                {quickActions.map((action, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    onClick={() => handleQuickAction(action)}
                    className="h-auto p-2 flex flex-col items-center gap-1 border-pastel-purple/20 hover:bg-pastel-purple/10 hover:border-pastel-purple/40 dark:border-slate-600/30 dark:hover:bg-slate-700/50 dark:hover:border-slate-500/50 transition-all"
                  >
                    <div className="text-pastel-purple dark:text-blue-400">{action.icon}</div>
                    <span className="text-xs font-body text-center leading-tight dark:text-slate-300">{action.label}</span>
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Messages */}
          <div className="flex-1 p-4 overflow-y-auto custom-scrollbar space-y-4">
            {messages.map((message) => (
              <div key={message.id} className="space-y-2">
                <div
                  className={cn(
                    "flex",
                    message.isBot ? "justify-start" : "justify-end"
                  )}
                >
                  <div
                    className={cn(
                      "max-w-xs p-3 rounded-lg font-body text-sm",
                      message.isBot
                        ? "bg-gradient-to-br from-muted to-card text-foreground border border-border"
                        : "bg-gradient-to-br from-primary to-accent text-primary-foreground shadow-lg"
                    )}
                  >
                    {message.type && message.isBot && (
                      <div className="flex items-center gap-2 mb-2 pb-2 border-b border-border">
                        <Badge variant="secondary" className="text-xs bg-primary/10 text-primary border-0">
                          {message.type.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                        </Badge>
                      </div>
                    )}
                    <div className="whitespace-pre-wrap">{message.content}</div>
                  </div>
                </div>
                
                {/* Action Buttons */}
                {message.actionButtons && message.actionButtons.length > 0 && (
                  <div className="flex flex-wrap gap-2 justify-start ml-2">
                    {message.actionButtons.map((button, index) => (
                      <Button
                        key={index}
                        variant={
                          button.variant === 'primary' ? 'default' : 
                          button.variant === 'secondary' ? 'secondary' : 
                          'outline'
                        }
                        size="sm"
                        onClick={() => handleActionButton(button.action)}
                        className={cn(
                          "text-xs font-body",
                          button.variant === 'primary' && "bg-pastel-purple hover:bg-pastel-purple/90 text-white dark:bg-blue-600 dark:hover:bg-blue-700 border-0",
                          button.variant === 'secondary' && "bg-pastel-blue hover:bg-pastel-blue/90 text-white dark:bg-purple-600 dark:hover:bg-purple-700 border-0",
                          (button.variant === 'outline' || !button.variant) && "border-pastel-purple/30 text-pastel-purple hover:bg-pastel-purple/10 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700/50"
                        )}
                      >
                        {button.label}
                      </Button>
                    ))}
                  </div>
                )}
              </div>
            ))}
            
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gradient-to-br from-slate-100 to-slate-50 dark:from-slate-700 dark:to-slate-600 border border-slate-200 dark:border-slate-600 p-3 rounded-lg">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-pastel-purple dark:bg-blue-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-pastel-pink dark:bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
                    <div className="w-2 h-2 bg-pastel-blue dark:bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t border-border bg-card/50 rounded-b-xl">
            <div className="flex space-x-2">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Ask about symptoms, health advice, or book appointments..."
                className="flex-1 border-border focus:border-primary focus:ring-primary/20 font-body"
                disabled={isLoading}
              />
              <Button
                onClick={handleSendClick}
                size="icon"
                disabled={!inputValue.trim() || isLoading}
                className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-primary-foreground shadow-lg"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
            {messages.length > 1 && (
              <p className="text-xs text-muted-foreground mt-2 font-body text-center">
                💡 Tip: Click action buttons below messages for quick actions
              </p>
            )}
          </div>
        </div>
      )}

      {/* Toggle Button */}
      <Button
        onClick={() => setIsOpen(!isOpen)}
        size="icon"
        className="w-16 h-16 rounded-full bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white shadow-2xl hover:shadow-primary/30 transition-all duration-300 border-2 border-white/20 hover:border-white/40 dark:border-slate-700/40 dark:hover:border-slate-600/60 backdrop-blur-sm group relative overflow-hidden hover:scale-110"
      >
        <div className="relative z-10 transition-transform duration-300">
          <MessageCircle className="w-8 h-8" />
          {!isOpen && (
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-400 rounded-full animate-bounce border-2 border-white dark:border-slate-800 shadow-lg"></div>
          )}
        </div>
        
        {/* Enhanced animated background rings */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-primary/30 to-accent/30 animate-ping opacity-60 group-hover:opacity-90"></div>
        <div className="absolute inset-1 rounded-full bg-gradient-to-r from-primary/20 to-accent/20 animate-pulse"></div>
        <div className="absolute inset-2 rounded-full bg-gradient-to-r from-primary/10 to-accent/10 animate-pulse"></div>
        
        {/* Enhanced tooltip */}
        <div className="absolute bottom-full right-0 mb-3 px-4 py-2 bg-background/95 backdrop-blur-md text-foreground text-sm font-medium rounded-xl shadow-xl border border-border/50 opacity-0 group-hover:opacity-100 transition-all duration-300 whitespace-nowrap transform translate-y-2 group-hover:translate-y-0">
          💬 Chat with Aura AI
          <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-background/95"></div>
        </div>
      </Button>
    </div>
  );
};