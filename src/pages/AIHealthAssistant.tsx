import { MessageSquare, Sparkles, Brain, ArrowRight, Zap, Shield, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";

export default function AIHealthAssistant() {
  const navigate = useNavigate();

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleStartChat = () => {
    navigate('/');
    setTimeout(() => {
      // The chat widget will be visible at the bottom right
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 100);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-accent/5">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-accent/5 to-primary/10" />
        <div className="container mx-auto px-4 lg:px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="mb-6 bg-gradient-to-r from-primary to-accent text-primary-foreground">
              <Sparkles className="w-4 h-4 mr-2" />
              Most Popular AI Service
            </Badge>
            <div className="w-20 h-20 mx-auto mb-6 rounded-3xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-2xl">
              <MessageSquare className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
              AI Health Assistant (Aura)
            </h1>
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              Your 24/7 intelligent health companion providing instant medical guidance, symptom analysis, and personalized wellness advice
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-primary to-accent text-primary-foreground"
                onClick={handleStartChat}
              >
                <MessageSquare className="w-5 h-5 mr-2" />
                Start Chatting with Aura
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link to="/about">
                  <Sparkles className="w-5 h-5 mr-2" />
                  Learn More
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-background/50">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Key Features</h2>
            <p className="text-muted-foreground text-lg">Everything you need for intelligent health guidance</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-2 hover:shadow-xl transition-all duration-300">
              <CardHeader>
                <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center mb-4">
                  <MessageSquare className="w-6 h-6 text-blue-500" />
                </div>
                <CardTitle>Instant Responses</CardTitle>
                <CardDescription>
                  Get immediate answers to your health questions any time, day or night
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 hover:shadow-xl transition-all duration-300">
              <CardHeader>
                <div className="w-12 h-12 rounded-xl bg-cyan-500/10 flex items-center justify-center mb-4">
                  <Brain className="w-6 h-6 text-cyan-500" />
                </div>
                <CardTitle>Natural Conversations</CardTitle>
                <CardDescription>
                  Chat naturally with AI that understands context and your health history
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 hover:shadow-xl transition-all duration-300">
              <CardHeader>
                <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center mb-4">
                  <Zap className="w-6 h-6 text-purple-500" />
                </div>
                <CardTitle>Multi-language Support</CardTitle>
                <CardDescription>
                  Communicate in your preferred language for better understanding
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">How It Works</h2>
            <p className="text-muted-foreground text-lg">Get health guidance in three simple steps</p>
          </div>

          <div className="max-w-4xl mx-auto grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-gradient-to-r from-primary to-accent text-white flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                1
              </div>
              <h3 className="text-xl font-bold mb-2">Describe Your Concern</h3>
              <p className="text-muted-foreground">
                Tell Aura about your symptoms or health questions in natural language
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-gradient-to-r from-primary to-accent text-white flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                2
              </div>
              <h3 className="text-xl font-bold mb-2">AI Analysis</h3>
              <p className="text-muted-foreground">
                Our AI processes your input using advanced medical knowledge
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-gradient-to-r from-primary to-accent text-white flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                3
              </div>
              <h3 className="text-xl font-bold mb-2">Get Guidance</h3>
              <p className="text-muted-foreground">
                Receive personalized recommendations and next steps
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 bg-gradient-to-br from-primary/5 to-accent/5">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center">Why Choose Aura?</h2>
            
            <div className="space-y-6">
              <Card className="border-l-4 border-l-primary">
                <CardHeader>
                  <div className="flex items-start gap-4">
                    <Clock className="w-8 h-8 text-primary mt-1" />
                    <div>
                      <CardTitle>Available 24/7</CardTitle>
                      <CardDescription>
                        Health concerns don't wait for office hours. Aura is always ready to help, whether it's midnight or midday.
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
              </Card>

              <Card className="border-l-4 border-l-accent">
                <CardHeader>
                  <div className="flex items-start gap-4">
                    <Shield className="w-8 h-8 text-accent mt-1" />
                    <div>
                      <CardTitle>Private & Secure</CardTitle>
                      <CardDescription>
                        Your health conversations are encrypted and confidential. We prioritize your privacy above all else.
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
              </Card>

              <Card className="border-l-4 border-l-blue-500">
                <CardHeader>
                  <div className="flex items-start gap-4">
                    <Brain className="w-8 h-8 text-blue-500 mt-1" />
                    <div>
                      <CardTitle>Continuously Learning</CardTitle>
                      <CardDescription>
                        Powered by the latest medical AI research, Aura constantly improves to provide better assistance.
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary to-accent text-primary-foreground">
        <div className="container mx-auto px-4 lg:px-6 text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Get Started?</h2>
          <p className="text-xl mb-8 opacity-90">
            Experience the future of healthcare with Aura, your AI health companion
          </p>
          <Button size="lg" variant="secondary" className="text-lg px-8">
            Start Your Conversation
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </section>
    </div>
  );
}
