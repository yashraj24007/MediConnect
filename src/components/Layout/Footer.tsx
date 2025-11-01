import { Facebook, Linkedin, Twitter, Instagram, Youtube, Mail, Phone, MapPin, Heart } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const Footer = () => {
  return (
    <footer className="bg-slate-100 dark:bg-black text-slate-900 dark:text-slate-100 border-t border-slate-300 dark:border-slate-800">
      <div className="container mx-auto px-4 lg:px-6 py-8">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-6">
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center space-x-2 mb-3 group">
              <img 
                src="/logo.svg" 
                alt="MediConnect Logo" 
                className="w-10 h-10 group-hover:rotate-6 transition-transform duration-300"
              />
              <span className="text-xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
                MediConnect
              </span>
            </Link>
            <p className="text-slate-700 dark:text-slate-300 text-sm mb-3 leading-relaxed">
              Transforming healthcare with AI-powered consultations and seamless doctor-patient connections.
            </p>
            <div className="space-y-1.5 text-sm">
              <a href="mailto:support@mediconnect.com" className="flex items-center gap-2 text-slate-700 dark:text-slate-300 hover:text-primary transition-colors">
                <Mail className="w-4 h-4" />
                support@mediconnect.com
              </a>
              <a href="tel:+911234567890" className="flex items-center gap-2 text-slate-700 dark:text-slate-300 hover:text-primary transition-colors">
                <Phone className="w-4 h-4" />
                +91 123 456 7890
              </a>
              <div className="flex items-start gap-2 text-slate-700 dark:text-slate-300">
                <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>Hyderabad, Telangana, India</span>
              </div>
            </div>
          </div>

          {/* Services Section */}
          <div>
            <h4 className="text-base font-bold mb-3 text-slate-900 dark:text-foreground flex items-center gap-2">
              <span className="text-primary">Services</span>
            </h4>
            <ul className="space-y-1.5 text-sm">
              <li>
                <Link to="/booking" className="text-slate-700 dark:text-slate-300 hover:text-primary transition-colors hover:translate-x-1 inline-block">
                  Book Appointment
                </Link>
              </li>
              <li>
                <Link to="/my-appointments" className="text-slate-700 dark:text-slate-300 hover:text-primary transition-colors hover:translate-x-1 inline-block">
                  My Appointments
                </Link>
              </li>
              <li>
                <Link to="/doctors" className="text-slate-700 dark:text-slate-300 hover:text-primary transition-colors hover:translate-x-1 inline-block">
                  Find Doctors
                </Link>
              </li>
              <li>
                <Link to="/hospitals" className="text-slate-700 dark:text-slate-300 hover:text-primary transition-colors hover:translate-x-1 inline-block">
                  Find Hospitals
                </Link>
              </li>
              <li>
                <Link to="/patient-info" className="text-slate-700 dark:text-slate-300 hover:text-primary transition-colors hover:translate-x-1 inline-block">
                  Health Dashboard
                </Link>
              </li>
            </ul>
          </div>

          {/* AI Services Section */}
          <div>
            <h4 className="text-base font-bold mb-3 text-slate-900 dark:text-foreground flex items-center gap-2">
              <span className="text-accent">AI Services</span>
            </h4>
            <ul className="space-y-1.5 text-sm">
              <li>
                <Link to="/ai/health-assistant" className="text-slate-700 dark:text-slate-300 hover:text-accent transition-colors hover:translate-x-1 inline-block">
                  AI Health Assistant
                </Link>
              </li>
              <li>
                <Link to="/ai/symptom-analyzer" className="text-slate-700 dark:text-slate-300 hover:text-accent transition-colors hover:translate-x-1 inline-block">
                  Symptom Analyzer
                </Link>
              </li>
              <li>
                <Link to="/ai/health-insights" className="text-slate-700 dark:text-slate-300 hover:text-accent transition-colors hover:translate-x-1 inline-block">
                  Health Insights
                </Link>
              </li>
              <li>
                <Link to="/ai/medication-reminders" className="text-slate-700 dark:text-slate-300 hover:text-accent transition-colors hover:translate-x-1 inline-block">
                  Medication Reminders
                </Link>
              </li>
            </ul>
          </div>

          {/* For Doctors Section */}
          <div>
            <h4 className="text-base font-bold mb-3 text-slate-900 dark:text-foreground flex items-center gap-2">
              <span className="text-blue-400">For Doctors</span>
            </h4>
            <ul className="space-y-1.5 text-sm">
              <li>
                <Link to="/auth" className="text-slate-700 dark:text-slate-300 hover:text-blue-400 transition-colors hover:translate-x-1 inline-block">
                  Doctor Login
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-slate-700 dark:text-slate-300 hover:text-blue-400 transition-colors hover:translate-x-1 inline-block">
                  Join as Doctor
                </Link>
              </li>
              <li>
                <Link to="/doctor" className="text-slate-700 dark:text-slate-300 hover:text-blue-400 transition-colors hover:translate-x-1 inline-block">
                  Doctor Dashboard
                </Link>
              </li>
              <li>
                <Link to="/help" className="text-slate-700 dark:text-slate-300 hover:text-blue-400 transition-colors hover:translate-x-1 inline-block">
                  Support
                </Link>
              </li>
            </ul>
          </div>

          {/* Support Section */}
          <div>
            <h4 className="text-base font-bold mb-3 text-slate-900 dark:text-foreground flex items-center gap-2">
              <span className="text-orange-400">Support</span>
            </h4>
            <ul className="space-y-1.5 text-sm">
              <li>
                <Link to="/help" className="text-slate-700 dark:text-slate-300 hover:text-orange-400 transition-colors hover:translate-x-1 inline-block">
                  Help Center
                </Link>
              </li>
              <li>
                <Link to="/faqs" className="text-slate-700 dark:text-slate-300 hover:text-orange-400 transition-colors hover:translate-x-1 inline-block">
                  FAQs
                </Link>
              </li>
              <li>
                <Link to="/members" className="text-slate-700 dark:text-slate-300 hover:text-orange-400 transition-colors hover:translate-x-1 inline-block">
                  Community
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-slate-700 dark:text-slate-300 hover:text-orange-400 transition-colors hover:translate-x-1 inline-block">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-slate-700 dark:text-slate-300 hover:text-orange-400 transition-colors hover:translate-x-1 inline-block">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Newsletter Section - Compact */}
        <div className="bg-gradient-to-r from-primary/15 to-accent/15 dark:from-primary/10 dark:to-accent/10 rounded-xl p-5 mb-6 border border-primary/20 dark:border-primary/20">
          <div className="max-w-2xl mx-auto text-center">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Stay Connected</h3>
            <p className="text-slate-700 dark:text-slate-300 text-sm mb-4">
              Subscribe for health tips, medical updates, and exclusive offers
            </p>
            <div className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
              <Input 
                type="email" 
                placeholder="Enter your email" 
                className="bg-white dark:bg-white border border-border text-foreground placeholder:text-muted-foreground focus:border-primary h-9 text-sm"
              />
              <Button className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white font-semibold px-6 whitespace-nowrap h-9 text-sm">
                Subscribe
              </Button>
            </div>
          </div>
        </div>        {/* Social Links & Bottom Bar Combined */}
        <div className="flex flex-col items-center gap-4">
            <div className="flex justify-center gap-3">
            <a 
              href="#" 
              className="w-9 h-9 rounded-full bg-primary/10 border border-border flex items-center justify-center text-primary hover:text-white hover:bg-primary hover:border-primary transition-all duration-300 hover:scale-110"
              aria-label="Facebook"
            >
              <Facebook className="w-4 h-4" />
            </a>
            <a 
              href="#" 
              className="w-9 h-9 rounded-full bg-slate-700 dark:bg-slate-800 border border-slate-600 dark:border-slate-700 flex items-center justify-center text-slate-200 dark:text-slate-300 hover:text-white hover:bg-blue-400 hover:border-blue-400 transition-all duration-300 hover:scale-110"
              aria-label="Twitter"
            >
              <Twitter className="w-4 h-4" />
            </a>
            <a 
              href="#" 
              className="w-9 h-9 rounded-full bg-slate-700 dark:bg-slate-800 border border-slate-600 dark:border-slate-700 flex items-center justify-center text-slate-200 dark:text-slate-300 hover:text-white hover:bg-gradient-to-r hover:from-purple-500 hover:to-pink-500 hover:border-pink-500 transition-all duration-300 hover:scale-110"
              aria-label="Instagram"
            >
              <Instagram className="w-4 h-4" />
            </a>
            <a 
              href="#" 
              className="w-9 h-9 rounded-full bg-slate-700 dark:bg-slate-800 border border-slate-600 dark:border-slate-700 flex items-center justify-center text-slate-200 dark:text-slate-300 hover:text-white hover:bg-red-600 hover:border-red-600 transition-all duration-300 hover:scale-110"
              aria-label="Youtube"
            >
              <Youtube className="w-4 h-4" />
            </a>
            <a 
              href="#" 
              className="w-9 h-9 rounded-full bg-slate-700 dark:bg-slate-800 border border-slate-600 dark:border-slate-700 flex items-center justify-center text-slate-200 dark:text-slate-300 hover:text-white hover:bg-blue-700 hover:border-blue-700 transition-all duration-300 hover:scale-110"
              aria-label="LinkedIn"
            >
              <Linkedin className="w-4 h-4" />
            </a>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-slate-300 dark:border-slate-800 pt-4 w-full text-center">
            <p className="text-slate-700 dark:text-slate-300 text-sm flex items-center justify-center gap-2 flex-wrap">
              © 2025 MediConnect. All rights reserved. Built with 
              <Heart className="w-4 h-4 fill-red-500 text-red-500 animate-pulse" /> 
              for better healthcare accessibility.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};