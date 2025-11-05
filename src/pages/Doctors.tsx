import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { User, MapPin, Phone, Mail, Award, Search, Filter, Map as MapIcon, Loader2, Calendar, Clock, CheckCircle, Activity, AlertCircle, ArrowRight, ArrowLeft } from "lucide-react";
import { DoctorService } from "@/services/doctorService";
import { Doctor } from "@/data/doctors";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

export default function Doctors() {
  const location = useLocation();
  const { user, profile } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] = useState("all");
  const [selectedLocation, setSelectedLocation] = useState("all");
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [bookingDoctor, setBookingDoctor] = useState<Doctor | null>(null);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [showReview, setShowReview] = useState(false);
  
  // Booking form state
  const [bookingForm, setBookingForm] = useState({
    date: (() => {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      return tomorrow.toISOString().split('T')[0];
    })(),
    time: "09:00",
    reason: "",
    notes: ""
  });

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

  // Handle specialty filter from symptom analyzer
  useEffect(() => {
    if (location.state?.specialty && doctors.length > 0) {
      const specialty = location.state.specialty;
      // Find matching specialty in the doctors list
      const matchingSpecialty = doctors.find(doc => 
        doc.specialty.toLowerCase() === specialty.toLowerCase()
      )?.specialty;
      
      if (matchingSpecialty) {
        setSelectedSpecialty(matchingSpecialty);
        toast.success(`Showing ${matchingSpecialty}s based on your symptoms`);
      }
    }
  }, [location.state, doctors]);

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

  const handleBookAppointment = (doctor: Doctor) => {
    if (!user) {
      toast.error("Please login to book an appointment", {
        description: "You need to be logged in to book appointments"
      });
      return;
    }
    setBookingDoctor(doctor);
    setBookingSuccess(false);
    setShowReview(false);
    setBookingForm({
      date: (() => {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        return tomorrow.toISOString().split('T')[0];
      })(),
      time: "09:00",
      reason: "",
      notes: ""
    });
    setIsBookingOpen(true);
  };

  const handleProceedToReview = () => {
    if (!bookingForm.reason.trim()) {
      toast.error("Please provide a reason for your visit");
      return;
    }
    setShowReview(true);
  };

  const handleEditBooking = () => {
    setShowReview(false);
  };

  const handleSubmitBooking = async () => {
    if (!user || !bookingDoctor || !profile) {
      toast.error("Authentication required");
      return;
    }

    if (!bookingForm.reason.trim()) {
      toast.error("Please provide a reason for your visit");
      return;
    }

    setIsSubmitting(true);

    try {
      // Get or create patient record (with better error handling)
      let patientId = null;
      
      try {
        const { data: patientData, error: fetchError } = await supabase
          .from('patients')
          .select('id')
          .eq('profile_id', profile.id)
          .maybeSingle(); // Use maybeSingle instead of single to handle no results

        if (patientData) {
          patientId = patientData.id;
        } else if (!fetchError) {
          // Try to create patient record
          const { data: newPatient, error: patientError } = await supabase
            .from('patients')
            .insert({ profile_id: profile.id })
            .select('id')
            .single();

          if (!patientError && newPatient) {
            patientId = newPatient.id;
          } else {
            console.warn('Could not create patient record:', patientError);
            // Continue without patient ID - use demo mode
          }
        }
      } catch (dbError) {
        console.warn('Database operation failed, using demo mode:', dbError);
        // Continue without patient ID - use demo mode
      }

      // Create appointment (saving to localStorage for demo)
      const appointment = {
        id: `demo-${Date.now()}`,
        patient_id: patientId || `demo-patient-${user.id}`,
        patient_name: `${profile.first_name} ${profile.last_name}`,
        patient_email: profile.email,
        doctor_id: bookingDoctor.id,
        doctor_name: bookingDoctor.name,
        specialty: bookingDoctor.specialty,
        hospital: bookingDoctor.hospital,
        appointment_date: bookingForm.date,
        start_time: bookingForm.time,
        service_type: bookingForm.reason,
        notes: bookingForm.notes,
        status: 'scheduled',
        fee: bookingDoctor.consultationFee || 0,
        created_at: new Date().toISOString()
      };

      // Save to localStorage for demo
      const existingAppointments = JSON.parse(localStorage.getItem('demoAppointments') || '[]');
      existingAppointments.push(appointment);
      localStorage.setItem('demoAppointments', JSON.stringify(existingAppointments));

      setBookingSuccess(true);
      toast.success("Appointment Booked Successfully!", {
        description: `Your appointment with ${bookingDoctor.name} is confirmed for ${bookingForm.date} at ${bookingForm.time}`
      });

      // Reset form after 2 seconds and close dialog
      setTimeout(() => {
        setIsBookingOpen(false);
        setBookingDoctor(null);
        setShowReview(false);
      }, 2000);

    } catch (error) {
      console.error('Error booking appointment:', error);
      toast.error("Failed to book appointment", {
        description: error instanceof Error ? error.message : "Please try again or contact support"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 9; hour <= 17; hour++) {
      slots.push(`${hour.toString().padStart(2, '0')}:00`);
      if (hour < 17) {
        slots.push(`${hour.toString().padStart(2, '0')}:30`);
      }
    }
    return slots;
  };

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
                    <Button 
                      variant="outline" 
                      className="flex-1"
                      onClick={() => handleBookAppointment(doctor)}
                    >
                      <Calendar className="w-4 h-4 mr-2" />
                      Book Now
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

      {/* Booking Dialog */}
      <Dialog open={isBookingOpen} onOpenChange={setIsBookingOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          {!bookingSuccess ? (
            <>
              <DialogHeader>
                <DialogTitle className="text-2xl">
                  {showReview ? "Review Your Appointment" : "Book Appointment"}
                </DialogTitle>
                <DialogDescription>
                  {showReview 
                    ? "Please review all details before confirming" 
                    : `Schedule your consultation with ${bookingDoctor?.name}`}
                </DialogDescription>
              </DialogHeader>

              {bookingDoctor && !showReview && (
                <div className="space-y-6">
                  {/* Doctor Info */}
                  <Card className="bg-muted/50">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-4">
                        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                          <User className="w-8 h-8 text-primary" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg">{bookingDoctor.name}</h3>
                          <p className="text-sm text-muted-foreground">{bookingDoctor.specialty}</p>
                          <p className="text-sm text-muted-foreground">{bookingDoctor.hospital}</p>
                          <div className="flex items-center gap-4 mt-2">
                            <Badge variant="secondary">{bookingDoctor.experience} years exp.</Badge>
                            <span className="text-sm font-semibold text-primary">
                              ₹{bookingDoctor.consultationFee || 0}
                            </span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Booking Form */}
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="date">
                          <Calendar className="w-4 h-4 inline mr-2" />
                          Appointment Date
                        </Label>
                        <Input
                          id="date"
                          type="date"
                          value={bookingForm.date}
                          min={new Date().toISOString().split('T')[0]}
                          onChange={(e) => setBookingForm({ ...bookingForm, date: e.target.value })}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="time">
                          <Clock className="w-4 h-4 inline mr-2" />
                          Time Slot
                        </Label>
                        <Select 
                          value={bookingForm.time} 
                          onValueChange={(value) => setBookingForm({ ...bookingForm, time: value })}
                        >
                          <SelectTrigger id="time">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {generateTimeSlots().map((slot) => (
                              <SelectItem key={slot} value={slot}>
                                {slot}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="reason">Reason for Visit *</Label>
                      <Input
                        id="reason"
                        placeholder="e.g., Regular checkup, Follow-up consultation..."
                        value={bookingForm.reason}
                        onChange={(e) => setBookingForm({ ...bookingForm, reason: e.target.value })}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="notes">Additional Notes (Optional)</Label>
                      <Textarea
                        id="notes"
                        placeholder="Any specific concerns or symptoms you'd like to mention..."
                        value={bookingForm.notes}
                        onChange={(e) => setBookingForm({ ...bookingForm, notes: e.target.value })}
                        rows={3}
                      />
                    </div>
                  </div>

                  {/* Patient Info */}
                  <Card className="bg-blue-50 dark:bg-blue-950/20 border-blue-200">
                    <CardContent className="p-4">
                      <h4 className="font-semibold mb-2 flex items-center">
                        <User className="w-4 h-4 mr-2" />
                        Patient Information
                      </h4>
                      <div className="text-sm space-y-1">
                        <p><strong>Name:</strong> {profile?.first_name} {profile?.last_name}</p>
                        <p><strong>Email:</strong> {profile?.email}</p>
                        {profile?.phone && <p><strong>Phone:</strong> {profile?.phone}</p>}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Action Buttons */}
                  <div className="flex gap-3 pt-4">
                    <Button
                      variant="outline"
                      onClick={() => setIsBookingOpen(false)}
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleProceedToReview}
                      disabled={!bookingForm.reason.trim()}
                      className="flex-1"
                    >
                      <ArrowRight className="w-4 h-4 mr-2" />
                      Review Booking
                    </Button>
                  </div>
                </div>
              )}

              {/* Review Screen */}
              {bookingDoctor && showReview && (
                <div className="space-y-6">
                  {/* Appointment Summary */}
                  <Card className="border-2 border-primary/20">
                    <CardHeader className="bg-primary/5">
                      <CardTitle className="flex items-center gap-2">
                        <CheckCircle className="w-5 h-5 text-primary" />
                        Appointment Summary
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6 space-y-4">
                      {/* Doctor Details */}
                      <div className="space-y-3">
                        <h4 className="font-semibold text-sm text-muted-foreground uppercase">Doctor Details</h4>
                        <div className="flex items-start gap-4 p-4 bg-muted/50 rounded-lg">
                          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                            <User className="w-8 h-8 text-primary" />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-bold text-lg">{bookingDoctor.name}</h3>
                            <p className="text-sm text-muted-foreground">{bookingDoctor.specialty}</p>
                            <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                              <MapPin className="w-3 h-3" />
                              {bookingDoctor.hospital}
                            </p>
                            <div className="flex items-center gap-3 mt-2">
                              <Badge variant="secondary" className="text-xs">
                                <Award className="w-3 h-3 mr-1" />
                                {bookingDoctor.experience} years
                              </Badge>
                              <span className="text-sm">
                                <Phone className="w-3 h-3 inline mr-1" />
                                {bookingDoctor.phone}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Appointment Details */}
                      <div className="space-y-3">
                        <h4 className="font-semibold text-sm text-muted-foreground uppercase">Appointment Details</h4>
                        <div className="grid gap-3">
                          <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                            <div className="flex items-center gap-2">
                              <Calendar className="w-5 h-5 text-blue-600" />
                              <span className="font-medium">Date</span>
                            </div>
                            <span className="font-bold">
                              {new Date(bookingForm.date).toLocaleDateString('en-US', { 
                                weekday: 'short',
                                year: 'numeric', 
                                month: 'short', 
                                day: 'numeric' 
                              })}
                            </span>
                          </div>
                          <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-950/20 rounded-lg">
                            <div className="flex items-center gap-2">
                              <Clock className="w-5 h-5 text-green-600" />
                              <span className="font-medium">Time</span>
                            </div>
                            <span className="font-bold">{bookingForm.time}</span>
                          </div>
                          <div className="flex items-start justify-between p-3 bg-purple-50 dark:bg-purple-950/20 rounded-lg">
                            <div className="flex items-center gap-2">
                              <Activity className="w-5 h-5 text-purple-600" />
                              <span className="font-medium">Reason</span>
                            </div>
                            <span className="font-semibold text-right max-w-[60%]">{bookingForm.reason}</span>
                          </div>
                          {bookingForm.notes && (
                            <div className="flex items-start justify-between p-3 bg-amber-50 dark:bg-amber-950/20 rounded-lg">
                              <div className="flex items-center gap-2">
                                <AlertCircle className="w-5 h-5 text-amber-600" />
                                <span className="font-medium">Notes</span>
                              </div>
                              <span className="text-sm text-right max-w-[60%]">{bookingForm.notes}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Patient Information */}
                      <div className="space-y-3">
                        <h4 className="font-semibold text-sm text-muted-foreground uppercase">Patient Information</h4>
                        <div className="p-4 bg-muted/50 rounded-lg space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm text-muted-foreground">Name:</span>
                            <span className="font-semibold">{profile?.first_name} {profile?.last_name}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-muted-foreground">Email:</span>
                            <span className="font-semibold">{profile?.email}</span>
                          </div>
                          {profile?.phone && (
                            <div className="flex justify-between">
                              <span className="text-sm text-muted-foreground">Phone:</span>
                              <span className="font-semibold">{profile?.phone}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Consultation Fee */}
                      <div className="space-y-3">
                        <h4 className="font-semibold text-sm text-muted-foreground uppercase">Payment Details</h4>
                        <div className="flex items-center justify-between p-4 bg-gradient-to-r from-primary/10 to-primary/5 rounded-lg border-2 border-primary/20">
                          <span className="font-semibold text-lg">Consultation Fee</span>
                          <span className="font-bold text-2xl text-primary">₹{bookingDoctor.consultationFee || 0}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Important Notice */}
                  <Card className="border-amber-500/50 bg-amber-50 dark:bg-amber-950/20">
                    <CardContent className="p-4">
                      <div className="flex gap-3">
                        <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                        <div className="text-sm space-y-1">
                          <p className="font-semibold text-amber-900 dark:text-amber-100">Important Notes:</p>
                          <ul className="list-disc list-inside text-amber-800 dark:text-amber-200 space-y-1">
                            <li>Please arrive 10 minutes before your appointment time</li>
                            <li>Bring any relevant medical records or test results</li>
                            <li>You can reschedule or cancel up to 2 hours before the appointment</li>
                          </ul>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Action Buttons */}
                  <div className="flex gap-3 pt-4">
                    <Button
                      variant="outline"
                      onClick={handleEditBooking}
                      disabled={isSubmitting}
                      className="flex-1"
                    >
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Edit Details
                    </Button>
                    <Button
                      onClick={handleSubmitBooking}
                      disabled={isSubmitting}
                      className="flex-1 bg-gradient-to-r from-primary to-primary/80"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Confirming...
                        </>
                      ) : (
                        <>
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Confirm Booking
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-2xl font-bold mb-2">Booking Confirmed!</h3>
              <p className="text-muted-foreground mb-4">
                Your appointment with {bookingDoctor?.name} has been successfully scheduled.
              </p>
              <div className="bg-muted p-4 rounded-lg mb-4">
                <p className="font-semibold">
                  {new Date(bookingForm.date).toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </p>
                <p className="text-lg font-bold text-primary">{bookingForm.time}</p>
              </div>
              <p className="text-sm text-muted-foreground">
                A confirmation has been saved. You can view your appointments in the Account section.
              </p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}