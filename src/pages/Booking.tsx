import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Calendar, Clock, CheckCircle } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

export default function Booking() {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1); // 1: Calendar, 2: Form, 3: Confirmation
  const [selectedDate, setSelectedDate] = useState(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  });
  const [selectedTime, setSelectedTime] = useState("09:00");
  const [doctors, setDoctors] = useState<any[]>([]);
  const [selectedDoctor, setSelectedDoctor] = useState<any>(null);
  const [patientRecord, setPatientRecord] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [formData, setFormData] = useState({
    firstName: profile?.first_name || "",
    lastName: profile?.last_name || "",
    email: profile?.email || "",
    phone: profile?.phone || ""
  });

  useEffect(() => {
    const loadData = async () => {
      setIsLoadingData(true);
      await fetchDoctors();
      if (user && profile?.role === 'patient') {
        await fetchPatientRecord();
      }
      setIsLoadingData(false);
    };
    
    loadData();
  }, [user, profile]);

  useEffect(() => {
    if (profile) {
      setFormData({
        firstName: profile.first_name || "",
        lastName: profile.last_name || "",
        email: profile.email || "",
        phone: profile.phone || ""
      });
    }
  }, [profile]);

  const fetchDoctors = async () => {
    try {
      const { data, error } = await supabase
        .from('doctors')
        .select(`
          *,
          profiles (
            first_name,
            last_name,
            email
          )
        `);
      
      if (error) {
        console.error('Error fetching doctors:', error);
        toast.error("Failed to load doctors. Please refresh the page.");
        return;
      }
      
      setDoctors(data || []);
      if (data && data.length > 0) {
        setSelectedDoctor(data[0]);
      } else {
        toast.error("No doctors available at the moment. Please try again later or contact support.");
      }
    } catch (error) {
      console.error('Unexpected error fetching doctors:', error);
      toast.error("Failed to load doctors. Please refresh the page.");
    }
  };

  const fetchPatientRecord = async () => {
    if (!profile?.id) return;
    
    const { data, error } = await supabase
      .from('patients')
      .select('*')
      .eq('profile_id', profile.id)
      .single();
    
    if (error && error.code !== 'PGRST116') {
      console.error('Error fetching patient record:', error);
      return;
    }
    
    // If no patient record exists, create one
    if (!data && profile?.role === 'patient') {
      const { data: newPatient, error: createError } = await supabase
        .from('patients')
        .insert({
          profile_id: profile.id,
          medical_history: '',
          emergency_contact: '',
          insurance_info: ''
        })
        .select()
        .single();
      
      if (createError) {
        console.error('Error creating patient record:', createError);
        toast.error("Failed to create patient record. Please try again.");
        return;
      }
      
      setPatientRecord(newPatient);
    } else {
      setPatientRecord(data);
    }
  };

  const timeSlots = [
    { time: "09:00 AM", available: true },
    { time: "10:00 AM", available: true },
    { time: "11:00 AM", available: false },
    { time: "02:00 PM", available: true },
    { time: "03:00 PM", available: true },
    { time: "04:00 PM", available: true },
  ];

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
    setCurrentStep(2);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error("Please log in to book an appointment");
      navigate('/auth');
      return;
    }

    if (!selectedDoctor) {
      toast.error("No doctor selected. Please refresh and try again.");
      return;
    }

    if (!patientRecord) {
      toast.error("Patient record not found. Please refresh and try again.");
      return;
    }

    // Validate form data
    if (!formData.firstName.trim() || !formData.lastName.trim() || !formData.email.trim() || !formData.phone.trim()) {
      toast.error("Please fill in all required fields.");
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error("Please enter a valid email address.");
      return;
    }

    // Validate phone format (basic check)
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    if (!phoneRegex.test(formData.phone.replace(/[\s\-\(\)]/g, ''))) {
      toast.error("Please enter a valid phone number.");
      return;
    }

    setIsLoading(true);

    try {
      // Convert time to 24-hour format for database
      const timeMapping: {[key: string]: string} = {
        "09:00 AM": "09:00:00",
        "10:00 AM": "10:00:00", 
        "11:00 AM": "11:00:00",
        "02:00 PM": "14:00:00",
        "03:00 PM": "15:00:00",
        "04:00 PM": "16:00:00"
      };

      const startTime = timeMapping[selectedTime];
      if (!startTime) {
        toast.error("Invalid time selected. Please try again.");
        return;
      }

      const endTime = startTime.replace(/(\d{2}):00:00/, (_, hour) => `${String(parseInt(hour) + 1).padStart(2, '0')}:00:00`);

      // Check for existing appointments at the same time
      const { data: existingAppointments, error: checkError } = await supabase
        .from('appointments')
        .select('id')
        .eq('doctor_id', selectedDoctor.id)
        .eq('appointment_date', selectedDate)
        .eq('start_time', startTime)
        .eq('status', 'scheduled');

      if (checkError) {
        console.error('Error checking existing appointments:', checkError);
        toast.error("Failed to verify appointment availability. Please try again.");
        return;
      }

      if (existingAppointments && existingAppointments.length > 0) {
        toast.error("This time slot is no longer available. Please select a different time.");
        setCurrentStep(1);
        return;
      }

      const { error } = await supabase
        .from('appointments')
        .insert({
          patient_id: patientRecord.id,
          doctor_id: selectedDoctor.id,
          appointment_date: selectedDate,
          start_time: startTime,
          end_time: endTime,
          service_type: 'General Consultation',
          fee: selectedDoctor.consultation_fee || 0,
          status: 'scheduled'
        });

      if (error) {
        console.error('Error creating appointment:', error);
        if (error.code === '23505') {
          toast.error("This time slot is no longer available. Please select a different time.");
          setCurrentStep(1);
        } else if (error.code === '23503') {
          toast.error("Invalid doctor or patient record. Please refresh and try again.");
        } else {
          toast.error(`Failed to book appointment: ${error.message || 'Unknown error'}`);
        }
        return;
      }

      toast.success("Appointment booked successfully!");
      setCurrentStep(3);
    } catch (error) {
      console.error('Unexpected error:', error);
      toast.error("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (isLoadingData) {
    return (
      <div className="min-h-screen bg-muted py-12">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
          </div>
        </div>
      </div>
    );
  }

  if (profile && profile.role !== 'patient') {
    return (
      <div className="min-h-screen bg-muted py-12">
        <div className="container mx-auto px-4 lg:px-6">
          <Card className="medical-card max-w-md mx-auto">
            <CardContent className="p-8 text-center">
              <h2 className="text-xl font-bold text-primary mb-4">Access Restricted</h2>
              <p className="text-muted-foreground mb-6">
                Only patients can book appointments. Please log in with a patient account.
              </p>
              <Button asChild>
                <Link to="/auth">Go to Login</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Check if no doctors are available
  if (!isLoadingData && doctors.length === 0) {
    return (
      <div className="min-h-screen bg-muted py-12">
        <div className="container mx-auto px-4 lg:px-6">
          <Button asChild variant="ghost" className="mb-6">
            <Link to="/">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Link>
          </Button>
          
          <Card className="medical-card max-w-md mx-auto">
            <CardContent className="p-8 text-center">
              <h2 className="text-xl font-bold text-primary mb-4">No Doctors Available</h2>
              <p className="text-muted-foreground mb-6">
                We currently don't have any doctors available for appointments. 
                Please check back later or contact our support team.
              </p>
              <div className="space-y-3">
                <Button onClick={() => window.location.reload()} className="w-full">
                  Refresh Page
                </Button>
                <Button asChild variant="outline" className="w-full">
                  <Link to="/">Go to Home</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (currentStep === 1) {
    return (
      <div className="min-h-screen bg-muted py-12">
        <div className="container mx-auto px-4 lg:px-6">
          <Button asChild variant="ghost" className="mb-6">
            <Link to="/">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Link>
          </Button>

          <Card className="medical-card">
            <CardHeader>
              <CardTitle className="text-3xl text-primary">Schedule Your Service</CardTitle>
              <CardDescription>
                Check out our availability and book the date and time that works for you.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid lg:grid-cols-3 gap-8">
                {/* Calendar */}
                <div className="lg:col-span-2">
                  <div className="mb-6">
                    <h2 className="text-xl font-bold text-primary mb-4">Select Date</h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {Array.from({ length: 14 }, (_, i) => {
                        const date = new Date();
                        date.setDate(date.getDate() + i);
                        const dateStr = date.toISOString().split('T')[0];
                        const isSelected = selectedDate === dateStr;
                        
                        return (
                          <Button
                            key={dateStr}
                            variant={isSelected ? "default" : "outline"}
                            className="p-3 h-auto flex-col"
                            onClick={() => setSelectedDate(dateStr)}
                          >
                            <div className="text-sm font-medium">
                              {date.toLocaleDateString('en-US', { weekday: 'short' })}
                            </div>
                            <div className="text-lg">
                              {date.getDate()}
                            </div>
                            <div className="text-xs">
                              {date.toLocaleDateString('en-US', { month: 'short' })}
                            </div>
                          </Button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Time Slots */}
                <div>
                  <h3 className="text-lg font-bold text-primary mb-4">
                    Available Times
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    {timeSlots.map((slot) => (
                      <Button
                        key={slot.time}
                        variant={slot.available ? "outline" : "ghost"}
                        disabled={!slot.available}
                        onClick={() => slot.available && handleTimeSelect(slot.time)}
                        className={`w-full ${
                          slot.available 
                            ? "border-primary text-primary hover:bg-primary hover:text-primary-foreground" 
                            : "text-muted-foreground cursor-not-allowed"
                        }`}
                      >
                        {slot.time}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (currentStep === 2) {
    return (
      <div className="min-h-screen bg-muted py-12">
        <div className="container mx-auto px-4 lg:px-6 max-w-2xl">
          <Button 
            variant="ghost" 
            className="mb-6"
            onClick={() => setCurrentStep(1)}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Calendar
          </Button>

          <Card className="medical-card">
            <CardHeader>
              <CardTitle className="text-3xl text-primary">Booking Form</CardTitle>
              <div className="flex items-center gap-4 mt-4">
                <Badge variant="secondary" className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  {selectedDate}
                </Badge>
                <Badge variant="secondary" className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  {selectedTime}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleFormSubmit} className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-primary mb-4 pb-2 border-b border-border">
                    Client Details
                  </h3>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        id="firstName"
                        value={formData.firstName}
                        onChange={(e) => handleInputChange("firstName", e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        value={formData.lastName}
                        onChange={(e) => handleInputChange("lastName", e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => handleInputChange("phone", e.target.value)}
                        required
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-primary mb-4 pb-2 border-b border-border">
                    Payment Details
                  </h3>
                  <div className="space-y-4">
                    <p className="text-muted-foreground">
                      Total: <span className="font-bold text-primary text-xl">Free</span>
                    </p>
                    <p className="text-sm text-muted-foreground">
                      No charges for initial consultations. We're here to help!
                    </p>
                  </div>
                </div>

                <Button 
                  type="submit" 
                  variant="accent" 
                  size="lg" 
                  className="w-full"
                  disabled={isLoading}
                >
                  {isLoading ? "Booking..." : "Confirm Booking"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted py-24">
      <div className="container mx-auto px-4 lg:px-6 max-w-2xl text-center">
        <Card className="medical-card">
          <CardContent className="p-12">
            <CheckCircle className="w-16 h-16 mx-auto text-success mb-6" />
            <h1 className="text-3xl font-extrabold text-primary mb-2">
              Thank you, {formData.firstName}!
            </h1>
            <p className="text-muted-foreground mb-6">
              Your booking is confirmed for {selectedDate} at {selectedTime}.
            </p>
            <div className="space-y-4 text-left max-w-md mx-auto mb-8">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Service:</span>
                <span className="font-medium">Appointment Scheduling</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Date & Time:</span>
                <span className="font-medium">{selectedDate}, {selectedTime}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total:</span>
                <span className="font-medium">Free</span>
              </div>
            </div>
            <div className="flex gap-4 justify-center">
              <Button asChild variant="default" size="lg">
                <Link to="/">Back to Home</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link to="/patient-info">View My Appointments</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}