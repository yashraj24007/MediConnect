import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Search, MapPin, Clock, Star } from "lucide-react";

interface Doctor {
  id: string;
  name: string;
  specialty: string;
  location: string;
  rating: number;
  experience: string;
  availability: string;
  image?: string;
}

export default function Members() {
  const [searchQuery, setSearchQuery] = useState("");

  const doctors: Doctor[] = [
    {
      id: "1",
      name: "Dr. Ben Adams",
      specialty: "Cardiologist",
      location: "Main Clinic",
      rating: 4.8,
      experience: "15+ years",
      availability: "Available today",
    },
    {
      id: "2",
      name: "Dr. Emily Carter",
      specialty: "Dermatologist", 
      location: "Downtown Branch",
      rating: 4.9,
      experience: "12+ years",
      availability: "Next available: Tomorrow",
    },
    {
      id: "3",
      name: "Dr. Sarah Wilson",
      specialty: "General Medicine",
      location: "Main Clinic",
      rating: 4.7,
      experience: "10+ years",
      availability: "Available today",
    },
    {
      id: "4",
      name: "Dr. Michael Chen",
      specialty: "Orthopedic Surgeon",
      location: "Surgical Center",
      rating: 4.9,
      experience: "20+ years",
      availability: "Next available: Next week",
    },
    {
      id: "5",
      name: "Dr. Lisa Rodriguez",
      specialty: "Pediatrician",
      location: "Family Clinic",
      rating: 4.8,
      experience: "8+ years",
      availability: "Available today",
    },
    {
      id: "6",
      name: "Dr. James Thompson",
      specialty: "Neurologist",
      location: "Specialty Center",
      rating: 4.6,
      experience: "18+ years",
      availability: "Next available: This week",
    },
  ];

  const filteredDoctors = doctors.filter(doctor =>
    doctor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    doctor.specialty.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase();
  };

  const getAvailabilityBadge = (availability: string) => {
    if (availability.includes("Available today")) {
      return <Badge className="bg-success text-success-foreground">Available Today</Badge>;
    } else if (availability.includes("Tomorrow")) {
      return <Badge variant="secondary">Tomorrow</Badge>;
    } else {
      return <Badge variant="outline">Upcoming</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-muted py-12">
      <div className="container mx-auto px-4 lg:px-6">
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-primary mb-2">
            Find a Healthcare Provider
          </h1>
          <p className="text-muted-foreground">
            Search for doctors by name or specialty to book your appointment.
          </p>
        </div>

        {/* Search */}
        <Card className="medical-card mb-8">
          <CardContent className="p-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search by name or specialty (e.g., 'Cardiology')"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Doctor Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDoctors.map((doctor) => (
            <Card key={doctor.id} className="medical-card">
              <CardHeader>
                <div className="flex items-center space-x-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={doctor.image} alt={doctor.name} />
                    <AvatarFallback className="bg-primary text-primary-foreground text-lg">
                      {getInitials(doctor.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <CardTitle className="text-lg">{doctor.name}</CardTitle>
                    <CardDescription className="text-primary font-medium">
                      {doctor.specialty}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <MapPin className="w-4 h-4" />
                    {doctor.location}
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-medium">{doctor.rating}</span>
                  </div>
                </div>
                
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Clock className="w-4 h-4" />
                  Experience: {doctor.experience}
                </div>
                
                <div className="flex items-center justify-between">
                  {getAvailabilityBadge(doctor.availability)}
                </div>
                
                <Button className="w-full" asChild>
                  <a href="/booking">Book Appointment</a>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredDoctors.length === 0 && (
          <Card className="medical-card">
            <CardContent className="text-center py-12">
              <p className="text-muted-foreground mb-4">
                No healthcare providers found matching your search.
              </p>
              <p className="text-sm text-muted-foreground">
                Try searching with different keywords or browse all available doctors.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}