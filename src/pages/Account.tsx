import { useState, useEffect, useCallback } from "react";
import { useLocation } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { User, Wallet, Calendar, Settings, Edit3, CreditCard } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Appointment {
  id: string;
  appointment_date: string;
  start_time: string;
  end_time?: string;
  service_type?: string;
  status: string;
  fee: number;
  doctors?: {
    id: string;
    specialty: string;
    profiles?: {
      first_name: string;
      last_name: string;
    };
  };
}

export default function Account() {
  const { user, profile } = useAuth();
  const location = useLocation();
  const [isEditingPersonal, setIsEditingPersonal] = useState(false);
  const [personalInfo, setPersonalInfo] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    dob: "",
    address: "",
    email: ""
  });
  const [bookings, setBookings] = useState<Appointment[]>([]);

  const fetchBookings = useCallback(async () => {
    if (!profile?.id) return;
    
    try {
      const { data: patientData } = await supabase
        .from('patients')
        .select('id')
        .eq('profile_id', profile.id)
        .single();

      let allBookings: any[] = [];

      // Fetch real appointments from database
      if (patientData) {
        const { data: appointmentsData } = await supabase
          .from('appointments')
          .select(`
            *,
            doctors (
              id,
              specialty,
              profiles (
                first_name,
                last_name
              )
            )
          `)
          .eq('patient_id', patientData.id)
          .order('appointment_date', { ascending: true });

        allBookings = appointmentsData || [];
      }

      // Add demo appointments from localStorage
      const demoAppointments = JSON.parse(localStorage.getItem('demoAppointments') || '[]');
      const formattedDemoAppointments = demoAppointments.map((demo: any) => ({
        id: demo.id,
        appointment_date: demo.appointment_date,
        start_time: demo.start_time,
        service_type: demo.service_type,
        status: demo.status,
        fee: demo.fee,
        notes: null,
        doctors: {
          id: 'demo',
          specialty: demo.specialty,
          profiles: {
            first_name: demo.doctor_name.replace('Dr. ', '').split(' ')[0],
            last_name: demo.doctor_name.replace('Dr. ', '').split(' ')[1] || ''
          }
        },
        is_demo: true
      }));

      // Combine and sort all appointments
      allBookings = [...allBookings, ...formattedDemoAppointments].sort((a, b) => 
        new Date(a.appointment_date).getTime() - new Date(b.appointment_date).getTime()
      );

      setBookings(allBookings);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      // If there's an error, still show demo appointments
      const demoAppointments = JSON.parse(localStorage.getItem('demoAppointments') || '[]');
      const formattedDemoAppointments = demoAppointments.map((demo: any) => ({
        id: demo.id,
        appointment_date: demo.appointment_date,
        start_time: demo.start_time,
        service_type: demo.service_type,
        status: demo.status,
        fee: demo.fee,
        notes: null,
        doctors: {
          id: 'demo',
          specialty: demo.specialty,
          profiles: {
            first_name: demo.doctor_name.replace('Dr. ', '').split(' ')[0],
            last_name: demo.doctor_name.replace('Dr. ', '').split(' ')[1] || ''
          }
        },
        is_demo: true
      }));
      
      setBookings(formattedDemoAppointments);
    }
  }, [profile?.id]);

  useEffect(() => {
    if (profile) {
      setPersonalInfo({
        firstName: profile.first_name || "",
        lastName: profile.last_name || "",
        phone: profile.phone || "",
        dob: profile.date_of_birth || "",
        address: profile.address || "",
        email: profile.email || ""
      });
    }
  }, [profile]);

  useEffect(() => {
    if (user && profile) {
      fetchBookings();
    }
  }, [user, profile, fetchBookings]);

  // Refresh bookings when navigating to this page
  useEffect(() => {
    if (location.pathname === '/account' && user && profile) {
      fetchBookings();
    }
  }, [location.pathname, user, profile, fetchBookings]);

  const handlePersonalInfoSave = async () => {
    if (!profile?.id) return;
    
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          first_name: personalInfo.firstName,
          last_name: personalInfo.lastName,
          phone: personalInfo.phone,
          date_of_birth: personalInfo.dob,
          address: personalInfo.address
        })
        .eq('id', profile.id);

      if (error) throw error;
      
      toast.success("Profile updated successfully!");
      setIsEditingPersonal(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error("Failed to update profile");
    }
  };

  const handlePersonalInfoChange = (field: string, value: string) => {
    setPersonalInfo(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-muted py-12">
      <div className="container mx-auto px-4 lg:px-6">
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-primary mb-2">
            My Appointments
          </h1>
          <p className="text-muted-foreground">
            View and manage your upcoming appointments and medical consultations.
          </p>
        </div>

        <Tabs defaultValue="bookings" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="bookings" className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span className="hidden sm:inline">Bookings</span>
            </TabsTrigger>
            <TabsTrigger value="personal" className="flex items-center gap-2">
              <User className="w-4 h-4" />
              <span className="hidden sm:inline">Personal</span>
            </TabsTrigger>
            <TabsTrigger value="wallet" className="flex items-center gap-2">
              <Wallet className="w-4 h-4" />
              <span className="hidden sm:inline">Wallet</span>
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              <span className="hidden sm:inline">Settings</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="personal" className="space-y-6">
            {/* Personal Info */}
            <Card className="medical-card">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="flex items-center gap-2">
                    <User className="w-5 h-5 text-primary" />
                    Personal Information
                  </CardTitle>
                  <Button
                    variant={isEditingPersonal ? "success" : "outline"}
                    size="sm"
                    onClick={() => isEditingPersonal ? handlePersonalInfoSave() : setIsEditingPersonal(true)}
                  >
                    {isEditingPersonal ? "Save Changes" : (
                      <>
                        <Edit3 className="w-4 h-4 mr-2" />
                        Edit Details
                      </>
                    )}
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First name</Label>
                    <Input
                      id="firstName"
                      value={personalInfo.firstName}
                      onChange={(e) => handlePersonalInfoChange("firstName", e.target.value)}
                      readOnly={!isEditingPersonal}
                      className={!isEditingPersonal ? "bg-muted" : ""}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last name</Label>
                    <Input
                      id="lastName"
                      value={personalInfo.lastName}
                      onChange={(e) => handlePersonalInfoChange("lastName", e.target.value)}
                      readOnly={!isEditingPersonal}
                      className={!isEditingPersonal ? "bg-muted" : ""}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={personalInfo.phone}
                      onChange={(e) => handlePersonalInfoChange("phone", e.target.value)}
                      readOnly={!isEditingPersonal}
                      className={!isEditingPersonal ? "bg-muted" : ""}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dob">Date of Birth</Label>
                    <Input
                      id="dob"
                      type="date"
                      value={personalInfo.dob}
                      onChange={(e) => handlePersonalInfoChange("dob", e.target.value)}
                      readOnly={!isEditingPersonal}
                      className={!isEditingPersonal ? "bg-muted" : ""}
                    />
                  </div>
                  <div className="sm:col-span-2 space-y-2">
                    <Label htmlFor="address">Address</Label>
                    <Input
                      id="address"
                      value={personalInfo.address}
                      onChange={(e) => handlePersonalInfoChange("address", e.target.value)}
                      readOnly={!isEditingPersonal}
                      className={!isEditingPersonal ? "bg-muted" : ""}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Login Info */}
            <Card className="medical-card">
              <CardHeader>
                <CardTitle>Login Information</CardTitle>
                <CardDescription>
                  Manage your email and password.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Login email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={personalInfo.email}
                      readOnly
                      className="bg-muted"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Button variant="outline" size="sm">
                      Change Password
                    </Button>
                    <Button variant="link" size="sm" className="text-muted-foreground">
                      Forgot Password?
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="wallet">
            <Card className="medical-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Wallet className="w-5 h-5 text-primary" />
                  My Wallet
                </CardTitle>
                <CardDescription>
                  Manage your payment methods and billing information.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <CreditCard className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground mb-4">No payment methods saved.</p>
                  <Button variant="outline">Add Payment Method</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="bookings">
            <Card className="medical-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-primary" />
                  My Appointments
                </CardTitle>
                <CardDescription>
                  View and manage your upcoming appointments and medical consultations.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {bookings.length === 0 ? (
                  <div className="text-center py-16">
                    <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
                      <Calendar className="w-12 h-12 text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">No appointments yet</h3>
                    <p className="text-muted-foreground mb-6">Schedule your first appointment with our expert medical team.</p>
                    <Button asChild className="btn-modern">
                      <a href="/booking">
                        <Calendar className="w-4 h-4 mr-2" />
                        Book Appointment
                      </a>
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-muted-foreground">
                        You have {bookings.length} appointment{bookings.length !== 1 ? 's' : ''}
                      </p>
                      <Button asChild variant="outline" size="sm">
                        <a href="/booking">
                          <Calendar className="w-4 h-4 mr-2" />
                          Book New
                        </a>
                      </Button>
                    </div>
                    
                    {bookings.map((booking) => (
                       <Card
                         key={booking.id}
                         className="modern-card hover:shadow-lg transition-all duration-300 border-l-4 border-l-primary"
                       >
                         <CardContent className="p-6">
                           <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-start">
                             <div className="space-y-2">
                               <h4 className="font-semibold text-lg">{booking.service_type || 'General Consultation'}</h4>
                               <Badge 
                                 variant={booking.status === 'scheduled' ? 'default' : booking.status === 'completed' ? 'secondary' : 'destructive'} 
                                 className="w-fit"
                               >
                                 {booking.status === 'scheduled' ? '🕒 Scheduled' : 
                                  booking.status === 'completed' ? '✅ Completed' : 
                                  booking.status === 'cancelled' ? '❌ Cancelled' : booking.status}
                               </Badge>
                               {booking.fee && (
                                 <p className="text-sm text-muted-foreground">Fee: ₹{booking.fee}</p>
                               )}
                             </div>
                             
                             <div className="space-y-1">
                               <p className="font-medium text-primary">
                                 📅 {new Date(booking.appointment_date).toLocaleDateString('en-US', { 
                                   weekday: 'long', 
                                   year: 'numeric', 
                                   month: 'short', 
                                   day: 'numeric' 
                                 })}
                               </p>
                               <p className="text-sm text-muted-foreground">
                                 🕐 {booking.start_time} - {booking.end_time || 'TBD'}
                               </p>
                             </div>
                             
                             <div className="space-y-1">
                               <p className="font-medium">
                                 👨‍⚕️ Dr. {booking.doctors?.profiles?.first_name} {booking.doctors?.profiles?.last_name}
                               </p>
                               <p className="text-sm text-muted-foreground">
                                 {booking.doctors?.specialty}
                               </p>
                             </div>
                             
                             <div className="flex flex-col gap-2 md:items-end">
                               {booking.status === 'scheduled' && (
                                 <>
                                   <Button variant="outline" size="sm" className="w-full md:w-auto">
                                     📝 Reschedule
                                   </Button>
                                   <Button variant="destructive" size="sm" className="w-full md:w-auto">
                                     ❌ Cancel
                                   </Button>
                                 </>
                               )}
                               {booking.status === 'completed' && (
                                 <Button variant="outline" size="sm" className="w-full md:w-auto">
                                   📄 View Report
                                 </Button>
                               )}
                               <p className="text-xs text-muted-foreground">
                                 ID: #{booking.id.slice(0, 8)}
                               </p>
                             </div>
                           </div>
                         </CardContent>
                       </Card>
                     ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings">
            <Card className="medical-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="w-5 h-5 text-primary" />
                  Account Settings
                </CardTitle>
                <CardDescription>
                  Manage your account preferences and privacy settings.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="flex items-center justify-between py-4 border-b border-border">
                    <div>
                      <h4 className="font-medium">Email Notifications</h4>
                      <p className="text-sm text-muted-foreground">Receive appointment reminders and updates</p>
                    </div>
                    <Button variant="outline" size="sm">Configure</Button>
                  </div>
                  
                  <div className="flex items-center justify-between py-4 border-b border-border">
                    <div>
                      <h4 className="font-medium">Privacy Settings</h4>
                      <p className="text-sm text-muted-foreground">Control who can see your information</p>
                    </div>
                    <Button variant="outline" size="sm">Manage</Button>
                  </div>
                  
                  <div className="flex items-center justify-between py-4">
                    <div>
                      <h4 className="font-medium">Delete Account</h4>
                      <p className="text-sm text-muted-foreground">Permanently delete your account and data</p>
                    </div>
                    <Button variant="destructive" size="sm">Delete</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}