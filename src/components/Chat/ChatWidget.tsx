import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MessageCircle, Send, X, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { GroqChatService, ChatMessage } from "@/services/groqService";

interface Message {
  id: string;
  content: string;
  isBot: boolean;
  timestamp: Date;
}

export const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content: "Hello! I'm Aura, your AI health assistant powered by Groq. How can I help you today? Please note, I'm an AI assistant and not a medical professional.",
      isBot: true,
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [conversationHistory, setConversationHistory] = useState<ChatMessage[]>([]);
  const [apiKeyConfigured, setApiKeyConfigured] = useState<boolean | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

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

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    // Check if API key is configured
    if (!apiKeyConfigured) {
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "⚠️ Groq API key is not configured. Please add your Groq API key to the .env file to enable AI chat functionality.",
        isBot: true,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, botMessage]);
      return;
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      isBot: false,
      timestamp: new Date(),
    };

    const messageContent = inputValue;
    setMessages(prev => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    try {
      // Get response from Groq
      const response = await GroqChatService.sendMessage(messageContent, conversationHistory);

      // Update conversation history
      const newHistory: ChatMessage[] = [
        ...conversationHistory,
        { role: 'user', content: messageContent },
        { role: 'assistant', content: response }
      ];
      
      // Keep only last 10 messages to manage context length
      setConversationHistory(newHistory.slice(-10));

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: response,
        isBot: true,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Chat error:', error);
      
      // Fallback response
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "I'm sorry, I'm experiencing technical difficulties. Please try again or contact our support team.",
        isBot: true,
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, botMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Chat Window */}
      {isOpen && (
        <div className="absolute bottom-20 right-0 w-80 md:w-96 bg-card rounded-lg shadow-elevated border border-border flex flex-col h-[500px]">
          {/* Header */}
          <div className="hero-gradient text-primary-foreground p-4 rounded-t-lg flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <h3 className="font-bold text-lg">Aura - AI Health Assistant</h3>
              {!apiKeyConfigured && (
                <AlertCircle className="w-4 h-4 text-yellow-300" />
              )}
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(false)}
              className="text-primary-foreground hover:bg-white/20"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Messages */}
          <div className="flex-1 p-4 overflow-y-auto custom-scrollbar space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  "flex",
                  message.isBot ? "justify-start" : "justify-end"
                )}
              >
                <div
                  className={cn(
                    "max-w-xs p-3 rounded-lg",
                    message.isBot
                      ? "bg-muted text-muted-foreground"
                      : "bg-primary text-primary-foreground"
                  )}
                >
                  <p className="text-sm">{message.content}</p>
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-muted p-3 rounded-lg">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t border-border">
            <div className="flex space-x-2">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Ask a question..."
                className="flex-1"
                disabled={isLoading}
              />
              <Button
                onClick={handleSendMessage}
                size="icon"
                disabled={!inputValue.trim() || isLoading}
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Toggle Button */}
      <Button
        onClick={() => setIsOpen(!isOpen)}
        size="icon"
        variant="accent"
        className="w-16 h-16 rounded-full shadow-accent hover:scale-110 transition-transform"
      >
        <MessageCircle className="w-8 h-8" />
      </Button>
    </div>
  );
};