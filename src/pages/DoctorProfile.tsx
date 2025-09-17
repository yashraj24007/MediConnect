import { useParams, Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, User, MapPin, Phone, Mail, Award, Calendar, Clock, Star, Languages, Map as MapIcon } from "lucide-react";
import { doctors } from "@/data/doctors";

export default function DoctorProfile() {
  const { id } = useParams();
  const doctor = doctors.find(doc => doc.id === id);

  if (!doctor) {
    return (
      <div className="min-h-screen bg-muted flex items-center justify-center">
        <Card className="max-w-md mx-auto text-center">
          <CardHeader>
            <CardTitle>Doctor Not Found</CardTitle>
            <CardDescription>The requested doctor profile could not be found.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild>
              <Link to="/doctors">Back to Doctors</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted py-12">
      <div className="container mx-auto px-4 lg:px-6 max-w-4xl">
        <Button asChild variant="ghost" className="mb-6">
          <Link to="/doctors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Doctors
          </Link>
        </Button>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Profile Card */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="medical-card">
              <CardHeader>
                <div className="flex items-start space-x-6">
                  <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center">
                    <User className="w-12 h-12 text-primary" />
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-3xl mb-2">{doctor.name}</CardTitle>
                    <Badge variant="secondary" className="text-lg px-4 py-2 mb-3">
                      {doctor.specialty}
                    </Badge>
                    <div className="flex items-center text-muted-foreground mb-2">
                      <MapPin className="w-4 h-4 mr-2" />
                      <span>{doctor.hospital}</span>
                    </div>
                    <div className="flex items-center text-muted-foreground">
                      <Award className="w-4 h-4 mr-2" />
                      <span>{doctor.experience} years of experience</span>
                    </div>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-6">
                {/* About */}
                <div>
                  <h3 className="text-xl font-semibold mb-3">About Dr. {doctor.name.split(' ').pop()}</h3>
                  <p className="text-muted-foreground leading-relaxed">{doctor.about}</p>
                </div>

                <Separator />

                {/* Qualifications */}
                <div>
                  <h3 className="text-xl font-semibold mb-3">Qualifications</h3>
                  <p className="text-muted-foreground">{doctor.qualification}</p>
                </div>

                <Separator />

                {/* Expertise */}
                <div>
                  <h3 className="text-xl font-semibold mb-3">Areas of Expertise</h3>
                  <div className="grid sm:grid-cols-2 gap-2">
                    {doctor.expertise.map((skill, index) => (
                      <div key={index} className="flex items-center">
                        <div className="w-2 h-2 bg-primary rounded-full mr-3"></div>
                        <span className="text-muted-foreground">{skill}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator />

                {/* Languages */}
                <div>
                  <h3 className="text-xl font-semibold mb-3 flex items-center">
                    <Languages className="w-5 h-5 mr-2 text-primary" />
                    Languages Spoken
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {doctor.languages.map((language, index) => (
                      <Badge key={index} variant="outline">
                        {language}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Schedule */}
            <Card className="medical-card">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calendar className="w-5 h-5 mr-2 text-primary" />
                  Consultation Schedule
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3">
                  {Object.entries(doctor.availability).map(([day, time]) => (
                    <div key={day} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                      <span className="font-medium">{day}</span>
                      <span className="text-muted-foreground flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        {time}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Book */}
            <Card className="medical-card">
              <CardHeader>
                <CardTitle className="text-center">Book Consultation</CardTitle>
              </CardHeader>
              <CardContent className="text-center space-y-4">
                <div>
                  <p className="text-muted-foreground mb-1">Consultation Fee</p>
                  <p className="text-3xl font-bold text-primary">Free</p>
                </div>
                <div className="space-y-3">
                  <Button asChild size="lg" className="w-full">
                    <Link to="/booking">Book Now</Link>
                  </Button>
                  <Button
                    variant="secondary"
                    size="lg"
                    className="w-full"
                    onClick={() => window.open(`https://www.google.com/maps/search/${encodeURIComponent(doctor.hospital + " Hyderabad")}`, '_blank')}
                  >
                    <MapIcon className="w-4 h-4 mr-2" />
                    View Hospital on Maps
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Next available slot: Today 2:00 PM
                </p>
              </CardContent>
            </Card>

            {/* Contact Info */}
            <Card className="medical-card">
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center">
                  <Phone className="w-4 h-4 mr-3 text-primary" />
                  <span className="text-sm">{doctor.phone}</span>
                </div>
                <div className="flex items-center">
                  <Mail className="w-4 h-4 mr-3 text-primary" />
                  <span className="text-sm">{doctor.email}</span>
                </div>
                <div className="flex items-start">
                  <MapPin className="w-4 h-4 mr-3 text-primary mt-0.5" />
                  <span className="text-sm">{doctor.hospital}</span>
                </div>
              </CardContent>
            </Card>

            {/* Patient Reviews */}
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
                  <p className="text-2xl font-bold">4.9/5</p>
                  <p className="text-sm text-muted-foreground">Based on 156 reviews</p>
                  <Button variant="outline" size="sm" className="w-full">
                    View All Reviews
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}