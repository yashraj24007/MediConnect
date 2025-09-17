import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { MapPin, Phone, Mail, Stethoscope, Calendar, FileText, Sparkles } from "lucide-react";
import heroImage from "@/assets/medical-hero.jpg";
import consultationImage from "@/assets/consultation-room.jpg";
import mapImage from "@/assets/clinic-hyderabad.jpg";
import { MedicalGallery } from "@/components/Gallery/MedicalGallery";

export default function Home() {
  const [symptomInput, setSymptomInput] = useState("");
  const [symptomResult, setSymptomResult] = useState("");
  const [isLoading, setIsLoading] = useState(false);

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
      alert("Please describe your symptoms.");
      return;
    }

    setIsLoading(true);
    // Simulate AI response
    setTimeout(() => {
      setSymptomResult(`
### Recommendation: Doctor Consultation

Based on your symptoms, I recommend scheduling a **Doctor Consultation** for a proper medical evaluation.

**Next Steps:**
* Schedule an appointment with one of our qualified doctors
* Prepare a list of your symptoms and when they started
* Bring any relevant medical history or current medications
* Consider any recent changes in your health or lifestyle

Please note: This is an AI suggestion and not a medical diagnosis. Always consult with a healthcare professional for proper medical advice.
      `);
      setIsLoading(false);
    }, 2000);
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
    <div className="min-h-screen">
      {/* Hero Section */}
      <section 
        className="relative h-[75vh] flex items-center justify-center text-primary-foreground"
        style={{
          backgroundImage: `linear-gradient(rgba(10, 43, 91, 0.75), rgba(10, 43, 91, 0.75)), url(${heroImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="text-center max-w-4xl mx-auto px-4">
          <h1 className="text-4xl md:text-6xl font-extrabold mb-6">
            Welcome to MediConnect
          </h1>
          <p className="text-lg md:text-xl mb-8 text-primary-foreground/90">
            Your Health, Your Doctor, One Click Away
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button asChild variant="accent" size="lg">
              <Link to="/booking">Book Now</Link>
            </Button>
            <Button asChild variant="glass" size="lg">
              <a href="#about">Learn More</a>
            </Button>
          </div>
        </div>
      </section>

      {/* AI Symptom Checker */}
      <section id="symptom-checker" className="py-24 bg-muted">
        <div className="container mx-auto px-4 lg:px-6 text-center">
          <h2 className="text-4xl font-extrabold text-primary mb-4">
            Feeling Unwell?
          </h2>
          <p className="text-muted-foreground text-lg mb-8 max-w-2xl mx-auto">
            Describe your symptoms below, and our AI assistant can suggest a next step.
          </p>
          
          <Card className="max-w-2xl mx-auto medical-card">
            <CardContent className="p-8">
              <Textarea
                value={symptomInput}
                onChange={(e) => setSymptomInput(e.target.value)}
                className="mb-4"
                rows={4}
                placeholder="e.g., 'I have a sore throat, a mild fever, and a headache...'"
              />
              <Button 
                onClick={handleSymptomCheck} 
                variant="accent" 
                size="lg"
                disabled={isLoading}
                className="mb-6"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-accent-foreground/30 border-t-accent-foreground rounded-full animate-spin mr-2"></div>
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2" />
                    Get AI Suggestion
                  </>
                )}
              </Button>
              
              {symptomResult && (
                <div 
                  className="text-left ai-response border-t border-border pt-6"
                  dangerouslySetInnerHTML={{ __html: formatAIResponse(symptomResult) }}
                />
              )}
            </CardContent>
          </Card>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-24 bg-background">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div className="space-y-6">
              <h2 className="text-4xl font-extrabold text-primary">
                About MediConnect
              </h2>
              <p className="text-muted-foreground leading-relaxed text-lg">
                MediConnect is your all-in-one healthcare partner, dedicated to simplifying and enhancing your medical experience. Our platform is designed to provide role-based dashboards for patients and doctors, ensuring easy access to personalized information tailored to your unique needs.
              </p>
            </div>
            
            <Card className="medical-card">
              <CardHeader>
                <CardTitle className="text-2xl text-primary">
                  Our Commitment to Quality
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  At MediConnect, we are committed to ensuring the highest standards of medical care. Our team of healthcare professionals is dedicated to providing exceptional services, leveraging advanced technology to deliver comprehensive and personalized care to every patient.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-24 bg-muted">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-extrabold text-primary mb-4">
              Our Services
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Comprehensive healthcare services designed to meet all your medical needs.
            </p>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <Card key={index} className="medical-card flex flex-col h-full">
                <CardHeader className="text-center">
                  <div className="mx-auto w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                    <service.icon className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle className="text-xl">{service.title}</CardTitle>
                  <CardDescription className="flex-grow">
                    {service.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-center mt-auto">
                  <div className="text-3xl font-bold text-primary mb-6">
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
        className="relative py-24 min-h-[600px] flex items-center"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url(${mapImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="container mx-auto px-4 lg:px-6 relative">
          <Card className="hero-gradient text-primary-foreground max-w-md border-0">
            <CardHeader>
              <CardTitle className="text-3xl font-bold">
                Contact & Location
              </CardTitle>
              <CardDescription className="text-primary-foreground/80">
                Find us at our main clinic or get in touch with our team.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center text-primary-foreground/90">
                <MapPin className="w-5 h-5 mr-3 text-accent" />
                Hi-Tech City, Hyderabad, Telangana, India
              </div>
              <div className="flex items-center text-primary-foreground/90">
                <Phone className="w-5 h-5 mr-3 text-accent" />
                +91-40-1234-5678
              </div>
              <div className="flex items-center text-primary-foreground/90">
                <Mail className="w-5 h-5 mr-3 text-accent" />
                contact@mediconnect.in
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}