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
    
    const { data: patientData } = await supabase
      .from('patients')
      .select('id')
      .eq('profile_id', profile.id)
      .single();

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

      setBookings(appointmentsData || []);
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
            Account Settings
          </h1>
          <p className="text-muted-foreground">
            Manage your profile, bookings, and preferences.
          </p>
        </div>

        <Tabs defaultValue="personal" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="personal" className="flex items-center gap-2">
              <User className="w-4 h-4" />
              <span className="hidden sm:inline">Personal</span>
            </TabsTrigger>
            <TabsTrigger value="wallet" className="flex items-center gap-2">
              <Wallet className="w-4 h-4" />
              <span className="hidden sm:inline">Wallet</span>
            </TabsTrigger>
            <TabsTrigger value="bookings" className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span className="hidden sm:inline">Bookings</span>
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
                  Manage Bookings
                </CardTitle>
                <CardDescription>
                  View and manage your upcoming appointments.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {bookings.length === 0 ? (
                  <div className="text-center py-12">
                    <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No bookings found.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                     {bookings.map((booking) => (
                       <div
                         key={booking.id}
                         className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center p-4 border border-border rounded-lg"
                       >
                         <div>
                           <p className="font-semibold">{booking.service_type || 'General Consultation'}</p>
                           <Badge variant="secondary" className="mt-1">{booking.status}</Badge>
                         </div>
                         <div className="text-muted-foreground">
                           {new Date(booking.appointment_date).toLocaleDateString('en-US', { 
                             weekday: 'long', 
                             year: 'numeric', 
                             month: 'short', 
                             day: 'numeric' 
                           })} @ {booking.start_time}
                         </div>
                         <div className="text-muted-foreground">
                           Dr. {booking.doctors?.profiles?.first_name} {booking.doctors?.profiles?.last_name}
                         </div>
                         <div className="flex gap-2">
                           <Button variant="outline" size="sm">
                             Reschedule
                           </Button>
                           <Button variant="destructive" size="sm">
                             Cancel
                           </Button>
                         </div>
                       </div>
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