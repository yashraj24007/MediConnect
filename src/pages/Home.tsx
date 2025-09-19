import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { MapPin, Phone, Mail, Stethoscope, Calendar, FileText, Sparkles, Clock, Send } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { AIMedicalService } from "@/services/aiMedicalService";
import heroImage from "@/assets/medical-hero.jpg";
import consultationImage from "@/assets/consultation-room.jpg";
import mapImage from "@/assets/clinic-hyderabad.jpg";
import { MedicalGallery } from "@/components/Gallery/MedicalGallery";

export default function Home() {
  const [symptomInput, setSymptomInput] = useState("");
  const [symptomResult, setSymptomResult] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  // Contact form state
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: ""
  });
  const [isSubmittingContact, setIsSubmittingContact] = useState(false);

  const services = [
    {
      title: "Medical Record Management",
      description: "Manage your health records effortlessly.",
      price: "Free",
      icon: FileText,
    },
    {
      title: "Appointment Scheduling", 
      description: "Book your appointments with ease.",
      price: "Free",
      icon: Calendar,
    },
    {
      title: "Doctor Consultation",
      description: "Get professional advice from our expert doctors.",
      price: "Free",
      icon: Stethoscope,
    },
  ];

  const handleSymptomCheck = async () => {
    if (!symptomInput.trim()) {
      toast.error("Please describe your symptoms.");
      return;
    }

    setIsLoading(true);
    try {
      // Use Groq AI service for dynamic symptom analysis
      const analysis = await AIMedicalService.analyzeSymptoms(symptomInput);
      
      // Format the AI response into a readable format
      const formattedResponse = `
### AI Health Assessment

**Assessment:** ${analysis.condition}

**Urgency Level:** ${analysis.urgency.charAt(0).toUpperCase() + analysis.urgency.slice(1)}

**Recommendations:**
${analysis.recommendations.map(rec => `• ${rec}`).join('\n')}

**Next Steps:**
${analysis.nextSteps?.map(step => `• ${step}`).join('\n') || '• Consult with a healthcare professional for proper diagnosis'}

---
*This is an AI-generated assessment based on your symptoms. Always consult with a qualified healthcare professional for accurate medical diagnosis and treatment.*
      `;
      
      setSymptomResult(formattedResponse);
      
      // Note: Analytics storage would be implemented when health_interactions table is created
      console.log('Symptom analysis completed for:', symptomInput);
      
    } catch (error) {
      console.error('Symptom analysis error:', error);
      
      // Fallback response if API fails
      const fallbackResponse = `
### Recommendation: Professional Consultation

I'm currently unable to analyze your symptoms using AI, but I can provide general guidance.

**Based on your input:** "${symptomInput}"

**General Recommendations:**
• Schedule a consultation with one of our qualified doctors
• Prepare a detailed list of your symptoms and when they started
• Note any factors that make symptoms better or worse
• Bring any relevant medical history or current medications

**Next Steps:**
• Book an appointment through our platform
• Consider the urgency of your symptoms
• Seek emergency care if symptoms are severe or worsening

---
*This is general guidance. Always consult with a healthcare professional for proper medical advice.*
      `;
      
      setSymptomResult(fallbackResponse);
      toast.error("AI analysis unavailable. Showing general guidance instead.");
    } finally {
      setIsLoading(false);
    }
  };

  const formatAIResponse = (text: string) => {
    return text
      .replace(/### (.*)/g, '<h3 class="text-lg font-semibold text-primary mt-4 mb-2">$1</h3>')
      .replace(/\*\* (.*?) \*\*/g, '<strong>$1</strong>')
      .replace(/\* (.*)/g, '<li class="text-muted-foreground">$1</li>')
      .replace(/(<li>.*<\/li>)+/g, '<ul class="list-disc ml-6 mb-4 space-y-1">$&</ul>')
      .split('\n')
      .map(line => line.trim())
      .filter(line => line)
      .map(line => line.match(/<[^>]+>/) ? line : `<p class="mb-4 text-muted-foreground leading-relaxed">${line}</p>`)
      .join('');
  };

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!contactForm.name.trim() || !contactForm.email.trim() || !contactForm.message.trim()) {
      toast.error("Please fill in all required fields");
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(contactForm.email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    setIsSubmittingContact(true);
    
    try {
      // Note: Contact storage would be implemented when contact_inquiries table is created
      console.log('Contact form submitted:', contactForm);

      toast.success("Thank you for your message! We'll get back to you within 24 hours.");
      
      // Reset form
      setContactForm({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: ""
      });
    } catch (error) {
      console.error('Error submitting contact form:', error);
      toast.error("Failed to send message. Please try again or contact us directly.");
    } finally {
      setIsSubmittingContact(false);
    }
  };

  const handleContactInputChange = (field: string, value: string) => {
    setContactForm(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/3 via-background to-accent/3">
      {/* Hero Section - Modern & Appealing */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        {/* Background Image with Enhanced Overlay */}
        <div 
          className="absolute inset-0 bg-cover bg-center transition-all duration-700"
          style={{
            backgroundImage: `url(${heroImage})`,
          }}
        />
        
        {/* Modern Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/75 via-primary/60 to-accent/65 dark:from-background/90 dark:via-primary/70 dark:to-accent/60" />
        
        {/* Floating Background Elements */}
        <div className="absolute inset-0 opacity-20 dark:opacity-15">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-primary/15 rounded-full blur-3xl animate-float-delayed" />
          <div className="absolute top-3/4 left-1/2 w-64 h-64 bg-accent/15 rounded-full blur-2xl animate-pulse" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 text-center max-w-6xl mx-auto px-6">
          <div className="space-y-8 animate-slideUpFade">
            {/* Hero Badge */}
            <div className="inline-flex items-center px-6 py-3 rounded-full glass-card mb-8">
              <Sparkles className="w-5 h-5 mr-2 text-accent animate-pulse" />
              <span className="text-sm font-semibold text-white/95">AI-Powered Healthcare Platform</span>
            </div>
            
            {/* Main Heading */}
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold leading-tight text-white drop-shadow-2xl whitespace-nowrap">
              <span className="inline-block">Welcome to </span>
              <span className="text-gradient bg-gradient-to-r from-accent via-emerald-300 to-white bg-clip-text text-transparent drop-shadow-xl">
                MediConnect
              </span>
            </h1>
            
            {/* Subheading */}
            <p className="text-2xl md:text-3xl font-medium text-white/95 max-w-4xl mx-auto leading-relaxed drop-shadow-lg">
              Your Health, Your Doctor, One Click Away
            </p>
            
            {/* Description */}
            <p className="text-lg text-white/85 max-w-3xl mx-auto leading-relaxed mb-12">
              Experience seamless healthcare with AI-powered assistance, expert consultations, and comprehensive medical services all in one modern platform.
            </p>
            
            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mt-12">
              <Button 
                asChild 
                variant="default"
                size="lg" 
                className="btn-modern bg-accent hover:bg-accent/90 text-accent-foreground border-2 border-accent/50 text-lg px-10 py-6"
              >
                <Link to="/booking">
                  <Calendar className="w-6 h-6 mr-3" />
                  Book Appointment
                </Link>
              </Button>
              <Button 
                asChild 
                variant="outline" 
                size="lg" 
                className="btn-modern bg-white/20 dark:bg-white/10 border-2 border-white/60 dark:border-white/40 text-white hover:bg-white/30 dark:hover:bg-white/20 hover:text-white hover:border-white/80 dark:hover:border-white/60 backdrop-blur-md text-lg px-10 py-6 shadow-lg"
              >
                <a href="#about">
                  <Stethoscope className="w-6 h-6 mr-3" />
                  Learn More
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced AI Symptom Checker */}
      <section id="symptom-checker" className="py-28 bg-gradient-to-br from-muted via-background to-muted/70 dark:from-background dark:via-muted/30 dark:to-background">
        <div className="container mx-auto px-6 lg:px-8 text-center">
          <div className="max-w-4xl mx-auto">
            <div className="inline-flex items-center px-6 py-3 rounded-full bg-primary/10 dark:bg-primary/20 border border-primary/20 dark:border-primary/30 mb-6 shadow-lg backdrop-blur-sm">
              <Sparkles className="w-5 h-5 mr-2 text-primary animate-pulse" />
              <span className="text-sm font-semibold text-primary">AI Health Assistant</span>
            </div>
            
            <h2 className="text-5xl md:text-6xl font-extrabold mb-6 bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent leading-tight drop-shadow-sm">
              Not Feeling Your Best?
            </h2>
            <p className="text-muted-foreground text-xl mb-12 max-w-3xl mx-auto leading-relaxed">
              Share your symptoms with confidence - whether it's a persistent headache, unexplained fatigue, or something more complex. Our intelligent AI health assistant, trained on extensive medical knowledge, will provide personalized guidance and suggest the most appropriate next steps for your wellness journey.
            </p>
            
            <Card className="max-w-3xl mx-auto glass-card shadow-2xl dark:shadow-primary/10 border-2 border-primary/15 dark:border-primary/25 bg-card/90 dark:bg-card/95 backdrop-blur-md">
              <CardContent className="p-10">
                <div className="space-y-6">
                  <Textarea
                    value={symptomInput}
                    onChange={(e) => setSymptomInput(e.target.value)}
                    className="min-h-[120px] text-lg border-2 border-primary/25 dark:border-primary/35 focus:border-primary/60 dark:focus:border-primary/70 bg-background/70 dark:bg-background/80 backdrop-blur-sm resize-none rounded-xl shadow-inner"
                    placeholder="e.g., 'I have a sore throat, mild fever, and headache that started yesterday...'"
                  />
                  
                  <Button 
                    onClick={handleSymptomCheck} 
                    variant="default"
                    size="lg"
                    disabled={isLoading}
                    className="w-full sm:w-auto px-8 py-4 text-lg font-semibold bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-primary-foreground shadow-xl hover:shadow-primary/25 hover:scale-105 transition-all duration-300"
                  >
                    {isLoading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin mr-3"></div>
                        Analyzing Symptoms...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-5 h-5 mr-3" />
                        Get AI Health Guidance
                      </>
                    )}
                  </Button>
                  
                  {symptomResult && (
                    <div className="mt-8 p-6 rounded-xl bg-gradient-to-br from-primary/5 to-accent/5 dark:from-primary/10 dark:to-accent/10 border border-primary/20 dark:border-primary/30 shadow-inner">
                      <div className="flex items-center mb-4">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-r from-primary to-accent flex items-center justify-center mr-4 shadow-lg">
                          <Sparkles className="w-6 h-6 text-white" />
                        </div>
                        <h3 className="text-xl font-semibold text-primary">AI Health Analysis</h3>
                      </div>
                      <div 
                        className="text-left ai-response prose prose-primary dark:prose-invert max-w-none"
                        dangerouslySetInnerHTML={{ __html: formatAIResponse(symptomResult) }}
                      />
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* About Section - Enhanced */}
      <section id="about" className="py-32 bg-gradient-to-br from-background via-muted/30 to-background">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-6 py-3 rounded-full glass-card mb-8">
              <Stethoscope className="w-5 h-5 mr-2 text-primary" />
              <span className="text-sm font-semibold text-primary">About Our Platform</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gradient mb-6">
              About MediConnect
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Your all-in-one healthcare partner, dedicated to simplifying and enhancing your medical experience
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <div className="space-y-6">
                <h3 className="text-2xl font-bold text-foreground">
                  Revolutionizing Healthcare Access
                </h3>
                <p className="text-muted-foreground leading-relaxed text-lg">
                  MediConnect provides role-based dashboards for patients and doctors, ensuring easy access to personalized information tailored to your unique needs. Experience the future of healthcare with our AI-powered platform.
                </p>
              </div>
              
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center p-6 modern-card">
                  <div className="w-12 h-12 bg-gradient-to-r from-primary to-accent rounded-xl flex items-center justify-center mx-auto mb-4">
                    <Calendar className="w-6 h-6 text-white" />
                  </div>
                  <h4 className="font-semibold text-foreground mb-2">24/7 Access</h4>
                  <p className="text-sm text-muted-foreground">Always available when you need us</p>
                </div>
                <div className="text-center p-6 modern-card">
                  <div className="w-12 h-12 bg-gradient-to-r from-accent to-primary rounded-xl flex items-center justify-center mx-auto mb-4">
                    <Sparkles className="w-6 h-6 text-white" />
                  </div>
                  <h4 className="font-semibold text-foreground mb-2">AI-Powered</h4>
                  <p className="text-sm text-muted-foreground">Smart health insights and guidance</p>
                </div>
              </div>
            </div>
            
            <Card className="medical-card p-8">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-r from-primary to-accent rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <Stethoscope className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-primary mb-4">
                  Our Commitment to Quality
                </h3>
              </div>
              <div className="space-y-4">
                <p className="text-muted-foreground leading-relaxed">
                  At MediConnect, we are committed to ensuring the highest standards of medical care. Our team of healthcare professionals leverages advanced technology to deliver comprehensive and personalized care.
                </p>
                <div className="flex items-center justify-center space-x-8 pt-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">1000+</div>
                    <div className="text-sm text-muted-foreground">Happy Patients</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">50+</div>
                    <div className="text-sm text-muted-foreground">Expert Doctors</div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Services Section - Enhanced */}
      <section id="services" className="py-32 bg-gradient-to-br from-muted via-background to-muted">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-6 py-3 rounded-full glass-card mb-8">
              <FileText className="w-5 h-5 mr-2 text-primary" />
              <span className="text-sm font-semibold text-primary">Our Services</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gradient mb-6">
              Comprehensive Healthcare Services
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              From consultation to emergency care, we provide complete healthcare solutions tailored to your needs
            </p>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <Card key={index} className="modern-card group hover:shadow-2xl hover:shadow-primary/10 transition-all duration-500 overflow-hidden">
                <CardHeader className="text-center relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="relative">
                    <div className="mx-auto w-16 h-16 bg-gradient-to-r from-primary to-accent rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
                      <service.icon className="w-8 h-8 text-white" />
                    </div>
                    <CardTitle className="text-2xl text-foreground group-hover:text-primary transition-colors duration-300 mb-4">
                      {service.title}
                    </CardTitle>
                    <CardDescription className="text-muted-foreground text-lg leading-relaxed">
                      {service.description}
                    </CardDescription>
                  </div>
                </CardHeader>
                <CardContent className="text-center relative">
                  <div className="text-4xl font-bold text-primary mb-6 group-hover:scale-110 transition-transform duration-300">
                    {service.price}
                  </div>
                  <Button asChild variant="default" className="w-full">
                    <Link to="/booking">Book Service</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Medical Gallery */}
      <MedicalGallery />

      {/* Contact Section */}
      <section 
        id="contact"
        className="relative py-24 min-h-[700px] flex items-center overflow-hidden"
        style={{
          backgroundImage: `linear-gradient(135deg, rgba(29, 78, 216, 0.9), rgba(16, 185, 129, 0.8)), url(${mapImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed'
        }}
      >
        {/* Background decorative elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-accent/20"></div>
        <div className="absolute top-10 left-10 w-32 h-32 bg-white/10 rounded-full blur-xl"></div>
        <div className="absolute bottom-20 right-20 w-48 h-48 bg-accent/20 rounded-full blur-2xl"></div>
        
        <div className="container mx-auto px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Contact Info Card */}
            <Card className="glass-card border-white/20 bg-white/10 backdrop-blur-xl text-white shadow-2xl">
              <CardHeader className="text-center lg:text-left">
                <CardTitle className="text-4xl md:text-5xl font-display font-bold mb-4 bg-gradient-to-r from-white via-blue-100 to-emerald-100 bg-clip-text text-transparent">
                  Contact & Location
                </CardTitle>
                <CardDescription className="text-white/90 text-lg font-body leading-relaxed">
                  Visit our state-of-the-art medical facility or reach out to our dedicated healthcare team.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center group hover:translate-x-2 transition-transform duration-300">
                  <div className="w-12 h-12 bg-accent/20 rounded-full flex items-center justify-center mr-4 group-hover:bg-accent/30 transition-colors">
                    <MapPin className="w-6 h-6 text-accent" />
                  </div>
                  <div>
                    <p className="font-semibold text-white mb-1">Address</p>
                    <p className="text-white/80">Hi-Tech City, Hyderabad, Telangana, India 500081</p>
                  </div>
                </div>
                
                <div className="flex items-center group hover:translate-x-2 transition-transform duration-300">
                  <div className="w-12 h-12 bg-accent/20 rounded-full flex items-center justify-center mr-4 group-hover:bg-accent/30 transition-colors">
                    <Phone className="w-6 h-6 text-accent" />
                  </div>
                  <div>
                    <p className="font-semibold text-white mb-1">Phone</p>
                    <p className="text-white/80">+91-40-1234-5678</p>
                  </div>
                </div>
                
                <div className="flex items-center group hover:translate-x-2 transition-transform duration-300">
                  <div className="w-12 h-12 bg-accent/20 rounded-full flex items-center justify-center mr-4 group-hover:bg-accent/30 transition-colors">
                    <Mail className="w-6 h-6 text-accent" />
                  </div>
                  <div>
                    <p className="font-semibold text-white mb-1">Email</p>
                    <p className="text-white/80">contact@mediconnect.in</p>
                  </div>
                </div>
                
                <div className="pt-6">
                  <Button asChild className="btn-modern bg-white text-primary hover:bg-white/90 w-full lg:w-auto">
                    <Link to="/booking">
                      <Calendar className="w-5 h-5 mr-2" />
                      Book Appointment
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            {/* Contact Form & Emergency Info */}
            <div className="space-y-6">
              {/* Contact Form */}
              <Card className="glass-card border-white/20 bg-white/10 backdrop-blur-xl text-white">
                <CardHeader>
                  <CardTitle className="text-2xl font-display font-bold text-white flex items-center">
                    <Send className="w-6 h-6 mr-3 text-accent" />
                    Send Us a Message
                  </CardTitle>
                  <CardDescription className="text-white/80">
                    Have a question? We'd love to hear from you.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleContactSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="contact-name" className="text-white/90 text-sm font-medium">
                          Name *
                        </Label>
                        <Input
                          id="contact-name"
                          type="text"
                          value={contactForm.name}
                          onChange={(e) => handleContactInputChange('name', e.target.value)}
                          className="bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-accent"
                          placeholder="Your full name"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="contact-email" className="text-white/90 text-sm font-medium">
                          Email *
                        </Label>
                        <Input
                          id="contact-email"
                          type="email"
                          value={contactForm.email}
                          onChange={(e) => handleContactInputChange('email', e.target.value)}
                          className="bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-accent"
                          placeholder="your.email@example.com"
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="contact-phone" className="text-white/90 text-sm font-medium">
                          Phone
                        </Label>
                        <Input
                          id="contact-phone"
                          type="tel"
                          value={contactForm.phone}
                          onChange={(e) => handleContactInputChange('phone', e.target.value)}
                          className="bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-accent"
                          placeholder="+91-XXXXXXXXXX"
                        />
                      </div>
                      <div>
                        <Label htmlFor="contact-subject" className="text-white/90 text-sm font-medium">
                          Subject
                        </Label>
                        <Input
                          id="contact-subject"
                          type="text"
                          value={contactForm.subject}
                          onChange={(e) => handleContactInputChange('subject', e.target.value)}
                          className="bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-accent"
                          placeholder="What's this about?"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="contact-message" className="text-white/90 text-sm font-medium">
                        Message *
                      </Label>
                      <Textarea
                        id="contact-message"
                        value={contactForm.message}
                        onChange={(e) => handleContactInputChange('message', e.target.value)}
                        className="bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-accent min-h-[100px]"
                        placeholder="Tell us how we can help you..."
                        required
                      />
                    </div>
                    
                    <Button 
                      type="submit" 
                      disabled={isSubmittingContact}
                      className="w-full bg-accent hover:bg-accent/90 text-white font-semibold"
                    >
                      {isSubmittingContact ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                          Sending...
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4 mr-2" />
                          Send Message
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
              
              {/* Emergency Info */}
              <Card className="glass-card border-red-400/30 bg-red-500/20 backdrop-blur-xl text-white">
                <CardHeader>
                  <CardTitle className="text-xl font-display font-bold text-white flex items-center">
                    <Phone className="w-5 h-5 mr-3 text-red-300" />
                    Emergency
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-red-100 mb-3">24/7 Emergency Services Available</p>
                  <p className="text-2xl font-bold text-red-300">+91-40-EMERGENCY</p>
                  <div className="mt-4 pt-3 border-t border-red-400/30">
                    <p className="text-sm text-red-100">
                      <strong>Office Hours:</strong><br />
                      Mon-Fri: 9:00 AM - 8:00 PM<br />
                      Saturday: 9:00 AM - 6:00 PM<br />
                      Sunday: Emergency Only
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}