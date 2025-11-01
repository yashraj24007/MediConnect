import { Mail, Bell } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function EmailNotificationBanner() {
  return (
    <Card className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 border-blue-200 dark:border-blue-800 mb-6">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0">
            <div className="bg-blue-500 rounded-full p-2">
              <Mail className="w-5 h-5 text-white" />
            </div>
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-blue-900 dark:text-blue-100 flex items-center gap-2">
              <Bell className="w-4 h-4" />
              Email Notifications Enabled
            </h3>
            <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
              You'll receive a confirmation email with all appointment details after booking. 
              Please check your inbox and spam folder.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
