import { Brain, Sparkles, Activity, MessageSquare, Calendar, FileSearch, Pill, Heart, ArrowRight } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const aiServices = [
    {
      icon: MessageSquare,
      title: "AI Health Assistant (Aura)",
      description: "24/7 intelligent health companion providing instant medical guidance, symptom analysis, and personalized wellness advice.",
      features: ["Instant Responses", "Natural Conversations", "Multi-language Support"],
      color: "from-blue-500 to-cyan-500",
      badge: "Most Popular",
      action: "chat",
      primaryLabel: 'Start Chatting with Aura',
      secondaryLabel: 'Learn More'
    },
    {
      icon: FileSearch,
      title: "Symptom Analyzer",
      description: "Advanced AI-powered symptom checker that analyzes your health concerns and suggests appropriate medical specialties.",
      features: ["Smart Analysis", "Urgency Detection", "Doctor Recommendations"],
      color: "from-purple-500 to-pink-500",
      action: "symptom-checker",
      primaryLabel: 'Analyze Symptoms Now',
      secondaryLabel: 'Try on Homepage'
    },
    {
      icon: Calendar,
      title: "Smart Booking System",
      description: "Intelligent appointment scheduling that matches you with the right specialists based on your health needs and preferences.",
      features: ["Auto-matching", "Time Optimization", "Reminder Alerts"],
      color: "from-green-500 to-emerald-500",
      action: "booking",
      primaryLabel: 'Book Appointment Now',
      secondaryLabel: 'Browse Doctors'
    },
    {
      icon: Activity,
      title: "Health Insights",
      description: "Personalized health analytics and trends based on your medical history, appointments, and wellness data.",
      features: ["Data Visualization", "Trend Analysis", "Predictive Health"],
      color: "from-orange-500 to-red-500",
      action: "patient-info",
      primaryLabel: 'View Your Dashboard',
      secondaryLabel: 'Learn More'
    },
  {
    icon: Pill,
    title: "Medication Guide",
    description: "Comprehensive medication information, interaction checker, and personalized reminders for your prescriptions.",
    features: ["Drug Information", "Interaction Alerts", "Dosage Reminders"],
    color: "from-indigo-500 to-blue-500",
    action: "medication",
    primaryLabel: 'View Medication Guide',
    secondaryLabel: 'Set Up Reminders'
  },
  {
    icon: Heart,
    title: "Wellness Recommendations",
    description: "AI-driven personalized health tips, nutrition advice, and lifestyle suggestions tailored to your unique health profile.",
    features: ["Custom Plans", "Nutrition Tracking", "Fitness Integration"],
    color: "from-pink-500 to-rose-500",
    action: "wellness",
    primaryLabel: 'Get Wellness Tips',
    secondaryLabel: 'Learn More'
  }
];

export function AIServicesSection() {
  const navigate = useNavigate();

  // Arrow function to handle AI service actions
  const handleServiceClick = (action: string, title: string) => {
    switch (action) {
      case "chat":
        // Navigate to AI Health Assistant page
        navigate('/ai/health-assistant');
        toast.success("🤖 Opening AI Health Assistant - Aura is ready to help!");
        break;
      
      case "symptom-checker":
        // Navigate to symptom analyzer page
        navigate('/ai/symptom-analyzer');
        toast.success("🔍 Opening Symptom Analyzer...");
        break;
      
      case "booking":
        // Navigate to booking page
        navigate('/booking');
        toast.success("📅 Opening Smart Booking System...");
        break;
      
      case "patient-info":
        // Navigate to patient info/health insights
        navigate('/patient-info');
        toast.success("📊 Opening Health Insights Dashboard...");
        break;
      
      case "medication":
        // Navigate to medication reminders page
        navigate('/ai/medication-reminders');
        toast.success("💊 Opening Medication Guide...");
        break;
      
      case "wellness":
        // Navigate to health insights page (which includes wellness recommendations)
        navigate('/ai/health-insights');
        toast.success("❤️ Opening Wellness Recommendations...");
        break;
      
      default:
        toast.info(`Accessing ${title}...`);
    }
  };

  return (
    <section id="ai-services" className="py-20 bg-gradient-to-br from-background via-primary/5 to-accent/5">
      <div className="container mx-auto px-4 lg:px-6">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-4">
            <Sparkles className="w-4 h-4 mr-2 text-primary animate-pulse" />
            <span className="text-sm font-semibold text-primary">Powered by Advanced AI</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            AI-Powered <span className="text-gradient bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Healthcare Services</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Experience the future of healthcare with our cutting-edge AI technology that puts your health first
          </p>
        </div>

        {/* AI Services Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {aiServices.map((service, index) => (
            <Card 
              key={index} 
              className="group hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 bg-card/50 backdrop-blur-sm border-border/50 overflow-visible flex flex-col"
            >
              <CardHeader className="relative pb-4">
                {service.badge && (
                  <Badge className="absolute top-4 right-4 bg-gradient-to-r from-primary to-accent text-primary-foreground">
                    {service.badge}
                  </Badge>
                )}
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${service.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <service.icon className="w-7 h-7 text-white" />
                </div>
                <CardTitle className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                  {service.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 flex-1 flex flex-col pb-6">
                <CardDescription className="text-muted-foreground leading-relaxed flex-grow">
                  {service.description}
                </CardDescription>
                <div className="flex flex-wrap gap-2 pb-2">
                  {service.features.map((feature, idx) => (
                    <Badge 
                      key={idx} 
                      variant="secondary" 
                      className="text-xs bg-primary/10 text-primary border-primary/20"
                    >
                      {feature}
                    </Badge>
                  ))}
                </div>

                <div className="mt-auto pt-4 flex flex-col gap-3">
                  <Button
                    onClick={() => handleServiceClick(service.action, service.title)}
                    className="w-full bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-primary-foreground group/btn shadow-lg hover:shadow-xl transition-all"
                    size="lg"
                  >
                    <span className="truncate">{service.primaryLabel || 'Access Service'}</span>
                    <ArrowRight className="w-4 h-4 ml-2 flex-shrink-0 group-hover/btn:translate-x-1 transition-transform" />
                  </Button>

                  {/* Secondary action: navigate to info or related page */}
                  {service.secondaryLabel && (
                    <Button
                      variant="outline"
                      onClick={() => {
                        // Secondary defaults: navigate to about or doctors page depending on label
                        if (service.secondaryLabel === 'Try on Homepage') {
                          navigate('/');
                          setTimeout(() => {
                            const el = document.getElementById('symptom-checker');
                            el?.scrollIntoView({ behavior: 'smooth' });
                          }, 120);
                          toast.info("Navigating to home page...");
                        } else if (service.secondaryLabel === 'Browse Doctors') {
                          navigate('/doctors');
                          toast.info("Browsing available doctors...");
                        } else if (service.secondaryLabel === 'Set Up Reminders') {
                          navigate('/ai/medication-reminders');
                          toast.info("Opening medication reminders...");
                        } else if (service.secondaryLabel === 'Learn More') {
                          navigate('/about');
                          toast.info("Learn more about our services...");
                        } else {
                          navigate('/about');
                        }
                      }}
                      className="w-full border-2"
                      size="lg"
                    >
                      <span className="truncate">{service.secondaryLabel}</span>
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Call to Action */}
        <div className="mt-16 text-center">
          <div className="inline-flex flex-col sm:flex-row items-center gap-4 bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 p-8 rounded-2xl border border-primary/20">
            <Brain className="w-12 h-12 text-primary" />
            <div className="text-left">
              <h3 className="text-2xl font-bold text-foreground mb-2">
                Start Your AI-Powered Health Journey
              </h3>
              <p className="text-muted-foreground">
                Chat with Aura, our AI health assistant, available 24/7 to answer your health questions
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}