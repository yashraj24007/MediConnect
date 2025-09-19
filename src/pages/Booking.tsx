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
import { ChatWidget } from "@/components/Chat/ChatWidget";

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
        // Use sample doctors for testing if database is not ready
        setSampleDoctors();
        return;
      }
      
      if (data && data.length > 0) {
        setDoctors(data);
        setSelectedDoctor(data[0]);
        toast.success(`Found ${data.length} doctors available for booking`);
      } else {
        // Use sample doctors for testing when no doctors in database
        console.log('No doctors in database, using sample data for testing');
        setSampleDoctors();
      }
    } catch (error) {
      console.error('Unexpected error fetching doctors:', error);
      // Use sample doctors as fallback
      setSampleDoctors();
    }
  };

  const setSampleDoctors = () => {
    const sampleDoctors = [
      {
        id: 'sample-1',
        specialty: 'Cardiologist',
        years_experience: 15,
        bio: 'Leading interventional cardiologist with extensive experience in complex cardiac procedures.',
        license_number: 'MED001001',
        consultation_fee: 500,
        profiles: {
          first_name: 'Rajesh',
          last_name: 'Kumar',
          email: 'dr.rajesh.kumar@mediconnect.com'
        }
      },
      {
        id: 'sample-2', 
        specialty: 'Gynecologist',
        years_experience: 12,
        bio: 'Specialist in obstetrics & gynecology with fellowship in laparoscopy.',
        license_number: 'MED001002',
        consultation_fee: 600,
        profiles: {
          first_name: 'Priya',
          last_name: 'Sharma',
          email: 'dr.priya.sharma@mediconnect.com'
        }
      },
      {
        id: 'sample-3',
        specialty: 'Orthopedic Surgeon', 
        years_experience: 18,
        bio: 'Orthopedic surgeon with fellowship in joint replacement and sports medicine.',
        license_number: 'MED001003',
        consultation_fee: 700,
        profiles: {
          first_name: 'Anil',
          last_name: 'Reddy', 
          email: 'dr.anil.reddy@mediconnect.com'
        }
      },
      {
        id: 'sample-4',
        specialty: 'Pediatrician',
        years_experience: 10,
        bio: 'Pediatrician with fellowship in neonatology and child healthcare.',
        license_number: 'MED001004',
        consultation_fee: 450,
        profiles: {
          first_name: 'Meena',
          last_name: 'Rao',
          email: 'dr.meena.rao@mediconnect.com'
        }
      },
      {
        id: 'sample-5',
        specialty: 'Neurologist',
        years_experience: 14,
        bio: 'Neurologist specializing in brain disorders and stroke care.',
        license_number: 'MED001005',
        consultation_fee: 650,
        profiles: {
          first_name: 'Suresh',
          last_name: 'Gupta',
          email: 'dr.suresh.gupta@mediconnect.com'
        }
      },
      {
        id: 'sample-6',
        specialty: 'Dermatologist',
        years_experience: 8,
        bio: 'Dermatologist with fellowship in cosmetic dermatology.',
        license_number: 'MED001006',
        consultation_fee: 550,
        profiles: {
          first_name: 'Kavitha',
          last_name: 'Nair',
          email: 'dr.kavitha.nair@mediconnect.com'
        }
      }
    ];
    
    setDoctors(sampleDoctors);
    setSelectedDoctor(sampleDoctors[0]);
    toast.info("Using sample doctors for testing. Database setup in progress.");
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
    { time: "11:00 AM", available: true },
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
      // Handle sample doctors (for testing without full database setup)
      if (selectedDoctor.id.startsWith('sample-')) {
        await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate network delay
        
        // Create a local appointment record for demo purposes
        const demoAppointment = {
          id: `demo-${Date.now()}`,
          patient_name: `${formData.firstName} ${formData.lastName}`,
          doctor_name: `Dr. ${selectedDoctor.profiles.first_name} ${selectedDoctor.profiles.last_name}`,
          specialty: selectedDoctor.specialty,
          appointment_date: selectedDate,
          start_time: selectedTime,
          status: 'scheduled',
          service_type: 'General Consultation',
          fee: selectedDoctor.consultation_fee || 0
        };
        
        // Store in localStorage for demo purposes (since this is a sample doctor)
        const existingDemoAppointments = JSON.parse(localStorage.getItem('demoAppointments') || '[]');
        existingDemoAppointments.push(demoAppointment);
        localStorage.setItem('demoAppointments', JSON.stringify(existingDemoAppointments));
        
        toast.success(`✅ Demo appointment booked with Dr. ${selectedDoctor.profiles.first_name} ${selectedDoctor.profiles.last_name}! Check your appointments in the Account page.`);
        setCurrentStep(3);
        return;
      }

      // Real doctor booking process
      if (!patientRecord) {
        toast.error("Patient record not found. Please refresh and try again.");
        return;
      }

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

      toast.success("🎉 Appointment booked successfully! You can view it in your account under 'My Appointments'.");
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
      <div className="min-h-screen bg-background py-12">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-32 w-32 border-b-4 border-primary/25 border-t-4 border-t-primary mx-auto mb-4"></div>
              <p className="text-primary font-medium">Loading available doctors...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (profile && profile.role !== 'patient') {
    return (
      <div className="min-h-screen bg-background py-12">
        <div className="container mx-auto px-4 lg:px-6">
          <Card className="bg-card/95 backdrop-blur-sm border-destructive/20 shadow-xl max-w-md mx-auto">
            <CardContent className="p-8 text-center">
              <div className="bg-destructive/10 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <span className="text-destructive text-2xl">⚠️</span>
              </div>
              <h2 className="text-xl font-bold text-destructive mb-4">Access Restricted</h2>
              <p className="text-destructive mb-6">
                Only patients can book appointments. Please log in with a patient account.
              </p>
              <Button asChild className="bg-destructive hover:bg-destructive/90 text-destructive-foreground">
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
      <div className="min-h-screen bg-background py-12">
        <div className="container mx-auto px-4 lg:px-6">
          <Button asChild variant="ghost" className="mb-6 text-orange-700 hover:text-orange-900 hover:bg-orange-100">
            <Link to="/">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Link>
          </Button>
          
          <Card className="bg-card/95 backdrop-blur-sm border-warning/20 shadow-xl max-w-md mx-auto">
            <CardContent className="p-8 text-center">
              <div className="bg-warning/10 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <span className="text-warning text-2xl">🩺</span>
              </div>
              <h2 className="text-xl font-bold text-warning mb-4">No Doctors Available</h2>
              <p className="text-warning mb-6">
                We currently don't have any doctors available for appointments. 
                Please check back later or contact our support team.
              </p>
              <div className="space-y-3">
                <Button 
                  onClick={() => window.location.reload()} 
                  className="w-full bg-warning hover:bg-warning/90 text-warning-foreground"
                >
                  Refresh Page
                </Button>
                <Button asChild variant="outline" className="w-full border-orange-300 text-orange-700 hover:bg-orange-50">
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
      <div className="min-h-screen bg-background py-12">
        <div className="container mx-auto px-4 lg:px-6">
          <Button asChild variant="ghost" className="mb-6 text-primary hover:text-primary/80 hover:bg-primary/10">
            <Link to="/">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Link>
          </Button>

          <Card className="bg-card/90 backdrop-blur-sm border-border shadow-xl">
            <CardHeader className="bg-primary/10 rounded-t-lg">
              <CardTitle className="text-3xl text-foreground font-bold">Schedule Your Service</CardTitle>
              <CardDescription className="text-muted-foreground">
                Check out our availability and book the date and time that works for you.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-8">
              <div className="grid lg:grid-cols-3 gap-8">
                {/* Calendar */}
                <div className="lg:col-span-2">
                  <div className="mb-6">
                    <h2 className="text-xl font-bold text-foreground mb-4 flex items-center">
                      <Calendar className="w-5 h-5 mr-2 text-primary" />
                      Select Date
                    </h2>
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
                            className={`p-4 h-auto flex-col transition-all duration-200 ${
                              isSelected 
                                ? "bg-gradient-to-br from-primary to-accent text-primary-foreground shadow-lg shadow-primary/20" 
                                : "border-border text-primary hover:bg-primary/10 hover:border-primary/30 hover:shadow-md"
                            }`}
                            onClick={() => setSelectedDate(dateStr)}
                          >
                            <div className="text-sm font-medium">
                              {date.toLocaleDateString('en-US', { weekday: 'short' })}
                            </div>
                            <div className="text-lg font-bold">
                              {date.getDate()}
                            </div>
                            <div className="text-xs opacity-80">
                              {date.toLocaleDateString('en-US', { month: 'short' })}
                            </div>
                          </Button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Time Slots */}
                <div className="bg-gradient-to-br from-primary/5 to-accent/5 p-6 rounded-xl border border-border">
                  <h3 className="text-lg font-bold text-foreground mb-4 flex items-center">
                    <Clock className="w-5 h-5 mr-2 text-primary" />
                    Available Times
                  </h3>
                  <div className="grid grid-cols-1 gap-3">
                    {timeSlots.map((slot) => (
                      <Button
                        key={slot.time}
                        variant={slot.available ? "outline" : "ghost"}
                        disabled={!slot.available}
                        onClick={() => slot.available && handleTimeSelect(slot.time)}
                        className={`w-full transition-all duration-200 ${
                          slot.available 
                            ? "border-primary/30 text-primary hover:bg-gradient-to-r hover:from-primary hover:to-accent hover:text-primary-foreground hover:shadow-lg" 
                            : "text-gray-400 cursor-not-allowed opacity-50"
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
      <div className="min-h-screen bg-background py-12">
        <div className="container mx-auto px-4 lg:px-6 max-w-2xl">
          <Button 
            variant="ghost" 
            className="mb-6 text-primary hover:text-primary/80 hover:bg-primary/10"
            onClick={() => setCurrentStep(1)}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Calendar
          </Button>

          <Card className="bg-card/95 backdrop-blur-sm border-border shadow-xl shadow-primary/5">
            <CardHeader className="bg-gradient-to-r from-accent/10 via-primary/10 to-secondary/10 rounded-t-lg">
              <CardTitle className="text-3xl text-foreground font-bold">Booking Form</CardTitle>
              <div className="flex items-center gap-4 mt-4">
                <Badge variant="secondary" className="flex items-center gap-2 bg-accent/20 text-primary border-border">
                  <Calendar className="w-4 h-4" />
                  {selectedDate}
                </Badge>
                <Badge variant="secondary" className="flex items-center gap-2 bg-primary/20 text-primary border-border">
                  <Clock className="w-4 h-4" />
                  {selectedTime}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="p-8">
              <form onSubmit={handleFormSubmit} className="space-y-8">
                <div className="bg-gradient-to-r from-accent/5 to-primary/5 p-6 rounded-xl border border-border">
                  <h3 className="text-xl font-bold text-foreground mb-4 pb-2 border-b border-border">
                    Client Details
                  </h3>
                  <div className="grid sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="firstName" className="text-green-700 font-medium">First Name</Label>
                      <Input
                        id="firstName"
                        value={formData.firstName}
                        onChange={(e) => handleInputChange("firstName", e.target.value)}
                        required
                        className="border-border focus:border-primary focus:ring-primary/20"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName" className="text-foreground font-medium">Last Name</Label>
                      <Input
                        id="lastName"
                        value={formData.lastName}
                        onChange={(e) => handleInputChange("lastName", e.target.value)}
                        required
                        className="border-border focus:border-primary focus:ring-primary/20"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-foreground font-medium">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                        required
                        className="border-green-200 focus:border-green-400 focus:ring-green-200"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone" className="text-green-700 font-medium">Phone</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => handleInputChange("phone", e.target.value)}
                        required
                        className="border-green-200 focus:border-green-400 focus:ring-green-200"
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-primary/5 to-accent/5 p-6 rounded-xl border border-border">
                  <h3 className="text-xl font-bold text-foreground mb-4 pb-2 border-b border-border">
                    Payment Details
                  </h3>
                  <div className="space-y-4">
                    <p className="text-purple-600">
                      Total: <span className="font-bold text-green-600 text-2xl">Free</span>
                    </p>
                    <p className="text-sm text-purple-600 bg-purple-100 p-3 rounded-lg">
                      This appointment is provided at no cost as part of our community health initiative.
                    </p>
                  </div>
                </div>

                <Button 
                  type="submit" 
                  variant="default" 
                  size="lg" 
                  className="w-full bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-200"
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
    <div className="min-h-screen bg-background py-24">
      <div className="container mx-auto px-4 lg:px-6 max-w-2xl text-center">
        <Card className="bg-card/95 backdrop-blur-sm border-border shadow-xl shadow-primary/5">
          <CardContent className="p-12">
            <div className="bg-gradient-to-br from-primary/10 to-accent/10 p-6 rounded-full w-24 h-24 mx-auto mb-6 flex items-center justify-center">
              <CheckCircle className="w-12 h-12 text-primary" />
            </div>
            <h1 className="text-3xl font-extrabold text-foreground mb-2">
              Thank you, {formData.firstName}!
            </h1>
            <p className="text-green-600 mb-8 text-lg">
              Your booking is confirmed for {selectedDate} at {selectedTime}.
            </p>
            <div className="bg-gradient-to-r from-accent/5 to-primary/5 p-6 rounded-xl border border-border space-y-4 text-left max-w-md mx-auto mb-8">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Service:</span>
                <span className="font-medium text-foreground">Medical Consultation</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Date & Time:</span>
                <span className="font-medium text-foreground">{selectedDate}, {selectedTime}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Doctor:</span>
                <span className="font-medium text-foreground">
                  Dr. {selectedDoctor?.profiles?.first_name} {selectedDoctor?.profiles?.last_name}
                </span>
              </div>
              <div className="flex justify-between items-center border-t border-green-300 pt-4">
                <span className="text-green-700">Total:</span>
                <span className="font-bold text-emerald-600 text-xl">Free</span>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                asChild 
                variant="default" 
                className="flex-1 bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-primary-foreground shadow-lg"
              >
                <Link to="/booking">Book Another</Link>
              </Button>
              <Button 
                asChild 
                variant="outline" 
                className="flex-1 border-green-300 text-green-700 hover:bg-green-50"
              >
                <Link to="/">Go to Home</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* AI Chat Assistant */}
      <ChatWidget />
    </div>
  );
}