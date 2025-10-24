import { Calendar, Sparkles, Clock, CheckCircle, Users, TrendingUp, ArrowRight, Loader2, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { GroqChatService } from "@/services/groqService";
import { useToast } from "@/hooks/use-toast";
import { doctors } from "@/data/doctors";

interface DoctorMatch {
  name: string;
  specialty: string;
  matchScore: number;
  reason: string;
  availability: string;
}

export default function SmartBooking() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [healthConcern, setHealthConcern] = useState("");
  const [isMatching, setIsMatching] = useState(false);
  const [matches, setMatches] = useState<DoctorMatch[]>([]);
  const [showMatcher, setShowMatcher] = useState(false);

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleStartMatching = () => {
    setShowMatcher(true);
    setTimeout(() => {
      document.getElementById('matcher-form')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleFindDoctor = async () => {
    if (!healthConcern.trim()) {
      toast({
        title: "Please describe your health concern",
        description: "Enter your health issue to get AI-powered doctor recommendations",
        variant: "destructive"
      });
      return;
    }

    // Check if API key is configured
    const apiKey = import.meta.env.VITE_GROQ_API_KEY;
    if (!apiKey || apiKey === 'your_groq_api_key_here') {
      toast({
        title: "⚠️ AI Service Not Configured",
        description: "Please add your Groq API key to the .env file. Get a free key at console.groq.com/keys",
        variant: "destructive"
      });
      return;
    }

    setIsMatching(true);
    setMatches([]);

    try {
      // Get list of specialties from doctors
      const specialties = [...new Set(doctors.map(d => d.specialty))].join(", ");

      const prompt = `As a medical AI assistant, analyze this health concern and recommend the TOP 3 most suitable doctor specialties from this list: ${specialties}

Health Concern: ${healthConcern}

Provide your response in this JSON format (ensure valid JSON):
{
  "matches": [
    {
      "specialty": "Cardiologist",
      "matchScore": 95,
      "reason": "Heart-related symptoms require cardiac specialist",
      "urgency": "urgent"
    },
    {
      "specialty": "General Physician",
      "matchScore": 80,
      "reason": "Can provide initial assessment",
      "urgency": "soon"
    }
  ]
}

Important: 
- ONLY use specialties from this exact list: ${specialties}
- Match score should be 0-100
- Provide exactly 2-3 specialty recommendations
- Order by match score (highest first)
- Urgency must be: routine, soon, or urgent
- Return ONLY valid JSON, no extra text`;

      const response = await GroqChatService.sendMessage(prompt, []);
      
      // Extract JSON from response
      let jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        try {
          const result = JSON.parse(jsonMatch[0]);
          
          if (!result.matches || !Array.isArray(result.matches)) {
            throw new Error("Invalid response structure");
          }
          
          // Match with actual doctors
          const doctorMatches: DoctorMatch[] = [];
          
          for (const match of result.matches.slice(0, 3)) {
            const matchingDoctors = doctors.filter(d => 
              d.specialty.toLowerCase().includes(match.specialty.toLowerCase()) ||
              match.specialty.toLowerCase().includes(d.specialty.toLowerCase())
            );
            
            if (matchingDoctors.length > 0) {
              // Pick a random doctor from matching specialty
              const doctor = matchingDoctors[Math.floor(Math.random() * matchingDoctors.length)];
              doctorMatches.push({
                name: doctor.name,
                specialty: doctor.specialty,
                matchScore: match.matchScore || 75,
                reason: match.reason,
                availability: "Next available: Within 1-2 days"
              });
            }
          }
          
          // If no matches found, provide general physician
          if (doctorMatches.length === 0) {
            const generalDoctors = doctors.filter(d => 
              d.specialty.toLowerCase().includes('general') ||
              d.specialty.toLowerCase().includes('physician') ||
              d.specialty.toLowerCase().includes('medicine')
            );
            
            if (generalDoctors.length > 0) {
              doctorMatches.push({
                name: generalDoctors[0].name,
                specialty: generalDoctors[0].specialty,
                matchScore: 70,
                reason: "General physician can provide initial consultation for your concern",
                availability: "Next available: Within 1-2 days"
              });
            }
          }
          
          setMatches(doctorMatches);
          
          if (doctorMatches.length === 0) {
            toast({
              title: "No exact matches found",
              description: "Please try browsing our doctors page for available specialists.",
            });
          }
        } catch (parseError) {
          console.error("JSON parse error:", parseError);
          throw new Error("Could not parse AI response");
        }
      } else {
        throw new Error("No JSON found in response");
      }
    } catch (error) {
      console.error("Error matching doctors:", error);
      toast({
        title: "Matching Error",
        description: "Unable to find suitable doctors. Please try browsing our doctor list.",
        variant: "destructive"
      });
    } finally {
      setIsMatching(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-green-500/5 to-emerald-500/5">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 via-emerald-500/5 to-green-500/10" />
        <div className="container mx-auto px-4 lg:px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="mb-6 bg-gradient-to-r from-green-500 to-emerald-500 text-white">
              <Sparkles className="w-4 h-4 mr-2" />
              Intelligent Scheduling
            </Badge>
            <div className="w-20 h-20 mx-auto mb-6 rounded-3xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center shadow-2xl">
              <Calendar className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-green-500 via-emerald-500 to-green-500 bg-clip-text text-transparent">
              Smart Booking System
            </h1>
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              Intelligent appointment scheduling that matches you with the right specialists based on your health needs and preferences
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-gradient-to-r from-green-500 to-emerald-500 text-white" onClick={handleStartMatching}>
                <Calendar className="w-5 h-5 mr-2" />
                Start Smart Matching
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link to="/doctors" className="flex items-center">
                  Browse Doctors
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Smart Matcher Form */}
      {showMatcher && (
        <section className="py-16 bg-background/50" id="matcher-form">
          <div className="container mx-auto px-4 lg:px-6">
            <div className="max-w-4xl mx-auto">
              <Card className="border-2 border-green-500/20">
                <CardHeader>
                  <CardTitle className="text-2xl flex items-center gap-2">
                    <Sparkles className="w-6 h-6 text-green-500" />
                    Describe Your Health Concern
                  </CardTitle>
                  <CardDescription>
                    Tell us what brings you in today. Our AI will match you with the most suitable specialists.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <Textarea
                      placeholder="Example: I've been having frequent headaches and feeling dizzy. I also notice my vision gets blurry sometimes..."
                      className="min-h-[120px] resize-none"
                      value={healthConcern}
                      onChange={(e) => setHealthConcern(e.target.value)}
                      disabled={isMatching}
                    />
                  </div>

                  <Button 
                    onClick={handleFindDoctor}
                    disabled={isMatching || !healthConcern.trim()}
                    className="w-full bg-gradient-to-r from-green-500 to-emerald-500"
                    size="lg"
                  >
                    {isMatching ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Finding Best Matches...
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5 mr-2" />
                        Find Matching Doctors
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>

              {/* Doctor Matches */}
              {matches.length > 0 && (
                <div className="mt-8 space-y-4 animate-in fade-in slide-in-from-bottom-4">
                  <h3 className="text-2xl font-bold text-center mb-6">
                    Top Doctor Recommendations for You
                  </h3>

                  {matches.map((match, index) => (
                    <Card key={index} className="border-2 border-green-500/20 hover:shadow-lg transition-all">
                      <CardContent className="pt-6">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-3">
                              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 text-white flex items-center justify-center font-bold text-lg">
                                #{index + 1}
                              </div>
                              <div>
                                <h4 className="text-xl font-bold">{match.name}</h4>
                                <Badge className="mt-1">{match.specialty}</Badge>
                              </div>
                            </div>

                            <div className="space-y-3 ml-15">
                              <div className="flex items-center gap-2">
                                <div className="flex items-center gap-2">
                                  <span className="text-sm font-semibold">Match Score:</span>
                                  <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden w-32">
                                    <div 
                                      className="h-full bg-gradient-to-r from-green-500 to-emerald-500"
                                      style={{ width: `${match.matchScore}%` }}
                                    />
                                  </div>
                                  <span className="text-sm font-bold text-green-600">{match.matchScore}%</span>
                                </div>
                              </div>

                              <div>
                                <p className="text-sm text-muted-foreground">
                                  <span className="font-semibold text-foreground">Why this doctor:</span> {match.reason}
                                </p>
                              </div>

                              <div className="flex items-center gap-2 text-sm">
                                <Clock className="w-4 h-4 text-green-500" />
                                <span className="text-muted-foreground">{match.availability}</span>
                              </div>
                            </div>
                          </div>

                          <div>
                            <Button asChild className="bg-gradient-to-r from-green-500 to-emerald-500">
                              <Link to={`/doctors?specialty=${encodeURIComponent(match.specialty)}`}>
                                Book Now
                              </Link>
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}

                  {/* Action Buttons */}
                  <div className="flex gap-4 mt-8">
                    <Button 
                      variant="outline" 
                      onClick={() => {
                        setHealthConcern("");
                        setMatches([]);
                        setTimeout(() => {
                          document.getElementById('matcher-form')?.scrollIntoView({ behavior: 'smooth' });
                        }, 100);
                      }}
                      className="flex-1"
                    >
                      Try Different Concern
                    </Button>
                    <Button asChild className="flex-1">
                      <Link to="/doctors">Browse All Doctors</Link>
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Features */}
      <section className="py-16 bg-background/50">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Smart Booking Features</h2>
            <p className="text-muted-foreground text-lg">Book smarter, not harder with AI-powered scheduling</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-2 hover:shadow-xl transition-all duration-300">
              <CardHeader>
                <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center mb-4">
                  <Users className="w-6 h-6 text-green-500" />
                </div>
                <CardTitle>Auto-matching</CardTitle>
                <CardDescription>
                  AI automatically matches you with the best doctor based on your symptoms, location, and preferences
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 hover:shadow-xl transition-all duration-300">
              <CardHeader>
                <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center mb-4">
                  <Clock className="w-6 h-6 text-emerald-500" />
                </div>
                <CardTitle>Time Optimization</CardTitle>
                <CardDescription>
                  Find the most convenient appointment slots that fit your schedule perfectly
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 hover:shadow-xl transition-all duration-300">
              <CardHeader>
                <div className="w-12 h-12 rounded-xl bg-teal-500/10 flex items-center justify-center mb-4">
                  <CheckCircle className="w-6 h-6 text-teal-500" />
                </div>
                <CardTitle>Reminder Alerts</CardTitle>
                <CardDescription>
                  Never miss an appointment with smart reminders via email and notifications
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">How Smart Booking Works</h2>
            
            <div className="grid md:grid-cols-2 gap-8">
              <Card className="border-2">
                <CardHeader>
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 text-white flex items-center justify-center mb-4 font-bold text-lg">
                    1
                  </div>
                  <CardTitle>Select Your Needs</CardTitle>
                  <CardDescription>
                    Choose the type of consultation you need or let AI suggest based on your symptoms
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="border-2">
                <CardHeader>
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 text-white flex items-center justify-center mb-4 font-bold text-lg">
                    2
                  </div>
                  <CardTitle>AI Doctor Matching</CardTitle>
                  <CardDescription>
                    Our AI analyzes doctor expertise, availability, ratings, and your location to find the best match
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="border-2">
                <CardHeader>
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 text-white flex items-center justify-center mb-4 font-bold text-lg">
                    3
                  </div>
                  <CardTitle>Choose Time Slot</CardTitle>
                  <CardDescription>
                    Select from available time slots optimized for your schedule and urgency level
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="border-2">
                <CardHeader>
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 text-white flex items-center justify-center mb-4 font-bold text-lg">
                    4
                  </div>
                  <CardTitle>Confirm & Relax</CardTitle>
                  <CardDescription>
                    Get instant confirmation with appointment details and automated reminders
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16 bg-gradient-to-br from-green-500/5 to-emerald-500/5">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center">Why Choose Smart Booking?</h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="border-l-4 border-l-green-500">
                <CardHeader>
                  <div className="flex items-start gap-4">
                    <TrendingUp className="w-8 h-8 text-green-500 mt-1" />
                    <div>
                      <CardTitle>Save Time</CardTitle>
                      <CardDescription>
                        No more calling multiple doctors or browsing endlessly. Find and book in minutes.
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
              </Card>

              <Card className="border-l-4 border-l-emerald-500">
                <CardHeader>
                  <div className="flex items-start gap-4">
                    <CheckCircle className="w-8 h-8 text-emerald-500 mt-1" />
                    <div>
                      <CardTitle>Better Matches</CardTitle>
                      <CardDescription>
                        AI ensures you're matched with doctors who specialize in your specific health needs.
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
              </Card>

              <Card className="border-l-4 border-l-teal-500">
                <CardHeader>
                  <div className="flex items-start gap-4">
                    <Clock className="w-8 h-8 text-teal-500 mt-1" />
                    <div>
                      <CardTitle>Real-time Availability</CardTitle>
                      <CardDescription>
                        See live availability and book slots that work with your schedule.
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
              </Card>

              <Card className="border-l-4 border-l-lime-500">
                <CardHeader>
                  <div className="flex items-start gap-4">
                    <Sparkles className="w-8 h-8 text-lime-500 mt-1" />
                    <div>
                      <CardTitle>Seamless Experience</CardTitle>
                      <CardDescription>
                        From booking to appointment reminders, everything is automated and hassle-free.
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-r from-green-500 to-emerald-500 text-white">
        <div className="container mx-auto px-4 lg:px-6 text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Book Smarter?</h2>
          <p className="text-xl mb-8 opacity-90">
            Experience the future of appointment scheduling with AI
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" className="text-lg px-8">
              <Link to="/booking" className="flex items-center">
                Book Now
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="bg-white/10 border-white text-white hover:bg-white/20">
              <Link to="/doctors">
                Browse Specialists
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
