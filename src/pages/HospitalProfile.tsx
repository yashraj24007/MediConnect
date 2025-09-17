import { useParams, Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, MapPin, Phone, Mail, Bed, Clock, Shield, Award, Star, Users } from "lucide-react";
import { hospitals } from "@/data/hospitals";

export default function HospitalProfile() {
  const { id } = useParams();
  const hospital = hospitals.find(h => h.id === id);

  if (!hospital) {
    return (
      <div className="min-h-screen bg-muted flex items-center justify-center">
        <Card className="max-w-md mx-auto text-center">
          <CardHeader>
            <CardTitle>Hospital Not Found</CardTitle>
            <CardDescription>The requested hospital profile could not be found.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild>
              <Link to="/hospitals">Back to Hospitals</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted py-12">
      <div className="container mx-auto px-4 lg:px-6 max-w-6xl">
        <Button asChild variant="ghost" className="mb-6">
          <Link to="/hospitals">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Hospitals
          </Link>
        </Button>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Hospital Info */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="medical-card">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-3xl mb-3">{hospital.name}</CardTitle>
                    <div className="flex items-center text-muted-foreground mb-2">
                      <MapPin className="w-4 h-4 mr-2" />
                      <span>{hospital.address}</span>
                    </div>
                    <div className="flex items-center gap-4 text-sm">
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-1 text-primary" />
                        <span>Est. {hospital.established}</span>
                      </div>
                      <div className="flex items-center">
                        <Bed className="w-4 h-4 mr-1 text-primary" />
                        <span>{hospital.beds} Beds</span>
                      </div>
                    </div>
                  </div>
                  {hospital.emergency && (
                    <Badge variant="destructive">
                      <Shield className="w-4 h-4 mr-1" />
                      24/7 Emergency
                    </Badge>
                  )}
                </div>
              </CardHeader>
              
              <CardContent className="space-y-6">
                {/* About */}
                <div>
                  <h3 className="text-xl font-semibold mb-3">About {hospital.name}</h3>
                  <p className="text-muted-foreground leading-relaxed">{hospital.description}</p>
                </div>

                <Separator />

                {/* Specialties */}
                <div>
                  <h3 className="text-xl font-semibold mb-3">Medical Specialties</h3>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {hospital.specialties.map((specialty, index) => (
                      <div key={index} className="flex items-center">
                        <div className="w-2 h-2 bg-primary rounded-full mr-3"></div>
                        <span className="text-muted-foreground">{specialty}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator />

                {/* Facilities */}
                <div>
                  <h3 className="text-xl font-semibold mb-3">Facilities & Services</h3>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {hospital.facilities.map((facility, index) => (
                      <div key={index} className="flex items-center">
                        <Award className="w-4 h-4 mr-3 text-primary" />
                        <span className="text-muted-foreground">{facility}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator />

                {/* Operating Hours */}
                <div>
                  <h3 className="text-xl font-semibold mb-3 flex items-center">
                    <Clock className="w-5 h-5 mr-2 text-primary" />
                    Operating Hours
                  </h3>
                  <div className="bg-accent/50 p-4 rounded-lg">
                    <p className="font-medium text-foreground">{hospital.timings}</p>
                    {hospital.emergency && (
                      <p className="text-sm text-muted-foreground mt-1">
                        Emergency services available 24 hours a day, 7 days a week
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Statistics */}
            <Card className="medical-card">
              <CardHeader>
                <CardTitle>Hospital Statistics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary mb-1">{hospital.beds}</div>
                    <div className="text-sm text-muted-foreground">Total Beds</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary mb-1">{hospital.specialties.length}</div>
                    <div className="text-sm text-muted-foreground">Specialties</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary mb-1">50+</div>
                    <div className="text-sm text-muted-foreground">Expert Doctors</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary mb-1">
                      {new Date().getFullYear() - hospital.established}
                    </div>
                    <div className="text-sm text-muted-foreground">Years of Service</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card className="medical-card">
              <CardHeader>
                <CardTitle className="text-center">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button asChild size="lg" className="w-full">
                  <Link to="/booking">Book Appointment</Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="w-full">
                  <Link to="/doctors">View Doctors</Link>
                </Button>
                {hospital.emergency && (
                  <Button variant="destructive" size="lg" className="w-full">
                    <Shield className="w-4 h-4 mr-2" />
                    Emergency Contact
                  </Button>
                )}
              </CardContent>
            </Card>

            {/* Contact Info */}
            <Card className="medical-card">
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center">
                    <Phone className="w-4 h-4 mr-3 text-primary" />
                    <span className="text-sm">{hospital.phone}</span>
                  </div>
                  <div className="flex items-center">
                    <Mail className="w-4 h-4 mr-3 text-primary" />
                    <span className="text-sm">{hospital.email}</span>
                  </div>
                  <div className="flex items-start">
                    <MapPin className="w-4 h-4 mr-3 text-primary mt-0.5" />
                    <span className="text-sm">{hospital.address}</span>
                  </div>
                </div>
                
                <Button variant="outline" size="sm" className="w-full">
                  Get Directions
                </Button>
              </CardContent>
            </Card>

            {/* Ratings */}
            <Card className="medical-card">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Star className="w-5 h-5 mr-2 text-primary" />
                  Patient Reviews
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center space-y-2">
                  <div className="flex items-center justify-center space-x-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} className="w-5 h-5 fill-primary text-primary" />
                    ))}
                  </div>
                  <p className="text-2xl font-bold">4.8/5</p>
                  <p className="text-sm text-muted-foreground">Based on 324 reviews</p>
                  <Button variant="outline" size="sm" className="w-full">
                    View All Reviews
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card className="medical-card">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="w-5 h-5 mr-2 text-primary" />
                  Patient Stats
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Patients Treated</span>
                    <span className="font-medium">10,000+</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Success Rate</span>
                    <span className="font-medium">98.5%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Average Wait Time</span>
                    <span className="font-medium">15 mins</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}