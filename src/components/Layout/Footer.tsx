import { Facebook, Linkedin } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="hero-gradient text-primary-foreground">
      <div className="container mx-auto px-4 lg:px-6 py-12">
        <div className="grid md:grid-cols-3 gap-8 text-center md:text-left">
          <div>
            <h4 className="text-lg font-bold mb-4">Opening Hours</h4>
            <ul className="text-primary-foreground/80 space-y-2">
              <li>Monday - Friday: 9am - 6pm</li>
              <li>Saturday: 10am - 4pm</li>
              <li>Sunday: Closed</li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-bold mb-4">Accepted Insurance</h4>
            <div className="grid grid-cols-2 gap-2 text-primary-foreground/80">
              <span>Star Health Insurance</span>
              <span>HDFC ERGO Health Insurance</span>
              <span>ICICI Lombard Health Insurance</span>
              <span>Care Health Insurance</span>
            </div>
          </div>
          
          <div>
            <h4 className="text-lg font-bold mb-4">Follow Us</h4>
            <div className="flex justify-center md:justify-start space-x-4 mt-2">
              <a href="#" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                <Facebook className="w-6 h-6" />
              </a>
              <a href="#" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                <Linkedin className="w-6 h-6" />
              </a>
            </div>
          </div>
        </div>
        
        <div className="border-t border-primary-foreground/20 mt-8 pt-6 text-center text-primary-foreground/60 text-sm">
          <p>&copy; 2025 MediConnect. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
};