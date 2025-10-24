import { AlertCircle, X } from "lucide-react";
import { useState, useEffect } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

export const ApiKeyBanner = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    // Check if API key is configured
    const apiKey = import.meta.env.VITE_GROQ_API_KEY;
    const isConfigured = apiKey && apiKey !== 'your_groq_api_key_here';
    
    // Check if user has dismissed the banner in this session
    const dismissed = sessionStorage.getItem('apiKeyBannerDismissed') === 'true';
    
    setIsVisible(!isConfigured && !dismissed);
  }, []);

  const handleDismiss = () => {
    setIsDismissed(true);
    setIsVisible(false);
    sessionStorage.setItem('apiKeyBannerDismissed', 'true');
  };

  if (!isVisible || isDismissed) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-md">
      <Alert variant="destructive" className="shadow-lg border-2">
        <AlertCircle className="h-5 w-5" />
        <AlertTitle className="flex items-center justify-between">
          AI Services Not Configured
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 -mr-2"
            onClick={handleDismiss}
          >
            <X className="h-4 w-4" />
          </Button>
        </AlertTitle>
        <AlertDescription className="text-sm">
          <p className="mb-2">
            Add your <strong>Groq API key</strong> to enable AI features:
          </p>
          <ol className="list-decimal list-inside space-y-1 text-xs">
            <li>Get free key at <a href="https://console.groq.com/keys" target="_blank" rel="noopener noreferrer" className="underline font-semibold">console.groq.com/keys</a></li>
            <li>Add to <code className="bg-black/20 px-1 rounded">.env</code> file</li>
            <li>Restart dev server</li>
          </ol>
          <p className="mt-2 text-xs opacity-90">
            See <code className="bg-black/20 px-1 rounded">SETUP_AI_SERVICES.md</code> for detailed instructions
          </p>
        </AlertDescription>
      </Alert>
    </div>
  );
};
