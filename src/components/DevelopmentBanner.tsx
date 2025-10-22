import { AlertCircle } from "lucide-react";

export const DevelopmentBanner = () => {
  return (
    <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-amber-500 dark:from-amber-600 dark:via-orange-600 dark:to-amber-600 text-white py-2 px-4 shadow-md border-b border-orange-600 dark:border-orange-700">
      <div className="container mx-auto flex items-center justify-center gap-3 text-sm md:text-base">
        <AlertCircle className="w-5 h-5 animate-pulse flex-shrink-0" />
        <p className="font-semibold text-center">
          ⚠️ Website Under Development - Some features may not work as expected. Thank you for your patience!
        </p>
      </div>
    </div>
  );
};
