import { Calendar, Sparkles, Clock, CheckCircle, Users, TrendingUp, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { useEffect } from "react";

export default function SmartBooking() {
  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

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
              <Button size="lg" className="bg-gradient-to-r from-green-500 to-emerald-500 text-white" asChild>
                <Link to="/booking" className="flex items-center">
                  <Calendar className="w-5 h-5 mr-2" />
                  Book Appointment Now
                </Link>
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
