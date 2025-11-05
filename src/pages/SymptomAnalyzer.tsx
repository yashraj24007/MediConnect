import { FileSearch, Sparkles, Activity, AlertCircle, CheckCircle, ArrowRight, Brain, Loader2, Send, Calendar, User, Star, Clock, MapPin, Award, Phone, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { GroqChatService } from "@/services/groqService";
import { useToast } from "@/hooks/use-toast";
import { DoctorService } from "@/services/doctorService";
import { Doctor } from "@/data/doctors";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast as sonnerToast } from "sonner";

interface AnalysisResult {
  urgency: 'low' | 'medium' | 'high' | 'emergency';
  possibleConditions: string[];
  recommendations: string[];
  specialist: string;
  nextSteps: string[];
  explanation: string;
}

interface RecommendedDoctor extends Doctor {
  matchScore?: number;
}

export default function SymptomAnalyzer() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, profile } = useAuth();
  const [symptoms, setSymptoms] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [showAnalyzer, setShowAnalyzer] = useState(false);
  const [recommendedDoctors, setRecommendedDoctors] = useState<RecommendedDoctor[]>([]);
  const [bookingDoctor, setBookingDoctor] = useState<Doctor | null>(null);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [showReview, setShowReview] = useState(false);
  
  // Booking form state
  const [bookingForm, setBookingForm] = useState({
    date: (() => {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      return tomorrow.toISOString().split('T')[0];
    })(),
    time: "09:00",
    reason: "",
    notes: ""
  });

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleAnalyzeNow = () => {
    setShowAnalyzer(true);
    setTimeout(() => {
      const element = document.getElementById('symptom-form');
      element?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleAnalyzeSymptoms = async () => {
    if (!symptoms.trim()) {
      toast({
        title: "Please describe your symptoms",
        description: "Enter your symptoms to get an AI analysis",
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

    setIsAnalyzing(true);
    setAnalysis(null);
    setRecommendedDoctors([]);

    try {
      const prompt = `As an expert medical AI assistant, analyze the following patient symptoms and provide a comprehensive medical assessment.

Patient Symptoms: ${symptoms}

Analyze the symptoms carefully considering:
- Severity and urgency level
- Potential medical conditions that match these symptoms
- Differential diagnosis considerations
- Appropriate medical specialist required
- Immediate care recommendations

Provide your response in this EXACT JSON format (must be valid JSON):
{
  "urgency": "low",
  "possibleConditions": ["Condition 1", "Condition 2", "Condition 3"],
  "recommendations": ["Recommendation 1", "Recommendation 2", "Recommendation 3"],
  "specialist": "Medical Specialist Name",
  "explanation": "Brief explanation of the analysis and why this specialist is recommended",
  "nextSteps": ["Step 1", "Step 2", "Step 3"]
}

CRITICAL REQUIREMENTS:
- urgency MUST be EXACTLY one of: "low", "medium", "high", "emergency"
- For chest pain, difficulty breathing, severe bleeding, stroke symptoms, severe head trauma: urgency = "emergency"
- For persistent fever, severe pain, unusual symptoms: urgency = "high"
- For moderate discomfort, ongoing issues: urgency = "medium"
- For mild symptoms, preventive care: urgency = "low"
- specialist MUST be one of: "Cardiologist", "Neurologist", "Orthopedic Surgeon", "Pediatrician", "Dermatologist", "Gastroenterologist", "Pulmonologist", "Endocrinologist", "Psychiatrist", "Oncologist", "Urologist", "Rheumatologist", "ENT Specialist", "General Physician", "Gynecologist", "Ophthalmologist", "Nephrologist", "Dentist", "Physiotherapist"
- Provide 3-5 possible conditions
- Give 4-6 practical recommendations
- Provide 3-5 clear next steps
- Return ONLY valid JSON, no markdown, no extra text`;

      const response = await GroqChatService.sendMessage(prompt, []);
      
      // Try to extract JSON from response
      let jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        try {
          const result = JSON.parse(jsonMatch[0]);
          
          // Validate the response structure
          if (!result.urgency || !result.possibleConditions || !result.recommendations || !result.specialist) {
            throw new Error("Invalid response structure");
          }
          
          setAnalysis(result);
          
          // Fetch recommended doctors based on the specialist
          await fetchRecommendedDoctors(result.specialist);
          
          if (result.urgency === 'emergency') {
            toast({
              title: "🚨 URGENT: Seek Immediate Medical Attention",
              description: "Based on your symptoms, please go to the nearest emergency room or call emergency services immediately.",
              variant: "destructive",
              duration: 10000
            });
          } else if (result.urgency === 'high') {
            toast({
              title: "⚠️ High Priority",
              description: "Your symptoms require prompt medical attention. Please schedule an appointment soon.",
              variant: "destructive"
            });
          }
        } catch (parseError) {
          console.error("JSON parse error:", parseError);
          throw new Error("Could not parse AI response");
        }
      } else {
        // If no JSON found, create a basic response
        console.warn("No JSON in response, creating fallback");
        const fallbackResult = {
          urgency: 'medium' as const,
          possibleConditions: ["Medical evaluation needed for accurate diagnosis"],
          recommendations: ["Consult a healthcare professional", "Document all symptoms with dates and severity", "Monitor for any changes or worsening", "Keep a symptom diary"],
          specialist: "General Physician",
          explanation: "A general physician can provide an initial evaluation and refer you to a specialist if needed.",
          nextSteps: ["Schedule an appointment with a doctor", "Prepare a detailed list of your symptoms", "Note any triggers or patterns", "Bring any relevant medical history"]
        };
        setAnalysis(fallbackResult);
        await fetchRecommendedDoctors(fallbackResult.specialist);
      }
    } catch (error) {
      console.error("Error analyzing symptoms:", error);
      toast({
        title: "Analysis Error",
        description: "Unable to analyze symptoms. Please try again or consult a healthcare professional directly.",
        variant: "destructive"
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const fetchRecommendedDoctors = async (specialistType: string) => {
    try {
      const allDoctors = await DoctorService.getAllDoctors();
      
      // Filter doctors by specialty (case-insensitive matching)
      const matchingDoctors = allDoctors.filter(doctor => 
        doctor.specialty.toLowerCase().includes(specialistType.toLowerCase()) ||
        specialistType.toLowerCase().includes(doctor.specialty.toLowerCase())
      );
      
      // If no exact matches, try to find general physicians
      if (matchingDoctors.length === 0) {
        const generalDoctors = allDoctors.filter(doctor => 
          doctor.specialty.toLowerCase().includes('general') ||
          doctor.specialty.toLowerCase().includes('physician')
        );
        setRecommendedDoctors(generalDoctors.slice(0, 3));
      } else {
        // Sort by experience and limit to top 3
        const sortedDoctors = matchingDoctors
          .sort((a, b) => b.experience - a.experience)
          .slice(0, 3);
        setRecommendedDoctors(sortedDoctors);
      }
    } catch (error) {
      console.error("Error fetching doctors:", error);
      toast({
        title: "Could not load doctors",
        description: "Please visit the Doctors page to book an appointment.",
        variant: "default"
      });
    }
  };

  const handleBookAppointment = (doctor: Doctor) => {
    if (!user) {
      sonnerToast.error("Please login to book an appointment", {
        description: "You need to be logged in to book appointments"
      });
      return;
    }
    setBookingDoctor(doctor);
    setBookingSuccess(false);
    setShowReview(false);
    setBookingForm({
      date: (() => {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        return tomorrow.toISOString().split('T')[0];
      })(),
      time: "09:00",
      reason: symptoms || "Symptom analysis follow-up",
      notes: symptoms ? `Patient reported symptoms: ${symptoms}` : ""
    });
    setIsBookingOpen(true);
  };

  const handleProceedToReview = () => {
    if (!bookingForm.reason.trim()) {
      sonnerToast.error("Please provide a reason for your visit");
      return;
    }
    setShowReview(true);
  };

  const handleEditBooking = () => {
    setShowReview(false);
  };

  const handleSubmitBooking = async () => {
    if (!user || !bookingDoctor || !profile) {
      sonnerToast.error("Authentication required");
      return;
    }

    if (!bookingForm.reason.trim()) {
      sonnerToast.error("Please provide a reason for your visit");
      return;
    }

    setIsSubmitting(true);

    try {
      // Get or create patient record (with better error handling)
      let patientId = null;
      
      try {
        const { data: patientData, error: fetchError } = await supabase
          .from('patients')
          .select('id')
          .eq('profile_id', profile.id)
          .maybeSingle(); // Use maybeSingle instead of single to handle no results

        if (patientData) {
          patientId = patientData.id;
        } else if (!fetchError) {
          // Try to create patient record
          const { data: newPatient, error: patientError } = await supabase
            .from('patients')
            .insert({ profile_id: profile.id })
            .select('id')
            .single();

          if (!patientError && newPatient) {
            patientId = newPatient.id;
          } else {
            console.warn('Could not create patient record:', patientError);
            // Continue without patient ID - use demo mode
          }
        }
      } catch (dbError) {
        console.warn('Database operation failed, using demo mode:', dbError);
        // Continue without patient ID - use demo mode
      }

      // Create appointment (saving to localStorage for demo)
      const appointment = {
        id: `demo-${Date.now()}`,
        patient_id: patientId || `demo-patient-${user.id}`,
        patient_name: `${profile.first_name} ${profile.last_name}`,
        patient_email: profile.email,
        doctor_id: bookingDoctor.id,
        doctor_name: bookingDoctor.name,
        specialty: bookingDoctor.specialty,
        hospital: bookingDoctor.hospital,
        appointment_date: bookingForm.date,
        start_time: bookingForm.time,
        service_type: bookingForm.reason,
        notes: bookingForm.notes,
        symptoms: symptoms || '',
        status: 'scheduled',
        fee: bookingDoctor.consultationFee || 0,
        created_at: new Date().toISOString()
      };

      // Save to localStorage for demo
      const existingAppointments = JSON.parse(localStorage.getItem('demoAppointments') || '[]');
      existingAppointments.push(appointment);
      localStorage.setItem('demoAppointments', JSON.stringify(existingAppointments));

      setBookingSuccess(true);
      sonnerToast.success("Appointment Booked Successfully!", {
        description: `Your appointment with ${bookingDoctor.name} is confirmed for ${bookingForm.date} at ${bookingForm.time}`
      });

      // Reset form after 2 seconds and close dialog
      setTimeout(() => {
        setIsBookingOpen(false);
        setBookingDoctor(null);
        setShowReview(false);
      }, 2000);

    } catch (error) {
      console.error('Error booking appointment:', error);
      sonnerToast.error("Failed to book appointment", {
        description: error instanceof Error ? error.message : "Please try again or contact support"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 9; hour <= 17; hour++) {
      slots.push(`${hour.toString().padStart(2, '0')}:00`);
      if (hour < 17) {
        slots.push(`${hour.toString().padStart(2, '0')}:30`);
      }
    }
    return slots;
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'emergency': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-purple-500/5 to-pink-500/5">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-pink-500/5 to-purple-500/10" />
        <div className="container mx-auto px-4 lg:px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="mb-6 bg-gradient-to-r from-purple-500 to-pink-500 text-white">
              <Activity className="w-4 h-4 mr-2" />
              AI-Powered Analysis
            </Badge>
            <div className="w-20 h-20 mx-auto mb-6 rounded-3xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-2xl">
              <FileSearch className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500 bg-clip-text text-transparent">
              AI Symptom Analyzer
            </h1>
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              Advanced AI-powered symptom checker that analyzes your health concerns and suggests appropriate medical specialties
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-purple-500 to-pink-500 text-white"
                onClick={handleAnalyzeNow}
              >
                <FileSearch className="w-5 h-5 mr-2" />
                Analyze Symptoms Now
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link to="/" className="flex items-center">
                  Try on Homepage
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Symptom Analyzer Form */}
      {showAnalyzer && (
        <section className="py-16 bg-background/50" id="symptom-form">
          <div className="container mx-auto px-4 lg:px-6">
            <div className="max-w-4xl mx-auto">
              <Card className="border-2 border-purple-500/20">
                <CardHeader>
                  <CardTitle className="text-2xl flex items-center gap-2">
                    <Brain className="w-6 h-6 text-purple-500" />
                    Describe Your Symptoms
                  </CardTitle>
                  <CardDescription>
                    Be as detailed as possible. Include when symptoms started, severity, and any factors that make them better or worse.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <Textarea
                      placeholder="Example: I've been experiencing a persistent headache for 3 days, mainly on the right side of my head. The pain gets worse in the afternoon and I sometimes feel nauseous..."
                      className="min-h-[150px] resize-none"
                      value={symptoms}
                      onChange={(e) => setSymptoms(e.target.value)}
                      disabled={isAnalyzing}
                    />
                  </div>

                  <Button 
                    onClick={handleAnalyzeSymptoms}
                    disabled={isAnalyzing || !symptoms.trim()}
                    className="w-full bg-gradient-to-r from-purple-500 to-pink-500"
                    size="lg"
                  >
                    {isAnalyzing ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Analyzing Symptoms...
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5 mr-2" />
                        Analyze Symptoms
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>

              {/* Analysis Results */}
              {analysis && (
                <div className="mt-8 space-y-4 animate-in fade-in slide-in-from-bottom-4">
                  {/* Urgency Badge */}
                  <Card className="border-2">
                    <CardContent className="pt-6">
                      <div className="flex items-center gap-3">
                        <Badge className={`${getUrgencyColor(analysis.urgency)} text-white px-4 py-2 text-lg`}>
                          {analysis.urgency.toUpperCase()} URGENCY
                        </Badge>
                        <span className="text-muted-foreground">
                          {analysis.urgency === 'emergency' && '🚨 Seek immediate medical attention'}
                          {analysis.urgency === 'high' && '⚠️ Consult a doctor soon'}
                          {analysis.urgency === 'medium' && '📋 Schedule an appointment'}
                          {analysis.urgency === 'low' && '✓ Monitor symptoms'}
                        </span>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Possible Conditions */}
                  <Card className="border-2 border-purple-500/20">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Activity className="w-5 h-5 text-purple-500" />
                        Possible Conditions
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {analysis.possibleConditions.map((condition, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <CheckCircle className="w-5 h-5 text-purple-500 mt-0.5" />
                            <span>{condition}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>

                  {/* Specialist Recommendation */}
                  <Card className="border-2 border-pink-500/20">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Brain className="w-5 h-5 text-pink-500" />
                        Recommended Specialist
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-full bg-pink-500/10 flex items-center justify-center">
                            <Activity className="w-6 h-6 text-pink-500" />
                          </div>
                          <div>
                            <p className="font-semibold text-lg">{analysis.specialist}</p>
                            <p className="text-sm text-muted-foreground">Based on your symptoms</p>
                          </div>
                        </div>
                      </div>
                      {analysis.explanation && (
                        <p className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-lg">
                          {analysis.explanation}
                        </p>
                      )}
                    </CardContent>
                  </Card>

                  {/* Recommended Doctors */}
                  {recommendedDoctors.length > 0 && (
                    <Card className="border-2 border-blue-500/20">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <User className="w-5 h-5 text-blue-500" />
                          Recommended Doctors for You
                        </CardTitle>
                        <CardDescription>
                          Top {analysis.specialist}s available for consultation
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {recommendedDoctors.map((doctor) => (
                          <Card key={doctor.id} className="border hover:border-blue-500/50 transition-colors">
                            <CardContent className="p-4">
                              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                <div className="flex items-start gap-4">
                                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-xl flex-shrink-0">
                                    {doctor.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <h3 className="font-semibold text-lg">{doctor.name}</h3>
                                    <p className="text-sm text-muted-foreground">{doctor.specialty}</p>
                                    <p className="text-sm text-muted-foreground">{doctor.hospital}</p>
                                    <div className="flex flex-wrap items-center gap-3 mt-2">
                                      <Badge variant="secondary" className="text-xs">
                                        {doctor.experience} years exp.
                                      </Badge>
                                      <div className="flex items-center gap-1 text-yellow-500 text-sm">
                                        <Star className="w-4 h-4 fill-current" />
                                        <span className="font-medium">4.8</span>
                                      </div>
                                      <span className="text-sm font-semibold text-primary">
                                        ₹{doctor.consultationFee}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                                <Button 
                                  className="w-full md:w-auto"
                                  onClick={() => handleBookAppointment(doctor)}
                                >
                                  <Calendar className="w-4 h-4 mr-2" />
                                  Book Appointment
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                        
                        <Button 
                          variant="outline" 
                          className="w-full"
                          onClick={() => navigate('/doctors', { 
                            state: { specialty: analysis.specialist } 
                          })}
                        >
                          View All {analysis.specialist}s
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                      </CardContent>
                    </Card>
                  )}

                  {/* Recommendations */}
                  <Card className="border-2 border-blue-500/20">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-blue-500" />
                        Recommendations
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {analysis.recommendations.map((rec, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <CheckCircle className="w-5 h-5 text-blue-500 mt-0.5" />
                            <span>{rec}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>

                  {/* Next Steps */}
                  <Card className="border-2 border-green-500/20">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <ArrowRight className="w-5 h-5 text-green-500" />
                        Next Steps
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ol className="space-y-3">
                        {analysis.nextSteps.map((step, index) => (
                          <li key={index} className="flex items-start gap-3">
                            <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-500 text-white flex items-center justify-center text-sm font-bold">
                              {index + 1}
                            </div>
                            <span className="pt-0.5">{step}</span>
                          </li>
                        ))}
                      </ol>
                    </CardContent>
                  </Card>

                  {/* Analyze Again Button */}
                  <div className="flex gap-4">
                    <Button 
                      variant="outline" 
                      onClick={() => {
                        setSymptoms("");
                        setAnalysis(null);
                        setTimeout(() => {
                          document.getElementById('symptom-form')?.scrollIntoView({ behavior: 'smooth' });
                        }, 100);
                      }}
                      className="flex-1"
                    >
                      Analyze Different Symptoms
                    </Button>
                    <Button asChild className="flex-1">
                      <Link to="/booking">Find a Doctor</Link>
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Features Grid */}
      <section className="py-16 bg-background/50">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Smart Analysis Features</h2>
            <p className="text-muted-foreground text-lg">Comprehensive symptom evaluation powered by AI</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-2 hover:shadow-xl transition-all duration-300">
              <CardHeader>
                <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center mb-4">
                  <Brain className="w-6 h-6 text-purple-500" />
                </div>
                <CardTitle>Smart Analysis</CardTitle>
                <CardDescription>
                  AI evaluates your symptoms using advanced medical knowledge and pattern recognition
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 hover:shadow-xl transition-all duration-300">
              <CardHeader>
                <div className="w-12 h-12 rounded-xl bg-pink-500/10 flex items-center justify-center mb-4">
                  <AlertCircle className="w-6 h-6 text-pink-500" />
                </div>
                <CardTitle>Urgency Detection</CardTitle>
                <CardDescription>
                  Identifies the severity of symptoms and recommends appropriate urgency level for care
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 hover:shadow-xl transition-all duration-300">
              <CardHeader>
                <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center mb-4">
                  <CheckCircle className="w-6 h-6 text-blue-500" />
                </div>
                <CardTitle>Doctor Recommendations</CardTitle>
                <CardDescription>
                  Get matched with the right medical specialists based on your specific symptoms
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">How Symptom Analysis Works</h2>
            
            <div className="space-y-8">
              <div className="flex gap-6 items-start">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white flex items-center justify-center font-bold text-lg">
                  1
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">Describe Your Symptoms</h3>
                  <p className="text-muted-foreground">
                    Enter your symptoms in natural language. Be as detailed as possible about what you're experiencing, when it started, and any factors that make it better or worse.
                  </p>
                </div>
              </div>

              <div className="flex gap-6 items-start">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white flex items-center justify-center font-bold text-lg">
                  2
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">AI Processes Information</h3>
                  <p className="text-muted-foreground">
                    Our advanced AI analyzes your symptoms against a vast medical database, considering patterns, correlations, and potential conditions.
                  </p>
                </div>
              </div>

              <div className="flex gap-6 items-start">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white flex items-center justify-center font-bold text-lg">
                  3
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">Receive Assessment</h3>
                  <p className="text-muted-foreground">
                    Get a detailed analysis including possible conditions, urgency level, recommended actions, and suggestions for which type of doctor to consult.
                  </p>
                </div>
              </div>

              <div className="flex gap-6 items-start">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white flex items-center justify-center font-bold text-lg">
                  4
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">Take Action</h3>
                  <p className="text-muted-foreground">
                    Based on the analysis, book an appointment with the recommended specialist or get guidance on home care and monitoring.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Important Notice */}
      <section className="py-16 bg-gradient-to-br from-amber-500/5 to-orange-500/5">
        <div className="container mx-auto px-4 lg:px-6">
          <Card className="max-w-3xl mx-auto border-amber-500/50 bg-amber-50 dark:bg-amber-950/20">
            <CardHeader>
              <div className="flex items-center gap-4">
                <AlertCircle className="w-8 h-8 text-amber-600" />
                <div>
                  <CardTitle className="text-amber-900 dark:text-amber-100">Important Medical Disclaimer</CardTitle>
                  <CardDescription className="text-amber-800 dark:text-amber-200 mt-2">
                    The AI Symptom Analyzer is designed to provide helpful health information and guidance, but it is NOT a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition. If you think you may have a medical emergency, call your doctor or emergency services immediately.
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-purple-500 to-pink-500 text-white">
        <div className="container mx-auto px-4 lg:px-6 text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Analyze Your Symptoms?</h2>
          <p className="text-xl mb-8 opacity-90">
            Get instant AI-powered insights into your health concerns
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" className="text-lg px-8">
              <Link to="/#symptom-checker" className="flex items-center">
                Start Analysis
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="bg-white/10 border-white text-white hover:bg-white/20">
              <Link to="/booking" className="flex items-center">
                Book Doctor Appointment
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Booking Dialog */}
      <Dialog open={isBookingOpen} onOpenChange={setIsBookingOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          {!bookingSuccess ? (
            <>
              <DialogHeader>
                <DialogTitle className="text-2xl">
                  {showReview ? "Review Your Appointment" : "Book Appointment"}
                </DialogTitle>
                <DialogDescription>
                  {showReview 
                    ? "Please review all details before confirming" 
                    : `Schedule your consultation with ${bookingDoctor?.name}`}
                </DialogDescription>
              </DialogHeader>

              {bookingDoctor && !showReview && (
                <div className="space-y-6">
                  {/* Doctor Info */}
                  <Card className="bg-muted/50">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-4">
                        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                          <User className="w-8 h-8 text-primary" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg">{bookingDoctor.name}</h3>
                          <p className="text-sm text-muted-foreground">{bookingDoctor.specialty}</p>
                          <p className="text-sm text-muted-foreground">{bookingDoctor.hospital}</p>
                          <div className="flex items-center gap-4 mt-2">
                            <Badge variant="secondary">{bookingDoctor.experience} years exp.</Badge>
                            <span className="text-sm font-semibold text-primary">
                              ₹{bookingDoctor.consultationFee || 0}
                            </span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Symptom Context */}
                  {symptoms && (
                    <Card className="bg-amber-50 dark:bg-amber-950/20 border-amber-200">
                      <CardContent className="p-4">
                        <h4 className="font-semibold mb-2 flex items-center text-amber-900 dark:text-amber-100">
                          <Activity className="w-4 h-4 mr-2" />
                          Your Reported Symptoms
                        </h4>
                        <p className="text-sm text-amber-800 dark:text-amber-200">{symptoms}</p>
                      </CardContent>
                    </Card>
                  )}

                  {/* Booking Form */}
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="date">
                          <Calendar className="w-4 h-4 inline mr-2" />
                          Appointment Date
                        </Label>
                        <Input
                          id="date"
                          type="date"
                          value={bookingForm.date}
                          min={new Date().toISOString().split('T')[0]}
                          onChange={(e) => setBookingForm({ ...bookingForm, date: e.target.value })}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="time">
                          <Clock className="w-4 h-4 inline mr-2" />
                          Time Slot
                        </Label>
                        <Select 
                          value={bookingForm.time} 
                          onValueChange={(value) => setBookingForm({ ...bookingForm, time: value })}
                        >
                          <SelectTrigger id="time">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {generateTimeSlots().map((slot) => (
                              <SelectItem key={slot} value={slot}>
                                {slot}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="reason">Reason for Visit *</Label>
                      <Input
                        id="reason"
                        placeholder="e.g., Follow-up for symptoms..."
                        value={bookingForm.reason}
                        onChange={(e) => setBookingForm({ ...bookingForm, reason: e.target.value })}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="notes">Additional Notes</Label>
                      <Textarea
                        id="notes"
                        placeholder="Any additional information..."
                        value={bookingForm.notes}
                        onChange={(e) => setBookingForm({ ...bookingForm, notes: e.target.value })}
                        rows={3}
                      />
                    </div>
                  </div>

                  {/* Patient Info */}
                  <Card className="bg-blue-50 dark:bg-blue-950/20 border-blue-200">
                    <CardContent className="p-4">
                      <h4 className="font-semibold mb-2 flex items-center">
                        <User className="w-4 h-4 mr-2" />
                        Patient Information
                      </h4>
                      <div className="text-sm space-y-1">
                        <p><strong>Name:</strong> {profile?.first_name} {profile?.last_name}</p>
                        <p><strong>Email:</strong> {profile?.email}</p>
                        {profile?.phone && <p><strong>Phone:</strong> {profile?.phone}</p>}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Action Buttons */}
                  <div className="flex gap-3 pt-4">
                    <Button
                      variant="outline"
                      onClick={() => setIsBookingOpen(false)}
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleProceedToReview}
                      disabled={!bookingForm.reason.trim()}
                      className="flex-1"
                    >
                      <ArrowRight className="w-4 h-4 mr-2" />
                      Review Booking
                    </Button>
                  </div>
                </div>
              )}

              {/* Review Screen */}
              {bookingDoctor && showReview && (
                <div className="space-y-6">
                  {/* Appointment Summary */}
                  <Card className="border-2 border-primary/20">
                    <CardHeader className="bg-primary/5">
                      <CardTitle className="flex items-center gap-2">
                        <CheckCircle className="w-5 h-5 text-primary" />
                        Appointment Summary
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6 space-y-4">
                      {/* Doctor Details */}
                      <div className="space-y-3">
                        <h4 className="font-semibold text-sm text-muted-foreground uppercase">Doctor Details</h4>
                        <div className="flex items-start gap-4 p-4 bg-muted/50 rounded-lg">
                          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                            <User className="w-8 h-8 text-primary" />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-bold text-lg">{bookingDoctor.name}</h3>
                            <p className="text-sm text-muted-foreground">{bookingDoctor.specialty}</p>
                            <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                              <MapPin className="w-3 h-3" />
                              {bookingDoctor.hospital}
                            </p>
                            <div className="flex items-center gap-3 mt-2">
                              <Badge variant="secondary" className="text-xs">
                                <Award className="w-3 h-3 mr-1" />
                                {bookingDoctor.experience} years
                              </Badge>
                              <span className="text-sm">
                                <Phone className="w-3 h-3 inline mr-1" />
                                {bookingDoctor.phone}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Symptom Context */}
                      {symptoms && (
                        <div className="space-y-3">
                          <h4 className="font-semibold text-sm text-muted-foreground uppercase">Your Symptoms</h4>
                          <div className="p-4 bg-amber-50 dark:bg-amber-950/20 rounded-lg border-2 border-amber-200/50">
                            <div className="flex gap-2">
                              <Activity className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                              <p className="text-sm text-amber-900 dark:text-amber-100">{symptoms}</p>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Appointment Details */}
                      <div className="space-y-3">
                        <h4 className="font-semibold text-sm text-muted-foreground uppercase">Appointment Details</h4>
                        <div className="grid gap-3">
                          <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                            <div className="flex items-center gap-2">
                              <Calendar className="w-5 h-5 text-blue-600" />
                              <span className="font-medium">Date</span>
                            </div>
                            <span className="font-bold">
                              {new Date(bookingForm.date).toLocaleDateString('en-US', { 
                                weekday: 'short',
                                year: 'numeric', 
                                month: 'short', 
                                day: 'numeric' 
                              })}
                            </span>
                          </div>
                          <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-950/20 rounded-lg">
                            <div className="flex items-center gap-2">
                              <Clock className="w-5 h-5 text-green-600" />
                              <span className="font-medium">Time</span>
                            </div>
                            <span className="font-bold">{bookingForm.time}</span>
                          </div>
                          <div className="flex items-start justify-between p-3 bg-purple-50 dark:bg-purple-950/20 rounded-lg">
                            <div className="flex items-center gap-2">
                              <Activity className="w-5 h-5 text-purple-600" />
                              <span className="font-medium">Reason</span>
                            </div>
                            <span className="font-semibold text-right max-w-[60%]">{bookingForm.reason}</span>
                          </div>
                          {bookingForm.notes && (
                            <div className="flex items-start justify-between p-3 bg-amber-50 dark:bg-amber-950/20 rounded-lg">
                              <div className="flex items-center gap-2">
                                <AlertCircle className="w-5 h-5 text-amber-600" />
                                <span className="font-medium">Notes</span>
                              </div>
                              <span className="text-sm text-right max-w-[60%]">{bookingForm.notes}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Patient Information */}
                      <div className="space-y-3">
                        <h4 className="font-semibold text-sm text-muted-foreground uppercase">Patient Information</h4>
                        <div className="p-4 bg-muted/50 rounded-lg space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm text-muted-foreground">Name:</span>
                            <span className="font-semibold">{profile?.first_name} {profile?.last_name}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-muted-foreground">Email:</span>
                            <span className="font-semibold">{profile?.email}</span>
                          </div>
                          {profile?.phone && (
                            <div className="flex justify-between">
                              <span className="text-sm text-muted-foreground">Phone:</span>
                              <span className="font-semibold">{profile?.phone}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Consultation Fee */}
                      <div className="space-y-3">
                        <h4 className="font-semibold text-sm text-muted-foreground uppercase">Payment Details</h4>
                        <div className="flex items-center justify-between p-4 bg-gradient-to-r from-primary/10 to-primary/5 rounded-lg border-2 border-primary/20">
                          <span className="font-semibold text-lg">Consultation Fee</span>
                          <span className="font-bold text-2xl text-primary">₹{bookingDoctor.consultationFee || 0}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Important Notice */}
                  <Card className="border-amber-500/50 bg-amber-50 dark:bg-amber-950/20">
                    <CardContent className="p-4">
                      <div className="flex gap-3">
                        <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                        <div className="text-sm space-y-1">
                          <p className="font-semibold text-amber-900 dark:text-amber-100">Important Notes:</p>
                          <ul className="list-disc list-inside text-amber-800 dark:text-amber-200 space-y-1">
                            <li>Please arrive 10 minutes before your appointment time</li>
                            <li>Bring any relevant medical records or test results</li>
                            <li>You can reschedule or cancel up to 2 hours before the appointment</li>
                          </ul>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Action Buttons */}
                  <div className="flex gap-3 pt-4">
                    <Button
                      variant="outline"
                      onClick={handleEditBooking}
                      disabled={isSubmitting}
                      className="flex-1"
                    >
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Edit Details
                    </Button>
                    <Button
                      onClick={handleSubmitBooking}
                      disabled={isSubmitting}
                      className="flex-1 bg-gradient-to-r from-primary to-primary/80"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Confirming...
                        </>
                      ) : (
                        <>
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Confirm Booking
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-2xl font-bold mb-2">Booking Confirmed!</h3>
              <p className="text-muted-foreground mb-4">
                Your appointment with {bookingDoctor?.name} has been successfully scheduled.
              </p>
              <div className="bg-muted p-4 rounded-lg mb-4">
                <p className="font-semibold">
                  {new Date(bookingForm.date).toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </p>
                <p className="text-lg font-bold text-primary">{bookingForm.time}</p>
              </div>
              <p className="text-sm text-muted-foreground">
                You can view your appointments in the Account section.
              </p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
