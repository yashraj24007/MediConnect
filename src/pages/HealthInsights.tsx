import { Activity, TrendingUp, Heart, BarChart3, LineChart, PieChart, ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { useEffect } from "react";

export default function HealthInsights() {
  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

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
              <Button size="lg" className="bg-gradient-to-r from-orange-500 to-red-500 text-white" asChild>
                <Link to="/patient-info" className="flex items-center">
                  <Activity className="w-5 h-5 mr-2" />
                  View Your Dashboard
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link to="/about">
                  Learn More
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

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
