import { Sparkles, Users, Award, Target, Heart, Zap, Shield, Clock, TrendingUp, CheckCircle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useEffect } from "react";

export default function About() {
  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-accent/5">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-accent/5 to-primary/10" />
        <div className="container mx-auto px-4 lg:px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="mb-6 bg-gradient-to-r from-primary to-accent text-primary-foreground">
              <Heart className="w-4 h-4 mr-2" />
              About MediConnect
            </Badge>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
              Transforming Healthcare with AI
            </h1>
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              MediConnect is revolutionizing healthcare delivery by combining cutting-edge artificial intelligence with compassionate care, making quality healthcare accessible to everyone, everywhere.
            </p>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16 bg-background/50">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <Card className="border-2 hover:shadow-xl transition-all duration-300">
              <CardHeader>
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-primary to-accent flex items-center justify-center mb-4">
                  <Target className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-2xl">Our Mission</CardTitle>
                <CardDescription className="text-base leading-relaxed mt-4">
                  To democratize healthcare by leveraging AI technology, making expert medical guidance and quality healthcare services accessible to everyone, regardless of location or circumstance.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 hover:shadow-xl transition-all duration-300">
              <CardHeader>
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-accent to-primary flex items-center justify-center mb-4">
                  <Sparkles className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-2xl">Our Vision</CardTitle>
                <CardDescription className="text-base leading-relaxed mt-4">
                  To create a world where AI-powered healthcare is the standard, enabling early disease detection, personalized treatments, and seamless patient-doctor collaboration.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-16">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Core Values</h2>
            <p className="text-muted-foreground text-lg">The principles that guide everything we do</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <Card className="border-2 text-center hover:shadow-xl transition-all duration-300">
              <CardHeader>
                <div className="w-14 h-14 rounded-xl bg-blue-500/10 flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-7 h-7 text-blue-500" />
                </div>
                <CardTitle>Privacy First</CardTitle>
                <CardDescription className="mt-3">
                  Your health data is encrypted and secure. We prioritize your privacy in every interaction.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 text-center hover:shadow-xl transition-all duration-300">
              <CardHeader>
                <div className="w-14 h-14 rounded-xl bg-emerald-500/10 flex items-center justify-center mx-auto mb-4">
                  <Zap className="w-7 h-7 text-emerald-500" />
                </div>
                <CardTitle>Innovation</CardTitle>
                <CardDescription className="mt-3">
                  Constantly evolving with the latest AI advancements to provide better healthcare solutions.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 text-center hover:shadow-xl transition-all duration-300">
              <CardHeader>
                <div className="w-14 h-14 rounded-xl bg-orange-500/10 flex items-center justify-center mx-auto mb-4">
                  <Users className="w-7 h-7 text-orange-500" />
                </div>
                <CardTitle>Patient-Centered</CardTitle>
                <CardDescription className="mt-3">
                  Every feature is designed with patients in mind, ensuring ease of use and accessibility.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 text-center hover:shadow-xl transition-all duration-300">
              <CardHeader>
                <div className="w-14 h-14 rounded-xl bg-purple-500/10 flex items-center justify-center mx-auto mb-4">
                  <Clock className="w-7 h-7 text-purple-500" />
                </div>
                <CardTitle>24/7 Availability</CardTitle>
                <CardDescription className="mt-3">
                  Healthcare doesn't wait. Our AI services are always ready when you need them.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 text-center hover:shadow-xl transition-all duration-300">
              <CardHeader>
                <div className="w-14 h-14 rounded-xl bg-pink-500/10 flex items-center justify-center mx-auto mb-4">
                  <Heart className="w-7 h-7 text-pink-500" />
                </div>
                <CardTitle>Compassionate Care</CardTitle>
                <CardDescription className="mt-3">
                  Technology meets empathy. We combine AI efficiency with human compassion.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 text-center hover:shadow-xl transition-all duration-300">
              <CardHeader>
                <div className="w-14 h-14 rounded-xl bg-cyan-500/10 flex items-center justify-center mx-auto mb-4">
                  <Award className="w-7 h-7 text-cyan-500" />
                </div>
                <CardTitle>Excellence</CardTitle>
                <CardDescription className="mt-3">
                  Committed to delivering the highest quality healthcare services and experiences.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* What Makes Us Different */}
      <section className="py-16 bg-gradient-to-br from-primary/5 to-accent/5">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center">What Makes Us Different</h2>
            
            <div className="space-y-6">
              <Card className="border-l-4 border-l-primary">
                <CardHeader>
                  <div className="flex items-start gap-4">
                    <CheckCircle className="w-8 h-8 text-primary mt-1 flex-shrink-0" />
                    <div>
                      <CardTitle>AI-Powered Insights</CardTitle>
                      <CardDescription className="mt-2">
                        Our advanced AI algorithms analyze your symptoms and health data to provide personalized recommendations, helping you make informed healthcare decisions.
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
              </Card>

              <Card className="border-l-4 border-l-accent">
                <CardHeader>
                  <div className="flex items-start gap-4">
                    <TrendingUp className="w-8 h-8 text-accent mt-1 flex-shrink-0" />
                    <div>
                      <CardTitle>Seamless Integration</CardTitle>
                      <CardDescription className="mt-2">
                        Everything you need in one platform—from symptom checking to appointment booking, health records to doctor consultations.
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
              </Card>

              <Card className="border-l-4 border-l-blue-500">
                <CardHeader>
                  <div className="flex items-start gap-4">
                    <Users className="w-8 h-8 text-blue-500 mt-1 flex-shrink-0" />
                    <div>
                      <CardTitle>Human Touch</CardTitle>
                      <CardDescription className="mt-2">
                        While we leverage AI, we never lose sight of the human element. Real doctors review AI recommendations and provide personalized care.
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics */}
      <section className="py-16 bg-background/50">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-5xl mx-auto">
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-primary mb-2">10K+</div>
              <div className="text-muted-foreground">Happy Patients</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-accent mb-2">500+</div>
              <div className="text-muted-foreground">Expert Doctors</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-blue-500 mb-2">24/7</div>
              <div className="text-muted-foreground">AI Support</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-emerald-500 mb-2">99.9%</div>
              <div className="text-muted-foreground">Uptime</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-r from-primary to-accent text-primary-foreground">
        <div className="container mx-auto px-4 lg:px-6 text-center">
          <h2 className="text-4xl font-bold mb-6">Join the Healthcare Revolution</h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Experience the future of healthcare with MediConnect's AI-powered platform
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" className="text-lg px-8" asChild>
              <Link to="/">
                Get Started
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="bg-white/10 border-white text-white hover:bg-white/20 text-lg px-8" asChild>
              <Link to="/ai/health-assistant">
                Try AI Assistant
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
