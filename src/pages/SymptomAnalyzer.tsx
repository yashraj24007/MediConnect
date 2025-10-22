import { FileSearch, Sparkles, Activity, AlertCircle, CheckCircle, ArrowRight, Brain } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";

export default function SymptomAnalyzer() {
  const navigate = useNavigate();

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleAnalyzeNow = () => {
    navigate('/');
    setTimeout(() => {
      const element = document.getElementById('symptom-checker');
      element?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
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
