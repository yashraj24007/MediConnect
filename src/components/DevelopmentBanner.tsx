import { AlertCircle } from "lucide-react";

export const DevelopmentBanner = () => {
  return (
    <div className="bg-gradient-to-r from-primary via-primary/90 to-accent dark:from-primary dark:via-primary/80 dark:to-accent text-white py-2.5 px-4 shadow-lg border-b-2 border-primary/50 dark:border-accent/50">
      <div className="container mx-auto flex items-center justify-center gap-3 text-sm md:text-base">
        <AlertCircle className="w-5 h-5 animate-pulse flex-shrink-0" />
        <p className="font-semibold text-center">
          🚀 <span className="animate-pulse">✨</span> Website Under Development 🛠️ - Some features may not work as expected. Thank you for your patience! 💙
        </p>
      </div>
    </div>
  );
};
