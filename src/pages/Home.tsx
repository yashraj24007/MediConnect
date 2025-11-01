import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Stethoscope, Calendar, FileText, Sparkles, Clock } from "lucide-react";
import { toast } from "sonner";
import { AIMedicalService } from "@/services/aiMedicalService";
import heroImage from "@/assets/medical-hero.jpg";
import consultationImage from "@/assets/consultation-room.jpg";
import mapImage from "@/assets/clinic-hyderabad.jpg";
import { AIServicesSection } from "@/components/AIServicesSection";

export default function Home() {
  const [symptomInput, setSymptomInput] = useState("");
  const [symptomResult, setSymptomResult] = useState("");
  const [isLoading, setIsLoading] = useState(false);

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/3 via-background to-accent/3">
      {/* Hero Section - Modern & Appealing */}
      <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden pt-0 pb-8">
        {/* Background Image with Enhanced Overlay */}
        <div 
          className="absolute inset-0 bg-cover bg-center transition-all duration-700"
          style={{
            backgroundImage: `url(${heroImage})`,
          }}
        />
        
        {/* Modern Gradient Overlay - Darker for better text visibility */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900/85 via-primary/80 to-accent/75 dark:from-background/90 dark:via-primary/70 dark:to-accent/60" />
        
        {/* Floating Background Elements */}
        <div className="absolute inset-0 opacity-20 dark:opacity-15">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-primary/15 rounded-full blur-3xl animate-float-delayed" />
          <div className="absolute top-3/4 left-1/2 w-64 h-64 bg-accent/15 rounded-full blur-2xl animate-pulse" />
        </div>

        {/* Hero Content - Centered Vertically and Horizontally */}
        <div className="relative z-10 flex items-center justify-center min-h-[90vh] w-full px-6 py-16">
          <div className="text-center max-w-6xl mx-auto space-y-8 animate-slideUpFade">
            {/* Hero Badge */}
            <div className="inline-flex items-center px-6 py-3 rounded-full glass-card mb-6 shadow-lg backdrop-blur-md">
              <span className="text-2xl mr-2 animate-bounce">✨</span>
              <Sparkles className="w-5 h-5 mr-2 text-yellow-300 animate-pulse" />
              <span className="text-sm font-semibold text-white/95 dark:text-white">🤖 AI Healthcare Platform</span>
            </div>
            
            {/* Main Heading - Centered */}
            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl lg:text-7xl font-extrabold leading-tight drop-shadow-2xl tracking-tight">
                <span className="block bg-gradient-to-r from-cyan-300 via-blue-300 to-indigo-300 bg-clip-text text-transparent font-black animate-gradient mb-2">
                  Smart Healthcare 💊
                </span>
                <span className="block bg-gradient-to-r from-green-300 via-emerald-300 to-teal-300 bg-clip-text text-transparent font-black animate-gradient animation-delay-150">
                  Simplified ✨
                </span>
              </h1>
            </div>
            
            {/* Subheading - Centered */}
            <p className="text-xl md:text-2xl lg:text-3xl font-semibold text-white/95 dark:text-white max-w-4xl mx-auto leading-relaxed drop-shadow-lg">
              🚀 AI-Powered Health Solutions at Your Service 🏥
            </p>
            
            {/* Description - Centered */}
            <p className="text-base md:text-lg lg:text-xl text-white/85 dark:text-white/90 max-w-3xl mx-auto leading-relaxed">
              Get instant AI health consultations 🩺, manage records effortlessly 📋, and connect with specialists 👨‍⚕️—all in one secure platform 🔒.
            </p>
            
            {/* Action Buttons - Centered */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10 pb-8">
              <Button 
                asChild 
                variant="default"
                size="lg" 
                className="btn-modern bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white border-2 border-emerald-400/50 text-base md:text-lg px-10 py-6 shadow-2xl hover:shadow-emerald-500/50 transform hover:scale-105 transition-all duration-300"
              >
                <Link to="/booking" className="flex items-center">
                  <Calendar className="w-6 h-6 mr-2" />
                  📅 Book Appointment Now
                </Link>
              </Button>
              <Button 
                asChild 
                variant="outline" 
                size="lg" 
                className="btn-modern bg-white/20 dark:bg-white/10 border-2 border-white/60 dark:border-white/50 text-white hover:bg-white/30 dark:hover:bg-white/20 hover:text-white hover:border-white/80 dark:hover:border-white/70 backdrop-blur-md text-base md:text-lg px-10 py-6 shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
              >
                <Link to="/about" className="flex items-center">
                  <Stethoscope className="w-6 h-6 mr-2" />
                  🔍 Learn More
                </Link>
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

      {/* Statistics Section */}
      <section className="py-16 bg-gradient-to-r from-primary/10 via-accent/5 to-primary/10 dark:from-primary/20 dark:via-accent/10 dark:to-primary/20">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-2">
                10K+
              </div>
              <p className="text-muted-foreground font-medium">Happy Patients</p>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent mb-2">
                500+
              </div>
              <p className="text-muted-foreground font-medium">Expert Doctors</p>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-2">
                50+
              </div>
              <p className="text-muted-foreground font-medium">Specialties</p>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent mb-2">
                24/7
              </div>
              <p className="text-muted-foreground font-medium">AI Support</p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">Why MediConnect</Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Your Health Journey, <span className="text-gradient bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Simplified</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Experience healthcare like never before with our innovative platform
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="medical-card border-primary/10 dark:border-primary/20">
              <CardHeader>
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center mb-4">
                  <Sparkles className="w-7 h-7 text-white" />
                </div>
                <CardTitle className="text-xl">AI-Powered Intelligence</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base leading-relaxed">
                  Get instant health insights with our advanced AI assistant. From symptom analysis to personalized recommendations, we've got you covered 24/7.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="medical-card border-primary/10 dark:border-primary/20">
              <CardHeader>
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center mb-4">
                  <Calendar className="w-7 h-7 text-white" />
                </div>
                <CardTitle className="text-xl">Smart Booking</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base leading-relaxed">
                  Book appointments effortlessly with our intelligent scheduling system. Find the right doctor at the right time, every time.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="medical-card border-primary/10 dark:border-primary/20">
              <CardHeader>
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center mb-4">
                  <FileText className="w-7 h-7 text-white" />
                </div>
                <CardTitle className="text-xl">Secure Records</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base leading-relaxed">
                  Your medical records are safe with enterprise-grade security. Access your health information anytime, anywhere with complete privacy.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* AI Services Section */}
      <AIServicesSection />

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-primary via-primary/90 to-accent dark:from-primary/80 dark:via-primary/70 dark:to-accent/80">
        <div className="container mx-auto px-6 lg:px-8 text-center">
          <div className="max-w-3xl mx-auto">
            <Sparkles className="w-16 h-16 mx-auto mb-6 text-white animate-pulse" />
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Ready to Transform Your Healthcare Experience?
            </h2>
            <p className="text-xl text-white/90 mb-10">
              Join thousands of patients who trust MediConnect for their health needs
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                asChild 
                size="lg" 
                variant="secondary"
                className="text-lg px-10 py-6 bg-white hover:bg-white/90 text-primary shadow-2xl"
              >
                <Link to="/booking" className="flex items-center">
                  <Calendar className="w-5 h-5 mr-2" />
                  Book Your First Appointment
                </Link>
              </Button>
              <Button 
                asChild 
                size="lg" 
                variant="outline"
                className="text-lg px-10 py-6 border-2 border-white bg-white/10 text-white hover:bg-white hover:text-primary shadow-2xl backdrop-blur-sm transition-all duration-300"
              >
                <Link to="/ai/health-assistant" className="flex items-center">
                  <Sparkles className="w-5 h-5 mr-2" />
                  Try AI Assistant
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}