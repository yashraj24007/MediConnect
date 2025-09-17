import { useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { MapPin, Phone, Mail, Bed, Clock, Search } from "lucide-react";
import { hospitals } from "@/data/hospitals";

export default function Hospitals() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredHospitals = hospitals.filter(hospital =>
    hospital.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    hospital.specialties.some(specialty => 
      specialty.toLowerCase().includes(searchTerm.toLowerCase())
    ) ||
    hospital.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-muted py-12">
      <div className="container mx-auto px-4 lg:px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-primary mb-4">
            Top Hospitals in Hyderabad
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto mb-8">
            Discover the best healthcare facilities in Hyderabad with world-class medical services and experienced professionals.
          </p>
          
          {/* Search */}
          <div className="max-w-md mx-auto relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search hospitals by name, specialty, or location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Hospitals Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredHospitals.map((hospital) => (
            <Card key={hospital.id} className="medical-card hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-xl mb-2">{hospital.name}</CardTitle>
                    <div className="flex items-center text-muted-foreground mb-2">
                      <MapPin className="w-4 h-4 mr-1" />
                      <span className="text-sm">{hospital.address.split(',')[0]}</span>
                    </div>
                  </div>
                  {hospital.emergency && (
                    <Badge variant="destructive" className="text-xs">
                      24/7 Emergency
                    </Badge>
                  )}
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <CardDescription className="line-clamp-3">
                  {hospital.description}
                </CardDescription>
                
                {/* Key Info */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center">
                    <Bed className="w-4 h-4 mr-2 text-primary" />
                    <span>{hospital.beds} Beds</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-2 text-primary" />
                    <span>Est. {hospital.established}</span>
                  </div>
                </div>
                
                {/* Specialties */}
                <div>
                  <p className="text-sm font-medium mb-2">Specialties:</p>
                  <div className="flex flex-wrap gap-1">
                    {hospital.specialties.slice(0, 3).map((specialty, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {specialty}
                      </Badge>
                    ))}
                    {hospital.specialties.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{hospital.specialties.length - 3} more
                      </Badge>
                    )}
                  </div>
                </div>
                
                {/* Contact Info */}
                <div className="space-y-2 pt-4 border-t">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Phone className="w-4 h-4 mr-2" />
                    <span>{hospital.phone}</span>
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Mail className="w-4 h-4 mr-2" />
                    <span>{hospital.email}</span>
                  </div>
                </div>
                
                {/* Actions */}
                <div className="flex gap-2 pt-4">
                  <Button asChild className="flex-1">
                    <Link to={`/hospitals/${hospital.id}`}>View Details</Link>
                  </Button>
                  <Button asChild variant="outline" className="flex-1">
                    <Link to="/booking">Book Now</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        {filteredHospitals.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">
              No hospitals found matching your search criteria.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}