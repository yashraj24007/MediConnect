import { Activity, TrendingUp, Heart, BarChart3, LineChart, PieChart, ArrowRight, Sparkles, Loader2, Send, Calendar, FileText, History } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Link } from "react-router-dom";
import { useEffect, useState, useCallback } from "react";
import { GroqChatService } from "@/services/groqService";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

interface HealthInsight {
  category: string;
  insight: string;
  recommendation: string;
  priority: 'low' | 'medium' | 'high';
}

interface Appointment {
  id: string;
  appointment_date: string;
  start_time: string;
  service_type?: string;
  status: string;
  fee: number;
  notes?: string;
  doctors?: {
    specialty: string;
    profiles?: {
      first_name: string;
      last_name: string;
    };
  };
}

export default function HealthInsights() {
  const { toast } = useToast();
  const { user, profile } = useAuth();
  const [healthData, setHealthData] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [insights, setInsights] = useState<HealthInsight[]>([]);
  const [showAnalyzer, setShowAnalyzer] = useState(false);
  const [overallScore, setOverallScore] = useState<number>(0);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoadingAppointments, setIsLoadingAppointments] = useState(false);
  const [useBookingData, setUseBookingData] = useState(false);

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const fetchAppointments = useCallback(async () => {
    if (!profile?.id) return;
    
    setIsLoadingAppointments(true);
    try {
      const { data: patientData } = await supabase
        .from('patients')
        .select('id')
        .eq('profile_id', profile.id)
        .maybeSingle();

      let allAppointments: any[] = [];

      // Fetch real appointments from database
      if (patientData) {
        const { data: appointmentsData } = await supabase
          .from('appointments')
          .select(`
            *,
            doctors (
              id,
              specialty,
              profiles (
                first_name,
                last_name
              )
            )
          `)
          .eq('patient_id', patientData.id)
          .order('appointment_date', { ascending: false });

        allAppointments = appointmentsData || [];
      }

      // Add demo appointments from localStorage
      const demoAppointments = JSON.parse(localStorage.getItem('demoAppointments') || '[]');
      const formattedDemoAppointments = demoAppointments.map((demo: any) => ({
        id: demo.id,
        appointment_date: demo.appointment_date,
        start_time: demo.start_time,
        service_type: demo.service_type,
        status: demo.status,
        fee: demo.fee,
        notes: demo.notes,
        doctors: {
          id: 'demo',
          specialty: demo.specialty,
          profiles: {
            first_name: demo.doctor_name.replace('Dr. ', '').split(' ')[0],
            last_name: demo.doctor_name.replace('Dr. ', '').split(' ')[1] || ''
          }
        }
      }));

      // Combine and sort all appointments
      allAppointments = [...allAppointments, ...formattedDemoAppointments].sort((a, b) => 
        new Date(b.appointment_date).getTime() - new Date(a.appointment_date).getTime()
      );

      setAppointments(allAppointments);
    } catch (error) {
      console.error('Error fetching appointments:', error);
      // Try to get demo appointments at least
      const demoAppointments = JSON.parse(localStorage.getItem('demoAppointments') || '[]');
      const formattedDemoAppointments = demoAppointments.map((demo: any) => ({
        id: demo.id,
        appointment_date: demo.appointment_date,
        start_time: demo.start_time,
        service_type: demo.service_type,
        status: demo.status,
        fee: demo.fee,
        notes: demo.notes,
        doctors: {
          specialty: demo.specialty,
          profiles: {
            first_name: demo.doctor_name.replace('Dr. ', '').split(' ')[0],
            last_name: demo.doctor_name.replace('Dr. ', '').split(' ')[1] || ''
          }
        }
      }));
      
      setAppointments(formattedDemoAppointments);
    } finally {
      setIsLoadingAppointments(false);
    }
  }, [profile?.id]);

  // Fetch appointments when component mounts
  useEffect(() => {
    if (user && profile) {
      fetchAppointments();
    }
  }, [user, profile, fetchAppointments]);

  const handleStartAnalyzer = () => {
    setShowAnalyzer(true);
    setTimeout(() => {
      document.getElementById('insights-form')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleAnalyzeFromBookings = async () => {
    if (appointments.length === 0) {
      toast({
        title: "No booking history found",
        description: "Book an appointment first to get insights from your medical history",
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
    setInsights([]);
    setOverallScore(0);
    setUseBookingData(true);

    try {
      // Format appointment data for analysis
      const appointmentSummary = appointments.map((apt, index) => {
        const doctorName = apt.doctors?.profiles 
          ? `Dr. ${apt.doctors.profiles.first_name} ${apt.doctors.profiles.last_name}`
          : 'Unknown Doctor';
        
        return `${index + 1}. ${new Date(apt.appointment_date).toLocaleDateString()} - ${doctorName} (${apt.doctors?.specialty || 'General'}) - Status: ${apt.status}${apt.notes ? ` - Notes: ${apt.notes}` : ''}`;
      }).join('\n');

      const prompt = `As a health analytics AI, analyze the following patient's medical appointment history and provide comprehensive health insights.

Patient's Medical History (${appointments.length} appointments):
${appointmentSummary}

Based on this appointment history, analyze:
1. Frequency and patterns of medical visits
2. Types of specialists consulted
3. Health concerns indicated by specialty visits
4. Overall health trajectory

Provide your response in this JSON format (ensure valid JSON):
{
  "overallScore": 75,
  "insights": [
    {
      "category": "Medical History Pattern",
      "insight": "Analysis of appointment frequency and specialist types",
      "recommendation": "Specific recommendations based on patterns",
      "priority": "medium"
    },
    {
      "category": "Preventive Care",
      "insight": "Insights about preventive measures needed",
      "recommendation": "Actionable preventive care steps",
      "priority": "high"
    }
  ]
}

Important:
- Overall score should be 0-100 based on appointment patterns and health trajectory
- Provide 4-6 insights about health patterns, preventive care, and recommendations
- Consider specialty visits (Cardiologist = heart health concerns, Orthopedic = bone/joint issues, etc.)
- Make recommendations specific and actionable
- Priority must be: low, medium, or high
- Return ONLY valid JSON, no extra text`;

      const response = await GroqChatService.sendMessage(prompt, []);
      
      // Extract JSON from response
      let jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        try {
          const result = JSON.parse(jsonMatch[0]);
          
          if (!result.insights || !Array.isArray(result.insights)) {
            throw new Error("Invalid response structure");
          }
          
          setInsights(result.insights || []);
          setOverallScore(result.overallScore || 70);
        } catch (parseError) {
          console.error("JSON parse error:", parseError);
          // Provide fallback insights
          setInsights([
            {
              category: "Medical History",
              insight: `You have ${appointments.length} appointments in your history`,
              recommendation: "Continue regular health checkups and maintain good health practices",
              priority: "medium"
            }
          ]);
          setOverallScore(70);
        }
      } else {
        throw new Error("No JSON found in response");
      }
    } catch (error) {
      console.error("Error analyzing booking history:", error);
      toast({
        title: "Analysis Error",
        description: "Unable to generate insights from booking history. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleAnalyzeHealth = async () => {
    if (!healthData.trim()) {
      toast({
        title: "Please provide health information",
        description: "Enter your health data to get personalized insights",
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
    setInsights([]);
    setOverallScore(0);
    setUseBookingData(false);

    try {
      const prompt = `As a health analytics AI, analyze the following health information and provide personalized insights.

Health Data: ${healthData}

Provide your response in this JSON format (ensure valid JSON):
{
  "overallScore": 75,
  "insights": [
    {
      "category": "Nutrition",
      "insight": "Your diet includes home-cooked meals which is excellent",
      "recommendation": "Try to reduce evening snacking by having protein-rich dinner",
      "priority": "medium"
    },
    {
      "category": "Sleep",
      "insight": "Getting only 5-6 hours of sleep is below recommended 7-9 hours",
      "recommendation": "Establish a bedtime routine and aim for 7-8 hours of sleep",
      "priority": "high"
    }
  ]
}

Important:
- Overall score should be 0-100 based on health data
- Provide 3-5 insights across different categories (Nutrition, Exercise, Sleep, Stress, Vital Signs)
- Make recommendations specific and actionable
- Priority must be: low, medium, or high
- Return ONLY valid JSON, no extra text`;

      const response = await GroqChatService.sendMessage(prompt, []);
      
      // Extract JSON from response
      let jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        try {
          const result = JSON.parse(jsonMatch[0]);
          
          if (!result.insights || !Array.isArray(result.insights)) {
            throw new Error("Invalid response structure");
          }
          
          setInsights(result.insights || []);
          setOverallScore(result.overallScore || 70);
        } catch (parseError) {
          console.error("JSON parse error:", parseError);
          // Provide fallback insights
          setInsights([
            {
              category: "General Health",
              insight: "Unable to generate detailed insights",
              recommendation: "Please consult with a healthcare professional for personalized health advice",
              priority: "medium"
            }
          ]);
          setOverallScore(70);
        }
      } else {
        throw new Error("No JSON found in response");
      }
    } catch (error) {
      console.error("Error analyzing health data:", error);
      toast({
        title: "Analysis Error",
        description: "Unable to generate health insights. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-500';
    if (score >= 60) return 'text-yellow-500';
    if (score >= 40) return 'text-orange-500';
    return 'text-red-500';
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'nutrition': return '🥗';
      case 'exercise': return '💪';
      case 'sleep': return '😴';
      case 'stress': return '🧘';
      case 'vital signs': return '❤️';
      default: return '📊';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-orange-500/5 to-red-500/5">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 via-red-500/5 to-orange-500/10" />
        <div className="container mx-auto px-4 lg:px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="mb-6 bg-gradient-to-r from-orange-500 to-red-500 text-white">
              <TrendingUp className="w-4 h-4 mr-2" />
              Analytics Powered
            </Badge>
            <div className="w-20 h-20 mx-auto mb-6 rounded-3xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center shadow-2xl">
              <Activity className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-orange-500 via-red-500 to-orange-500 bg-clip-text text-transparent">
              Health Insights Dashboard
            </h1>
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              Personalized health analytics and trends based on your medical history, appointments, and wellness data
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-gradient-to-r from-orange-500 to-red-500 text-white" onClick={handleStartAnalyzer}>
                <Activity className="w-5 h-5 mr-2" />
                Get Health Insights
              </Button>
              {user && appointments.length > 0 && (
                <Button 
                  size="lg" 
                  variant="outline"
                  onClick={() => {
                    setShowAnalyzer(true);
                    setTimeout(() => {
                      handleAnalyzeFromBookings();
                      document.getElementById('insights-form')?.scrollIntoView({ behavior: 'smooth' });
                    }, 100);
                  }}
                  disabled={isLoadingAppointments}
                  className="border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white"
                >
                  <History className="w-5 h-5 mr-2" />
                  Insights from Bookings ({appointments.length})
                </Button>
              )}
              <Button size="lg" variant="outline" asChild>
                <Link to="/about">
                  Learn More
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Health Insights Analyzer */}
      {showAnalyzer && (
        <section className="py-16 bg-background/50" id="insights-form">
          <div className="container mx-auto px-4 lg:px-6">
            <div className="max-w-4xl mx-auto">
              <Card className="border-2 border-orange-500/20">
                <CardHeader>
                  <CardTitle className="text-2xl flex items-center gap-2">
                    <Activity className="w-6 h-6 text-orange-500" />
                    Get Health Insights
                  </CardTitle>
                  <CardDescription>
                    Choose how you want to analyze your health data
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Option 1: Manual Entry */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <FileText className="w-5 h-5 text-orange-500" />
                      <h3 className="font-semibold">Enter Health Information Manually</h3>
                    </div>
                    <Textarea
                      placeholder="Example: I'm 35 years old, weigh 75kg. I exercise 3 times a week but struggle with sleep (5-6 hours). My blood pressure is usually around 130/85. I eat mostly home-cooked meals but snack a lot in the evening..."
                      className="min-h-[150px] resize-none"
                      value={healthData}
                      onChange={(e) => setHealthData(e.target.value)}
                      disabled={isAnalyzing}
                    />
                    <Button 
                      onClick={handleAnalyzeHealth}
                      disabled={isAnalyzing || !healthData.trim()}
                      className="w-full bg-gradient-to-r from-orange-500 to-red-500"
                      size="lg"
                    >
                      {isAnalyzing && !useBookingData ? (
                        <>
                          <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                          Analyzing Your Health...
                        </>
                      ) : (
                        <>
                          <Send className="w-5 h-5 mr-2" />
                          Generate Health Insights
                        </>
                      )}
                    </Button>
                  </div>

                  {/* Divider */}
                  {user && appointments.length > 0 && (
                    <>
                      <div className="relative">
                        <Separator />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="bg-card px-4 text-sm text-muted-foreground font-medium">OR</span>
                        </div>
                      </div>

                      {/* Option 2: From Bookings */}
                      <div className="space-y-4">
                        <div className="flex items-center gap-2">
                          <History className="w-5 h-5 text-orange-500" />
                          <h3 className="font-semibold">Analyze from Previous Bookings</h3>
                        </div>
                        
                        {/* Show booking summary */}
                        <div className="bg-muted/50 p-4 rounded-lg space-y-2">
                          <p className="text-sm text-muted-foreground">
                            You have <span className="font-bold text-foreground">{appointments.length}</span> appointment{appointments.length !== 1 ? 's' : ''} in your history
                          </p>
                          {appointments.slice(0, 3).map((apt, index) => (
                            <div key={apt.id} className="flex items-center gap-2 text-sm">
                              <Calendar className="w-4 h-4 text-orange-500" />
                              <span>{new Date(apt.appointment_date).toLocaleDateString()}</span>
                              <span className="text-muted-foreground">-</span>
                              <span>{apt.doctors?.specialty || 'General'}</span>
                              <Badge variant="secondary" className="text-xs">{apt.status}</Badge>
                            </div>
                          ))}
                          {appointments.length > 3 && (
                            <p className="text-xs text-muted-foreground">
                              And {appointments.length - 3} more...
                            </p>
                          )}
                        </div>

                        <Button 
                          onClick={handleAnalyzeFromBookings}
                          disabled={isAnalyzing}
                          variant="outline"
                          className="w-full border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white"
                          size="lg"
                        >
                          {isAnalyzing && useBookingData ? (
                            <>
                              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                              Analyzing Booking History...
                            </>
                          ) : (
                            <>
                              <History className="w-5 h-5 mr-2" />
                              Get Insights from Bookings
                            </>
                          )}
                        </Button>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>

              {/* Insights Results */}
              {insights.length > 0 && (
                <div className="mt-8 space-y-6 animate-in fade-in slide-in-from-bottom-4">
                  {/* Source Badge */}
                  <div className="flex justify-center">
                    <Badge className="bg-gradient-to-r from-orange-500 to-red-500 text-white text-sm py-2 px-4">
                      {useBookingData ? (
                        <>
                          <History className="w-4 h-4 mr-2" />
                          Insights from {appointments.length} Booking{appointments.length !== 1 ? 's' : ''}
                        </>
                      ) : (
                        <>
                          <FileText className="w-4 h-4 mr-2" />
                          Insights from Manual Entry
                        </>
                      )}
                    </Badge>
                  </div>

                  {/* Overall Health Score */}
                  <Card className="border-2 border-orange-500/20">
                    <CardContent className="pt-6">
                      <div className="text-center">
                        <h3 className="text-lg font-semibold mb-4">Your Overall Health Score</h3>
                        <div className={`text-6xl font-bold ${getScoreColor(overallScore)} mb-2`}>
                          {overallScore}
                        </div>
                        <p className="text-muted-foreground">
                          {overallScore >= 80 && "Excellent! Keep up the great work! 🎉"}
                          {overallScore >= 60 && overallScore < 80 && "Good progress, room for improvement 👍"}
                          {overallScore >= 40 && overallScore < 60 && "Moderate - Focus on key areas 📈"}
                          {overallScore < 40 && "Needs attention - Let's work on this together 💪"}
                        </p>
                        <div className="mt-4 h-3 bg-muted rounded-full overflow-hidden">
                          <div 
                            className={`h-full bg-gradient-to-r ${
                              overallScore >= 80 ? 'from-green-500 to-emerald-500' :
                              overallScore >= 60 ? 'from-yellow-500 to-orange-500' :
                              'from-orange-500 to-red-500'
                            }`}
                            style={{ width: `${overallScore}%` }}
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Individual Insights */}
                  <div className="space-y-4">
                    <h3 className="text-2xl font-bold">Personalized Health Insights</h3>
                    
                    {insights.map((insight, index) => (
                      <Card key={index} className="border-2">
                        <CardContent className="pt-6">
                          <div className="flex items-start gap-4">
                            <div className="text-4xl">{getCategoryIcon(insight.category)}</div>
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-3">
                                <h4 className="text-lg font-bold">{insight.category}</h4>
                                <Badge className={`${getPriorityColor(insight.priority)} text-white`}>
                                  {insight.priority.toUpperCase()} PRIORITY
                                </Badge>
                              </div>
                              
                              <div className="space-y-3">
                                <div>
                                  <p className="text-sm font-semibold text-muted-foreground mb-1">Insight:</p>
                                  <p className="text-foreground">{insight.insight}</p>
                                </div>
                                
                                <div className="bg-muted/50 p-3 rounded-lg">
                                  <p className="text-sm font-semibold text-primary mb-1">💡 Recommendation:</p>
                                  <p className="text-sm">{insight.recommendation}</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Button 
                      variant="outline" 
                      onClick={() => {
                        setHealthData("");
                        setInsights([]);
                        setOverallScore(0);
                        setUseBookingData(false);
                        setTimeout(() => {
                          document.getElementById('insights-form')?.scrollIntoView({ behavior: 'smooth' });
                        }, 100);
                      }}
                      className="flex-1"
                    >
                      <Activity className="w-4 h-4 mr-2" />
                      Analyze Again
                    </Button>
                    {useBookingData && (
                      <Button 
                        variant="outline"
                        onClick={() => {
                          setHealthData("");
                          setInsights([]);
                          setOverallScore(0);
                          setUseBookingData(false);
                        }}
                        className="flex-1 border-orange-500 text-orange-500"
                      >
                        <FileText className="w-4 h-4 mr-2" />
                        Try Manual Entry
                      </Button>
                    )}
                    <Button asChild className="flex-1 bg-gradient-to-r from-orange-500 to-red-500">
                      <Link to="/booking">
                        <Calendar className="w-4 h-4 mr-2" />
                        Book Health Checkup
                      </Link>
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
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Comprehensive Health Analytics</h2>
            <p className="text-muted-foreground text-lg">Turn your health data into actionable insights</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-2 hover:shadow-xl transition-all duration-300">
              <CardHeader>
                <div className="w-12 h-12 rounded-xl bg-orange-500/10 flex items-center justify-center mb-4">
                  <BarChart3 className="w-6 h-6 text-orange-500" />
                </div>
                <CardTitle>Data Visualization</CardTitle>
                <CardDescription>
                  Beautiful charts and graphs that make your health data easy to understand at a glance
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 hover:shadow-xl transition-all duration-300">
              <CardHeader>
                <div className="w-12 h-12 rounded-xl bg-red-500/10 flex items-center justify-center mb-4">
                  <LineChart className="w-6 h-6 text-red-500" />
                </div>
                <CardTitle>Trend Analysis</CardTitle>
                <CardDescription>
                  Track changes in your health metrics over time and identify patterns
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 hover:shadow-xl transition-all duration-300">
              <CardHeader>
                <div className="w-12 h-12 rounded-xl bg-pink-500/10 flex items-center justify-center mb-4">
                  <TrendingUp className="w-6 h-6 text-pink-500" />
                </div>
                <CardTitle>Predictive Health</CardTitle>
                <CardDescription>
                  AI-powered predictions to help you stay ahead of potential health issues
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* What You Can Track */}
      <section className="py-16">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">What You Can Track</h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="border-2">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-orange-500 to-red-500 flex items-center justify-center">
                      <Heart className="w-5 h-5 text-white" />
                    </div>
                    <CardTitle>Vital Signs</CardTitle>
                  </div>
                  <CardDescription>
                    Monitor blood pressure, heart rate, temperature, and other vital metrics with trend analysis
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="border-2">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-orange-500 to-red-500 flex items-center justify-center">
                      <Activity className="w-5 h-5 text-white" />
                    </div>
                    <CardTitle>Health Metrics</CardTitle>
                  </div>
                  <CardDescription>
                    Track weight, BMI, glucose levels, and other important health indicators
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="border-2">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-orange-500 to-red-500 flex items-center justify-center">
                      <LineChart className="w-5 h-5 text-white" />
                    </div>
                    <CardTitle>Appointment History</CardTitle>
                  </div>
                  <CardDescription>
                    View your complete medical visit history with insights and follow-up recommendations
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="border-2">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-orange-500 to-red-500 flex items-center justify-center">
                      <PieChart className="w-5 h-5 text-white" />
                    </div>
                    <CardTitle>Lab Results</CardTitle>
                  </div>
                  <CardDescription>
                    All your lab reports in one place with AI-powered explanations and comparisons
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="border-2">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-orange-500 to-red-500 flex items-center justify-center">
                      <TrendingUp className="w-5 h-5 text-white" />
                    </div>
                    <CardTitle>Medication Adherence</CardTitle>
                  </div>
                  <CardDescription>
                    Track your medication schedule and see how consistent you've been with prescriptions
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="border-2">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-orange-500 to-red-500 flex items-center justify-center">
                      <BarChart3 className="w-5 h-5 text-white" />
                    </div>
                    <CardTitle>Wellness Scores</CardTitle>
                  </div>
                  <CardDescription>
                    Get an overall health score based on multiple factors and see how you're progressing
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16 bg-gradient-to-br from-orange-500/5 to-red-500/5">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center">The Power of Health Insights</h2>
            
            <div className="space-y-6">
              <Card className="border-l-4 border-l-orange-500">
                <CardHeader>
                  <div className="flex items-start gap-4">
                    <Sparkles className="w-8 h-8 text-orange-500 mt-1" />
                    <div>
                      <CardTitle>Make Informed Decisions</CardTitle>
                      <CardDescription>
                        Understanding your health data empowers you to make better choices about your lifestyle and treatments.
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
              </Card>

              <Card className="border-l-4 border-l-red-500">
                <CardHeader>
                  <div className="flex items-start gap-4">
                    <TrendingUp className="w-8 h-8 text-red-500 mt-1" />
                    <div>
                      <CardTitle>Track Progress</CardTitle>
                      <CardDescription>
                        See how your health improves over time and stay motivated with visual progress indicators.
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
              </Card>

              <Card className="border-l-4 border-l-pink-500">
                <CardHeader>
                  <div className="flex items-start gap-4">
                    <Heart className="w-8 h-8 text-pink-500 mt-1" />
                    <div>
                      <CardTitle>Early Detection</CardTitle>
                      <CardDescription>
                        AI-powered trend analysis can help identify potential issues before they become serious problems.
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
      <section className="py-20 bg-gradient-to-r from-orange-500 to-red-500 text-white">
        <div className="container mx-auto px-4 lg:px-6 text-center">
          <h2 className="text-4xl font-bold mb-6">Start Tracking Your Health Today</h2>
          <p className="text-xl mb-8 opacity-90">
            Gain valuable insights into your health with AI-powered analytics
          </p>
          <Button size="lg" variant="secondary" className="text-lg px-8">
            <Link to="/patient-info" className="flex items-center">
              Open Dashboard
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
