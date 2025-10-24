import { FileSearch, Sparkles, Activity, AlertCircle, CheckCircle, ArrowRight, Brain, Loader2, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { GroqChatService } from "@/services/groqService";
import { useToast } from "@/hooks/use-toast";

interface AnalysisResult {
  urgency: 'low' | 'medium' | 'high' | 'emergency';
  possibleConditions: string[];
  recommendations: string[];
  specialist: string;
  nextSteps: string[];
}

export default function SymptomAnalyzer() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [symptoms, setSymptoms] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [showAnalyzer, setShowAnalyzer] = useState(false);

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

    try {
      const prompt = `As a medical AI assistant, analyze the following symptoms and provide a detailed assessment.

Symptoms: ${symptoms}

Provide your response in this JSON format (ensure valid JSON):
{
  "urgency": "low",
  "possibleConditions": ["Common cold", "Seasonal allergy"],
  "recommendations": ["Get adequate rest", "Stay hydrated", "Monitor temperature"],
  "specialist": "General Physician",
  "nextSteps": ["Rest for 24-48 hours", "Take over-the-counter pain relief if needed", "Consult doctor if symptoms worsen"]
}

Important: 
- Urgency MUST be one of: low, medium, high, emergency
- If symptoms indicate immediate danger (chest pain, difficulty breathing, severe bleeding), set urgency to "emergency"
- Provide 2-4 possible conditions
- Give 3-5 practical recommendations
- Suggest appropriate medical specialist
- Provide 3-4 clear next steps
- Return ONLY valid JSON, no extra text`;

      const response = await GroqChatService.sendMessage(prompt, []);
      
      // Try to extract JSON from response
      let jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        try {
          const result = JSON.parse(jsonMatch[0]);
          
          // Validate the response structure
          if (!result.urgency || !result.possibleConditions || !result.recommendations) {
            throw new Error("Invalid response structure");
          }
          
          setAnalysis(result);
          
          if (result.urgency === 'emergency') {
            toast({
              title: "⚠️ Urgent Medical Attention Required",
              description: "Based on your symptoms, please seek immediate medical care or call emergency services.",
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
        setAnalysis({
          urgency: 'medium',
          possibleConditions: ["Please consult a healthcare professional for proper diagnosis"],
          recommendations: ["Seek medical attention", "Monitor your symptoms", "Keep a symptom diary"],
          specialist: "General Physician",
          nextSteps: ["Book an appointment with a doctor", "Prepare a list of your symptoms", "Note any triggers or patterns"]
        });
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
                    <CardContent>
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
                        <Button asChild>
                          <Link to="/booking">Book Appointment</Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

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
    </div>
  );
}
