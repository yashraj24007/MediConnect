import { useState, useEffect, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { User, Wallet, Calendar, Settings, Edit3, CreditCard, Mail, Lock, Bell, Shield, Trash2, AlertTriangle } from "lucide-react";
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
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isEditingPersonal, setIsEditingPersonal] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
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

  const handleChangePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("New passwords don't match");
      return;
    }

    if (passwordData.newPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    setIsChangingPassword(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password: passwordData.newPassword
      });

      if (error) throw error;

      toast.success("Password changed successfully!");
      setShowPasswordDialog(false);
      setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (error: any) {
      console.error('Error changing password:', error);
      toast.error(error.message || "Failed to change password");
    } finally {
      setIsChangingPassword(false);
    }
  };

  const handleResetPassword = async () => {
    if (!user?.email) return;

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(user.email, {
        redirectTo: `${window.location.origin}/auth?reset=true`,
      });

      if (error) throw error;

      toast.success("Password reset email sent! Check your inbox.");
    } catch (error: any) {
      console.error('Error sending reset email:', error);
      toast.error(error.message || "Failed to send reset email");
    }
  };

  const handleDeleteAccount = async () => {
    if (!user?.id) return;
    
    setIsDeleting(true);
    try {
      // First, try to delete all user data
      if (profile?.id) {
        // Delete patient records and appointments
        const { data: patientData } = await supabase
          .from('patients')
          .select('id')
          .eq('profile_id', profile.id)
          .maybeSingle();

        if (patientData) {
          // Delete appointments
          await supabase
            .from('appointments')
            .delete()
            .eq('patient_id', patientData.id);

          // Delete patient record
          await supabase
            .from('patients')
            .delete()
            .eq('id', patientData.id);
        }

        // Delete profile
        await supabase
          .from('profiles')
          .delete()
          .eq('id', profile.id);
      }

      // Sign out the user
      await signOut();
      
      // Clear local storage
      localStorage.removeItem('demoAppointments');
      
      toast.success("Account deleted successfully");
      navigate('/auth');
    } catch (error) {
      console.error('Error deleting account:', error);
      toast.error("Failed to delete account. Please contact support.");
    } finally {
      setIsDeleting(false);
      setShowDeleteDialog(false);
    }
  };

  return (
    <div className="min-h-screen bg-muted py-12">
      <div className="container mx-auto px-4 lg:px-6 max-w-5xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-primary mb-2">
            Account Settings
          </h1>
          <p className="text-muted-foreground">
            Manage your personal information and account preferences.
          </p>
        </div>

        <div className="space-y-6">
          {/* Personal Information */}
          <Card className="medical-card">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5 text-primary" />
                  Personal Information
                </CardTitle>
                <Button
                  variant={isEditingPersonal ? "default" : "outline"}
                  size="sm"
                  onClick={() => isEditingPersonal ? handlePersonalInfoSave() : setIsEditingPersonal(true)}
                >
                  {isEditingPersonal ? "Save Changes" : (
                    <>
                      <Edit3 className="w-4 h-4 mr-2" />
                      Edit
                    </>
                  )}
                </Button>
              </div>
              <CardDescription>
                Update your personal details and contact information
              </CardDescription>
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

          {/* Login & Security */}
          <Card className="medical-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="w-5 h-5 text-primary" />
                Login & Security
              </CardTitle>
              <CardDescription>
                Manage your email and password
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between py-3 border-b border-border">
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Email Address</p>
                    <p className="text-sm text-muted-foreground">{personalInfo.email}</p>
                  </div>
                </div>
                <Badge variant="secondary">Verified</Badge>
              </div>
              
              <div className="flex items-center justify-between py-3">
                <div className="flex items-center gap-3">
                  <Lock className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Password</p>
                    <p className="text-sm text-muted-foreground">••••••••</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setShowPasswordDialog(true)}
                  >
                    Change Password
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={handleResetPassword}
                  >
                    Reset
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Wallet & Payment */}
          <Card className="medical-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wallet className="w-5 h-5 text-primary" />
                Wallet & Payment Methods
              </CardTitle>
              <CardDescription>
                Manage your payment methods and billing information
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <CreditCard className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground mb-4">No payment methods saved yet</p>
                <Button 
                  variant="outline"
                  onClick={() => toast.info("Payment method integration coming soon!")}
                >
                  <CreditCard className="w-4 h-4 mr-2" />
                  Add Payment Method
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Notifications */}
          <Card className="medical-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="w-5 h-5 text-primary" />
                Notifications
              </CardTitle>
              <CardDescription>
                Configure how you receive notifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between py-3 border-b border-border">
                <div>
                  <p className="font-medium">Email Notifications</p>
                  <p className="text-sm text-muted-foreground">Receive appointment reminders and updates via email</p>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => toast.info("Email notification settings coming soon!")}
                >
                  Configure
                </Button>
              </div>
              
              <div className="flex items-center justify-between py-3 border-b border-border">
                <div>
                  <p className="font-medium">SMS Notifications</p>
                  <p className="text-sm text-muted-foreground">Get text messages for important updates</p>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => toast.info("SMS notification settings coming soon!")}
                >
                  Configure
                </Button>
              </div>

              <div className="flex items-center justify-between py-3">
                <div>
                  <p className="font-medium">Push Notifications</p>
                  <p className="text-sm text-muted-foreground">Receive browser notifications</p>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => {
                    if ('Notification' in window) {
                      Notification.requestPermission().then(permission => {
                        if (permission === 'granted') {
                          toast.success("Push notifications enabled!");
                        } else {
                          toast.error("Push notifications permission denied");
                        }
                      });
                    } else {
                      toast.error("Push notifications not supported in your browser");
                    }
                  }}
                >
                  Enable
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Privacy & Security */}
          <Card className="medical-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-primary" />
                Privacy & Security
              </CardTitle>
              <CardDescription>
                Control your privacy settings and data sharing
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between py-3 border-b border-border">
                <div>
                  <p className="font-medium">Data Sharing</p>
                  <p className="text-sm text-muted-foreground">Control who can see your medical information</p>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => toast.info("Data sharing settings coming soon!")}
                >
                  Manage
                </Button>
              </div>
              
              <div className="flex items-center justify-between py-3 border-b border-border">
                <div>
                  <p className="font-medium">Two-Factor Authentication</p>
                  <p className="text-sm text-muted-foreground">Add an extra layer of security</p>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => toast.info("Two-factor authentication coming soon!")}
                >
                  Enable
                </Button>
              </div>

              <div className="flex items-center justify-between py-3">
                <div>
                  <p className="font-medium">Active Sessions</p>
                  <p className="text-sm text-muted-foreground">Manage devices logged into your account</p>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={async () => {
                    try {
                      const { data: { session } } = await supabase.auth.getSession();
                      if (session) {
                        toast.success(`Current session: ${session.user.email}`);
                      }
                    } catch (error) {
                      toast.error("Failed to fetch session info");
                    }
                  }}
                >
                  View
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Danger Zone */}
          <Card className="medical-card border-destructive/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-destructive">
                <AlertTriangle className="w-5 h-5" />
                Danger Zone
              </CardTitle>
              <CardDescription>
                Irreversible actions for your account
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between py-3">
                <div>
                  <p className="font-medium">Delete Account</p>
                  <p className="text-sm text-muted-foreground">
                    Permanently delete your account and all associated data. This action cannot be undone.
                  </p>
                </div>
                <Button 
                  variant="destructive" 
                  size="sm"
                  onClick={() => setShowDeleteDialog(true)}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete Account
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Change Password Dialog */}
      <Dialog open={showPasswordDialog} onOpenChange={setShowPasswordDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Lock className="w-5 h-5" />
              Change Password
            </DialogTitle>
            <DialogDescription>
              Enter your new password below. Make sure it's at least 6 characters long.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="newPassword">New Password</Label>
              <Input
                id="newPassword"
                type="password"
                value={passwordData.newPassword}
                onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                placeholder="Enter new password"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm New Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={passwordData.confirmPassword}
                onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                placeholder="Confirm new password"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowPasswordDialog(false);
                setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
              }}
              disabled={isChangingPassword}
            >
              Cancel
            </Button>
            <Button
              onClick={handleChangePassword}
              disabled={isChangingPassword || !passwordData.newPassword || !passwordData.confirmPassword}
            >
              {isChangingPassword ? "Changing..." : "Change Password"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Account Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="w-5 h-5" />
              Delete Account
            </DialogTitle>
            <DialogDescription className="space-y-2 pt-2">
              <p>Are you sure you want to delete your account? This action will:</p>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>Permanently delete all your personal information</li>
                <li>Cancel all scheduled appointments</li>
                <li>Remove all your medical records and history</li>
                <li>Delete all saved payment methods</li>
              </ul>
              <p className="font-semibold pt-2">This action cannot be undone!</p>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setShowDeleteDialog(false)}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteAccount}
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Yes, Delete My Account"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}