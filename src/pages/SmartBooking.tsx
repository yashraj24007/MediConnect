import { Calendar, Sparkles, Clock, CheckCircle, Users, TrendingUp, ArrowRight, Send, Loader2, Brain, Star, MapPin, Phone, Award, User, Activity, AlertCircle, ArrowLeft } from "lucide-react";
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
import { doctors, Doctor } from "@/data/doctors";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast as sonnerToast } from "sonner";

interface DoctorRecommendation {
  specialty: string;
  reason: string;
  urgency: string;
  keywords: string[];
}

export default function SmartBooking() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, profile } = useAuth();
  const [healthConcern, setHealthConcern] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [recommendation, setRecommendation] = useState<DoctorRecommendation | null>(null);
  const [showAdvisor, setShowAdvisor] = useState(false);
  const [matchedDoctors, setMatchedDoctors] = useState<Doctor[]>([]);
  
  // Booking dialog state
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

  const handleGetRecommendation = async () => {
    if (!healthConcern.trim()) {
      toast({
        title: "Please describe your health concern",
        description: "Tell us what you need help with to get personalized recommendations",
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
    setRecommendation(null);

    try {
      const prompt = `As a medical consultation advisor AI, analyze the following health concern and recommend the appropriate medical specialty.

Health Concern: ${healthConcern}

Provide your response in this JSON format (ensure valid JSON):
{
  "specialty": "Cardiologist",
  "reason": "Your symptoms suggest a cardiovascular issue that requires specialist evaluation",
  "urgency": "Schedule within 1-2 weeks",
  "keywords": ["heart health", "chest pain", "cardiovascular"]
}

Important:
- Specialty should be a specific medical specialty (Cardiologist, Dermatologist, Orthopedist, etc.)
- Reason should explain why this specialty is recommended
- Urgency should indicate timing (Immediate/Same day, Within 24-48 hours, Within 1 week, Routine checkup)
- Keywords should be relevant terms for filtering doctors
- Return ONLY valid JSON, no extra text`;

      const response = await GroqChatService.sendMessage(prompt, []);
      
      // Extract JSON from response
      let jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        try {
          const result = JSON.parse(jsonMatch[0]);
          setRecommendation(result);
          
          // Find matching doctors based on specialty
          const matched = doctors.filter(doctor => 
            doctor.specialty.toLowerCase().includes(result.specialty.toLowerCase()) ||
            result.specialty.toLowerCase().includes(doctor.specialty.toLowerCase())
          );
          
          // If no exact match, try to find by keywords in expertise
          if (matched.length === 0) {
            const keywordMatched = doctors.filter(doctor => 
              result.keywords.some(keyword => 
                doctor.expertise.some(exp => 
                  exp.toLowerCase().includes(keyword.toLowerCase())
                )
              )
            );
            setMatchedDoctors(keywordMatched.slice(0, 3));
          } else {
            setMatchedDoctors(matched.slice(0, 3));
          }
          
          toast({
            title: "✅ Recommendation Ready",
            description: `We recommend booking with a ${result.specialty}`,
          });

          // Scroll to recommendations
          setTimeout(() => {
            document.getElementById('doctor-recommendations')?.scrollIntoView({ behavior: 'smooth' });
          }, 300);
        } catch (parseError) {
          console.error("JSON parsing error:", parseError);
          throw new Error("Failed to parse AI response");
        }
      } else {
        throw new Error("No valid JSON found in response");
      }
    } catch (error) {
      console.error("Error getting recommendation:", error);
      toast({
        title: "Analysis Failed",
        description: "Unable to process your request. Please try again or book directly.",
        variant: "destructive"
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleStartAdvisor = () => {
    setShowAdvisor(true);
    setTimeout(() => {
      document.getElementById('booking-advisor')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
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
      reason: healthConcern || "Smart booking consultation",
      notes: healthConcern ? `Health concern: ${healthConcern}` : ""
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
          .maybeSingle();

        if (patientData) {
          patientId = patientData.id;
        } else if (!fetchError) {
          const { data: newPatient, error: patientError } = await supabase
            .from('patients')
            .insert({ profile_id: profile.id })
            .select('id')
            .single();

          if (!patientError && newPatient) {
            patientId = newPatient.id;
          } else {
            console.warn('Could not create patient record:', patientError);
          }
        }
      } catch (dbError) {
        console.warn('Database operation failed, using demo mode:', dbError);
      }

      // Create appointment
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
        health_concern: healthConcern || '',
        status: 'scheduled',
        fee: bookingDoctor.consultationFee || 0,
        created_at: new Date().toISOString()
      };

      const existingAppointments = JSON.parse(localStorage.getItem('demoAppointments') || '[]');
      existingAppointments.push(appointment);
      localStorage.setItem('demoAppointments', JSON.stringify(existingAppointments));

      setBookingSuccess(true);
      sonnerToast.success("Appointment Booked Successfully!", {
        description: `Your appointment with ${bookingDoctor.name} is confirmed for ${bookingForm.date} at ${bookingForm.time}`
      });

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
              Intelligent appointment scheduling with automatic time optimization, conflict prevention, and seamless doctor availability matching
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-xl hover:shadow-2xl transition-all"
                onClick={() => navigate('/booking')}
              >
                <Calendar className="w-5 h-5 mr-2" />
                Book Appointment Now
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                onClick={handleStartAdvisor}
              >
                <Brain className="w-5 h-5 mr-2" />
                Get AI Recommendation
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

      {/* AI Booking Advisor */}
      {showAdvisor && (
        <section id="booking-advisor" className="py-16 bg-gradient-to-br from-green-500/10 to-emerald-500/10">
          <div className="container mx-auto px-4 lg:px-6">
            <div className="max-w-3xl mx-auto">
              <Card className="border-2 border-green-500/30 shadow-xl">
                <CardHeader className="text-center">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
                    <Brain className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle className="text-2xl">AI Booking Advisor</CardTitle>
                  <CardDescription>
                    Tell us about your health concern and we'll recommend the right specialist
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Describe your health concern</label>
                    <Textarea
                      placeholder="E.g., I have been experiencing persistent headaches and dizziness for the past week..."
                      value={healthConcern}
                      onChange={(e) => setHealthConcern(e.target.value)}
                      rows={5}
                      className="resize-none"
                      disabled={isAnalyzing}
                    />
                  </div>

                  <Button 
                    onClick={handleGetRecommendation}
                    disabled={isAnalyzing || !healthConcern.trim()}
                    size="lg"
                    className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
                  >
                    {isAnalyzing ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Analyzing...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-5 h-5 mr-2" />
                        Get AI Recommendation
                      </>
                    )}
                  </Button>

                  {recommendation && (
                    <div className="mt-6 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                      <div className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 rounded-lg border-2 border-green-500/30 space-y-4">
                        <div className="flex items-start gap-3">
                          <CheckCircle className="w-6 h-6 text-green-500 mt-1 flex-shrink-0" />
                          <div className="flex-1">
                            <h4 className="font-bold text-lg mb-2 text-green-700 dark:text-green-400">
                              Recommended Specialist: {recommendation.specialty}
                            </h4>
                            <p className="text-muted-foreground mb-3">{recommendation.reason}</p>
                            
                            <div className="grid grid-cols-1 gap-3 mb-4">
                              <div className="flex items-center gap-2 text-sm">
                                <Clock className="w-4 h-4 text-orange-500" />
                                <span className="font-medium">Urgency:</span>
                                <span className="text-muted-foreground">{recommendation.urgency}</span>
                              </div>
                            </div>

                            {recommendation.keywords && recommendation.keywords.length > 0 && (
                              <div className="flex flex-wrap gap-2">
                                {recommendation.keywords.map((keyword, idx) => (
                                  <Badge key={idx} variant="secondary" className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400">
                                    {keyword}
                                  </Badge>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Matched Doctors Section */}
                      {matchedDoctors.length > 0 && (
                        <div id="doctor-recommendations" className="space-y-4">
                          <h4 className="text-xl font-bold text-center">
                            Available {recommendation.specialty}s
                          </h4>
                          <div className="grid gap-6">
                            {matchedDoctors.map((doctor) => (
                              <Card key={doctor.id} className="border-2 border-green-500/20 hover:border-green-500/40 transition-all duration-300 hover:shadow-lg">
                                <CardContent className="p-6">
                                  <div className="flex flex-col md:flex-row gap-6">
                                    {/* Doctor Image */}
                                    <div className="flex-shrink-0">
                                      <div className="w-24 h-24 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center text-white text-3xl font-bold">
                                        {doctor.name.split(' ').map(n => n[0]).join('')}
                                      </div>
                                    </div>

                                    {/* Doctor Details */}
                                    <div className="flex-1 space-y-3">
                                      <div>
                                        <h5 className="text-xl font-bold text-foreground mb-1">{doctor.name}</h5>
                                        <p className="text-sm text-muted-foreground">{doctor.qualification}</p>
                                      </div>

                                      <div className="flex flex-wrap gap-3">
                                        <Badge className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                                          {doctor.specialty}
                                        </Badge>
                                        <Badge variant="outline" className="flex items-center gap-1">
                                          <Award className="w-3 h-3" />
                                          {doctor.experience} years exp
                                        </Badge>
                                      </div>

                                      <div className="flex flex-col gap-2 text-sm text-muted-foreground">
                                        <div className="flex items-center gap-2">
                                          <MapPin className="w-4 h-4 text-green-500" />
                                          <span>{doctor.hospital}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                          <Phone className="w-4 h-4 text-green-500" />
                                          <span>{doctor.phone}</span>
                                        </div>
                                      </div>

                                      <div className="flex flex-wrap gap-2">
                                        {doctor.expertise.slice(0, 3).map((exp, idx) => (
                                          <Badge key={idx} variant="secondary" className="text-xs">
                                            {exp}
                                          </Badge>
                                        ))}
                                      </div>

                                      <div className="flex items-center justify-between pt-3 border-t">
                                        <div className="text-lg font-bold text-green-600">
                                          ₹{doctor.consultationFee}
                                          <span className="text-sm font-normal text-muted-foreground"> / consultation</span>
                                        </div>
                                        <div className="flex gap-2">
                                          <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => navigate(`/doctors/${doctor.id}`)}
                                          >
                                            View Profile
                                          </Button>
                                          <Button
                                            size="sm"
                                            className="bg-gradient-to-r from-green-500 to-emerald-500"
                                            onClick={() => handleBookAppointment(doctor)}
                                          >
                                            <Calendar className="w-4 h-4 mr-2" />
                                            Book Now
                                          </Button>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </CardContent>
                              </Card>
                            ))}
                          </div>

                          <div className="text-center pt-4">
                            <Button
                              variant="outline"
                              onClick={() => navigate('/doctors')}
                              className="border-green-500 text-green-600 hover:bg-green-50 dark:hover:bg-green-950/20"
                            >
                              Browse All {recommendation.specialty}s
                              <ArrowRight className="w-4 h-4 ml-2" />
                            </Button>
                          </div>
                        </div>
                      )}

                      {matchedDoctors.length === 0 && (
                        <div className="text-center p-6 bg-muted/50 rounded-lg">
                          <p className="text-muted-foreground mb-4">
                            No {recommendation.specialty}s found in our database. Browse all doctors or book directly.
                          </p>
                          <div className="flex flex-col sm:flex-row gap-3 justify-center">
                            <Button
                              onClick={() => navigate('/booking')}
                              className="bg-gradient-to-r from-green-500 to-emerald-500"
                            >
                              <Calendar className="w-4 h-4 mr-2" />
                              Book Appointment
                            </Button>
                            <Button
                              onClick={() => navigate('/doctors')}
                              variant="outline"
                              className="border-green-500 text-green-600 hover:bg-green-50 dark:hover:bg-green-950/20"
                            >
                              Browse All Doctors
                              <ArrowRight className="w-4 h-4 ml-2" />
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      )}

      {/* What Makes It Smart */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              What Makes Our Booking <span className="text-gradient bg-gradient-to-r from-green-500 to-emerald-500 bg-clip-text text-transparent">Smart</span>?
            </h2>
            <p className="text-muted-foreground text-lg">
              No overlaps, no conflicts - just seamless scheduling powered by intelligent algorithms
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            <Card className="border-2 border-green-500/20">
              <CardHeader>
                <CheckCircle className="w-12 h-12 text-green-500 mb-4" />
                <CardTitle>Automatic Conflict Detection</CardTitle>
                <CardDescription>
                  Our system automatically prevents double-bookings and scheduling conflicts. You'll only see available time slots that work for both you and your doctor.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 border-emerald-500/20">
              <CardHeader>
                <Clock className="w-12 h-12 text-emerald-500 mb-4" />
                <CardTitle>Real-Time Availability</CardTitle>
                <CardDescription>
                  See live availability across all doctors and specialties. Our intelligent system updates in real-time to show you exactly what's open.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 border-teal-500/20">
              <CardHeader>
                <Calendar className="w-12 h-12 text-teal-500 mb-4" />
                <CardTitle>Time Optimization</CardTitle>
                <CardDescription>
                  Smart algorithms suggest optimal appointment times based on your preferences, doctor availability, and clinic schedules for maximum convenience.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 border-cyan-500/20">
              <CardHeader>
                <TrendingUp className="w-12 h-12 text-cyan-500 mb-4" />
                <CardTitle>Priority Scheduling</CardTitle>
                <CardDescription>
                  Urgent cases are automatically prioritized. Our system intelligently manages appointment queues to ensure critical needs are met promptly.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

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
            <Button 
              asChild 
              size="lg" 
              variant="secondary" 
              className="text-lg px-10 py-6 shadow-2xl hover:shadow-white/25 hover:scale-105 transition-all"
            >
              <Link to="/booking" className="flex items-center">
                <Calendar className="w-5 h-5 mr-2" />
                Book Appointment Now
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </Button>
            <Button 
              asChild 
              size="lg" 
              variant="outline" 
              className="bg-white/10 border-white text-white hover:bg-white/20"
            >
              <Link to="/doctors">
                Browse Specialists
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

                  {/* Health Concern Context */}
                  {healthConcern && (
                    <Card className="bg-amber-50 dark:bg-amber-950/20 border-amber-200">
                      <CardContent className="p-4">
                        <h4 className="font-semibold mb-2 flex items-center text-amber-900 dark:text-amber-100">
                          <Activity className="w-4 h-4 mr-2" />
                          Your Health Concern
                        </h4>
                        <p className="text-sm text-amber-800 dark:text-amber-200">{healthConcern}</p>
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
                        placeholder="e.g., Smart booking consultation..."
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

                      {/* Health Concern */}
                      {healthConcern && (
                        <div className="space-y-3">
                          <h4 className="font-semibold text-sm text-muted-foreground uppercase">Your Health Concern</h4>
                          <div className="p-4 bg-amber-50 dark:bg-amber-950/20 rounded-lg border-2 border-amber-200/50">
                            <div className="flex gap-2">
                              <Activity className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                              <p className="text-sm text-amber-900 dark:text-amber-100">{healthConcern}</p>
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
