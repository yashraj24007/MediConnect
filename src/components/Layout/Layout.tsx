import { Header } from "./Header";
import { Footer } from "./Footer";
import { ChatWidget } from "@/components/Chat/ChatWidget";
import { DevelopmentBanner } from "@/components/DevelopmentBanner";

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col">
      <DevelopmentBanner />
      <Header />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
      <ChatWidget />
    </div>
  );
};