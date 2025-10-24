import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { User, MapPin, Phone, Mail, Award, Search, Filter, Map as MapIcon, Loader2 } from "lucide-react";
import { DoctorService } from "@/services/doctorService";
import { Doctor } from "@/data/doctors";

export default function Doctors() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] = useState("all");
  const [selectedLocation, setSelectedLocation] = useState("all");
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch doctors from database
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        setLoading(true);
        const doctorsData = await DoctorService.getAllDoctors();
        setDoctors(doctorsData);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch doctors:', err);
        setError('Failed to load doctors. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  const specialties = ["all", ...new Set(doctors.map(doc => doc.specialty))];

  // Extract locations from hospital names (e.g., "Apollo Hospitals Jubilee Hills" => "Jubilee Hills")
  const extractLocationFromHospital = (hospital: string): string => {
    const areas = ['Jubilee Hills', 'Banjara Hills', 'Gachibowli', 'Secunderabad', 'Malakpet', 'Kondapur', 'Hi-Tech City', 'Ameerpet'];
    const found = areas.find(area => hospital.includes(area));
    return found || 'Other';
  };

  const locations = ["all", ...new Set(doctors.map(doc => extractLocationFromHospital(doc.hospital)))];

  const filteredDoctors = doctors.filter(doctor => {
    const matchesSearch = doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doctor.specialty.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doctor.hospital.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesSpecialty = selectedSpecialty === "all" || doctor.specialty === selectedSpecialty;
    const matchesLocation = selectedLocation === "all" || extractLocationFromHospital(doctor.hospital) === selectedLocation;
    
    return matchesSearch && matchesSpecialty && matchesLocation;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-muted py-12 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Loading doctors...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-muted py-12 flex items-center justify-center">
        <div className="text-center">
          <p className="text-destructive mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>Try Again</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted py-12">
      <div className="container mx-auto px-4 lg:px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-primary/10 rounded-full">
              <User className="w-10 h-10 text-primary" />
            </div>
          </div>
          <h1 className="text-4xl font-extrabold text-primary mb-4">
            👨‍⚕️ Expert Doctors in Hyderabad
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto mb-8">
            Connect with experienced medical professionals across various specialties in Hyderabad's top hospitals. 🏥
          </p>
          
          {/* Search and Filters */}
          <div className="max-w-4xl mx-auto grid md:grid-cols-4 gap-4">
            <div className="relative md:col-span-2">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search doctors by name, specialty, or hospital..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedSpecialty} onValueChange={setSelectedSpecialty}>
              <SelectTrigger>
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Filter by specialty" />
              </SelectTrigger>
              <SelectContent>
                {specialties.map((specialty) => (
                  <SelectItem key={specialty} value={specialty}>
                    {specialty === "all" ? "All Specialties" : specialty}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedLocation} onValueChange={setSelectedLocation}>
              <SelectTrigger>
                <MapPin className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Filter by location" />
              </SelectTrigger>
              <SelectContent>
                {locations.map((location) => (
                  <SelectItem key={location} value={location}>
                    {location === "all" ? "All Locations" : location}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Doctors Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredDoctors.map((doctor) => (
            <Card key={doctor.id} className="medical-card hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start space-x-4">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                    <User className="w-8 h-8 text-primary" />
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-xl mb-1">{doctor.name}</CardTitle>
                    <Badge variant="secondary" className="mb-2">
                      {doctor.specialty}
                    </Badge>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <MapPin className="w-4 h-4 mr-1" />
                      <span className="line-clamp-1">{doctor.hospital}</span>
                    </div>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <CardDescription className="line-clamp-3">
                  {doctor.about}
                </CardDescription>
                
                {/* Experience & Qualification */}
                <div className="space-y-2">
                  <div className="flex items-center text-sm">
                    <Award className="w-4 h-4 mr-2 text-primary" />
                    <span>{doctor.experience} years experience</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {doctor.qualification}
                  </p>
                </div>
                
                {/* Expertise */}
                <div>
                  <p className="text-sm font-medium mb-2">Expertise:</p>
                  <div className="flex flex-wrap gap-1">
                    {doctor.expertise.slice(0, 3).map((skill, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                    {doctor.expertise.length > 3 && (
                      <Badge variant="secondary" className="text-xs">
                        +{doctor.expertise.length - 3} more
                      </Badge>
                    )}
                  </div>
                </div>
                
                {/* Languages */}
                <div>
                  <p className="text-sm font-medium mb-1">Languages:</p>
                  <p className="text-sm text-muted-foreground">
                    {doctor.languages.join(", ")}
                  </p>
                </div>
                
                {/* Consultation Fee */}
                <div className="flex items-center justify-between pt-4 border-t">
                  <div>
                    <p className="text-sm text-muted-foreground">Consultation Fee</p>
                    <p className="font-bold text-primary">Free</p>
                  </div>
                  <Badge variant="outline" className="bg-success/10 text-success border-success/20">
                    Available Today
                  </Badge>
                </div>
                
                {/* Actions */}
                <div className="flex flex-col gap-2 pt-4">
                  <div className="flex gap-2">
                    <Button asChild className="flex-1">
                      <Link to={`/doctors/${doctor.id}`}>View Profile</Link>
                    </Button>
                    <Button asChild variant="outline" className="flex-1">
                      <Link to="/booking">Book Now</Link>
                    </Button>
                  </div>
                  <Button
                    variant="secondary"
                    size="sm"
                    className="w-full"
                    onClick={() => window.open(`https://www.google.com/maps/search/${encodeURIComponent(doctor.hospital + " Hyderabad")}`, '_blank')}
                  >
                    <MapIcon className="w-4 h-4 mr-2" />
                    View on Maps
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        {filteredDoctors.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">
              No doctors found matching your search criteria.
            </p>
            <Button 
              onClick={() => {
                setSearchTerm("");
                setSelectedSpecialty("all");
                setSelectedLocation("all");
              }}
              variant="outline"
              className="mt-4"
            >
              Clear Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}