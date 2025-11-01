import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Calendar, Clock, MapPin, Phone, X, RefreshCw, CheckCircle, AlertCircle, Loader2, Lightbulb, Sparkles } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { GroqChatService } from "@/services/groqService";

interface Appointment {
  id: string;
  appointment_date: string;
  start_time: string;
  end_time?: string;
  service_type?: string;
  status: string;
  fee: number;
  notes?: string;
  doctors?: {
    id: string;
    specialty: string;
    profiles?: {
      first_name: string;
      last_name: string;
    };
  };
  is_demo?: boolean;
}

export default function MyAppointments() {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);
  const [isRescheduleDialogOpen, setIsRescheduleDialogOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const [newDate, setNewDate] = useState("");
  const [newTime, setNewTime] = useState("");
  const [actionLoading, setActionLoading] = useState(false);
  const [healthSuggestion, setHealthSuggestion] = useState<string>("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showSuggestion, setShowSuggestion] = useState(false);

  const analyzeRecurringIssues = async () => {
    if (appointments.length < 2) {
      toast.error("Need at least 2 appointments to analyze patterns");
      return;
    }

    // Check if API key is configured
    const apiKey = import.meta.env.VITE_GROQ_API_KEY;
    if (!apiKey || apiKey === 'your_groq_api_key_here') {
      toast.error("⚠️ AI Service Not Configured. Please add your Groq API key.");
      return;
    }

    setIsAnalyzing(true);
    setShowSuggestion(true);
    setHealthSuggestion("");

    try {
      // Analyze appointment patterns
      const appointmentHistory = appointments
        .filter(apt => apt.status !== 'cancelled')
        .map(apt => ({
          date: apt.appointment_date,
          specialty: apt.doctors?.specialty || 'General',
          notes: apt.notes || apt.service_type || '',
          status: apt.status
        }));

      // Group by specialty to find recurring visits
      const specialtyCount = appointmentHistory.reduce((acc, apt) => {
        acc[apt.specialty] = (acc[apt.specialty] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const recurringSpecialties = Object.entries(specialtyCount)
        .filter(([_, count]) => count > 1)
        .map(([specialty, count]) => `${specialty} (${count} visits)`);

      const prompt = `As a healthcare AI assistant, analyze this patient's appointment history and provide personalized health suggestions:

**Appointment History:**
${appointmentHistory.map((apt, idx) => `${idx + 1}. Date: ${apt.date}, Specialty: ${apt.specialty}, Notes: ${apt.notes || 'None'}, Status: ${apt.status}`).join('\n')}

**Recurring Specialties:** ${recurringSpecialties.length > 0 ? recurringSpecialties.join(', ') : 'None detected'}

**Total Appointments:** ${appointmentHistory.length}

Based on this history, provide:
1. **Pattern Analysis**: Identify any recurring health concerns or frequent visits to specific specialists
2. **Preventive Measures**: Suggest lifestyle changes, preventive care, or early interventions
3. **Specialist Recommendations**: If needed, recommend additional specialists to consult
4. **Health Tips**: Provide personalized wellness advice based on their visit patterns
5. **Follow-up Suggestions**: Recommend appropriate follow-up care or regular check-ups

Keep the response concise, actionable, and empathetic. Focus on preventive care and improving overall health outcomes.`;

      const response = await GroqChatService.sendMessage(prompt, []);
      setHealthSuggestion(response);

      setTimeout(() => {
        document.getElementById('health-suggestion')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } catch (error) {
      console.error("Error analyzing appointments:", error);
      toast.error("Unable to analyze appointment patterns. Please try again.");
      setHealthSuggestion("Unable to analyze your appointment history at this time. Please consult with your healthcare provider for personalized recommendations.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const fetchAppointments = useCallback(async () => {
    if (!profile?.id) return;
    
    setLoading(true);
    try {
      const { data: patientData } = await supabase
        .from('patients')
        .select('id')
        .eq('profile_id', profile.id)
        .single();

      let allAppointments: any[] = [];

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

        allAppointments = appointmentsData || [];
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
        notes: demo.notes || null,
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
      allAppointments = [...allAppointments, ...formattedDemoAppointments].sort((a, b) => 
        new Date(b.appointment_date).getTime() - new Date(a.appointment_date).getTime()
      );

      setAppointments(allAppointments);
    } catch (error) {
      console.error('Error fetching appointments:', error);
      toast.error("Failed to load appointments");
    } finally {
      setLoading(false);
    }
  }, [profile?.id]);

  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  const handleCancelAppointment = async () => {
    if (!selectedAppointment || !cancelReason.trim()) {
      toast.error("Please provide a reason for cancellation");
      return;
    }

    setActionLoading(true);
    try {
      if (selectedAppointment.is_demo) {
        // Handle demo appointment cancellation
        const demoAppointments = JSON.parse(localStorage.getItem('demoAppointments') || '[]');
        const updatedDemos = demoAppointments.map((appt: any) => 
          appt.id === selectedAppointment.id 
            ? { ...appt, status: 'cancelled', cancel_reason: cancelReason }
            : appt
        );
        localStorage.setItem('demoAppointments', JSON.stringify(updatedDemos));
      } else {
        // Handle real appointment cancellation
        const { error } = await supabase
          .from('appointments')
          .update({ 
            status: 'cancelled',
            notes: `Cancelled: ${cancelReason}`
          })
          .eq('id', selectedAppointment.id);

        if (error) throw error;
      }

      toast.success("Appointment cancelled successfully");
      setIsCancelDialogOpen(false);
      setCancelReason("");
      setSelectedAppointment(null);
      fetchAppointments();
    } catch (error) {
      console.error('Error cancelling appointment:', error);
      toast.error("Failed to cancel appointment");
    } finally {
      setActionLoading(false);
    }
  };

  const handleRescheduleAppointment = async () => {
    if (!selectedAppointment || !newDate || !newTime) {
      toast.error("Please select new date and time");
      return;
    }

    setActionLoading(true);
    try {
      if (selectedAppointment.is_demo) {
        // Handle demo appointment rescheduling
        const demoAppointments = JSON.parse(localStorage.getItem('demoAppointments') || '[]');
        const updatedDemos = demoAppointments.map((appt: any) => 
          appt.id === selectedAppointment.id 
            ? { ...appt, appointment_date: newDate, start_time: newTime, status: 'scheduled' }
            : appt
        );
        localStorage.setItem('demoAppointments', JSON.stringify(updatedDemos));
      } else {
        // Handle real appointment rescheduling
        const { error } = await supabase
          .from('appointments')
          .update({ 
            appointment_date: newDate,
            start_time: newTime,
            status: 'scheduled'
          })
          .eq('id', selectedAppointment.id);

        if (error) throw error;
      }

      toast.success("Appointment rescheduled successfully");
      setIsRescheduleDialogOpen(false);
      setNewDate("");
      setNewTime("");
      setSelectedAppointment(null);
      fetchAppointments();
    } catch (error) {
      console.error('Error rescheduling appointment:', error);
      toast.error("Failed to reschedule appointment");
    } finally {
      setActionLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      scheduled: { color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400", label: "Scheduled" },
      completed: { color: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400", label: "Completed" },
      cancelled: { color: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400", label: "Cancelled" },
      pending: { color: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400", label: "Pending" }
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    return <Badge className={config.color}>{config.label}</Badge>;
  };

  const canCancelOrReschedule = (appointment: Appointment) => {
    if (appointment.status === 'cancelled' || appointment.status === 'completed') {
      return false;
    }
    const appointmentDate = new Date(appointment.appointment_date);
    const today = new Date();
    return appointmentDate > today;
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>Login Required</CardTitle>
            <CardDescription>Please log in to view your appointments</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => navigate('/auth')} className="w-full">
              Go to Login
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-accent/5 py-12">
      <div className="container mx-auto px-4 lg:px-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            My Appointments
          </h1>
          <p className="text-muted-foreground">
            View, reschedule, or cancel your appointments
          </p>
        </div>

        {/* AI Health Suggestion Banner */}
        {appointments.length >= 2 && (
          <Card className="mb-6 bg-gradient-to-r from-purple-500/10 to-blue-500/10 border-purple-200 dark:border-purple-900">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-purple-500/20 rounded-full">
                  <Sparkles className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
                    AI-Powered Health Insights
                    <Badge variant="secondary" className="text-xs">New</Badge>
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Let our AI analyze your appointment history to provide personalized health recommendations and identify patterns in your healthcare needs.
                  </p>
                  <Button 
                    onClick={analyzeRecurringIssues}
                    disabled={isAnalyzing}
                    className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                  >
                    {isAnalyzing ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Analyzing Your Health Patterns...
                      </>
                    ) : (
                      <>
                        <Lightbulb className="w-4 h-4 mr-2" />
                        Get AI Health Suggestions
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* AI Health Suggestion Results */}
        {showSuggestion && healthSuggestion && (
          <Card className="mb-6 border-2 border-purple-500/20" id="health-suggestion">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="w-6 h-6 text-purple-500" />
                Personalized Health Recommendations
              </CardTitle>
              <CardDescription>
                AI analysis based on your appointment history
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="prose prose-sm dark:prose-invert max-w-none whitespace-pre-line">
                {healthSuggestion}
              </div>
              <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  <strong>Important:</strong> These AI-generated suggestions are for informational purposes only and should not replace professional medical advice. Always consult your healthcare provider for personalized medical guidance.
                </p>
              </div>
              <Button 
                variant="outline" 
                onClick={() => setShowSuggestion(false)}
                className="mt-4"
              >
                Close Suggestions
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Appointments List */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : appointments.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Calendar className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
              <h3 className="text-xl font-semibold mb-2">No Appointments Yet</h3>
              <p className="text-muted-foreground mb-6">
                You haven't booked any appointments. Start by booking your first consultation.
              </p>
              <Button onClick={() => navigate('/booking')} className="bg-gradient-to-r from-primary to-accent">
                <Calendar className="w-4 h-4 mr-2" />
                Book Appointment
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6">
            {appointments.map((appointment) => (
              <Card key={appointment.id} className="border-2 hover:shadow-lg transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row gap-6">
                    {/* Doctor Info */}
                    <div className="flex-shrink-0">
                      <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white text-2xl font-bold">
                        {appointment.doctors?.profiles?.first_name?.[0]}
                        {appointment.doctors?.profiles?.last_name?.[0]}
                      </div>
                    </div>

                    {/* Appointment Details */}
                    <div className="flex-1 space-y-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="text-xl font-bold mb-1">
                            Dr. {appointment.doctors?.profiles?.first_name} {appointment.doctors?.profiles?.last_name}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {appointment.doctors?.specialty}
                          </p>
                        </div>
                        {getStatusBadge(appointment.status)}
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Calendar className="w-4 h-4 text-primary" />
                          <span>{new Date(appointment.appointment_date).toLocaleDateString('en-US', { 
                            weekday: 'short', 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric' 
                          })}</span>
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Clock className="w-4 h-4 text-primary" />
                          <span>{appointment.start_time}</span>
                        </div>
                      </div>

                      {appointment.service_type && (
                        <div>
                          <Badge variant="outline" className="text-xs">
                            {appointment.service_type}
                          </Badge>
                        </div>
                      )}

                      {appointment.notes && (
                        <div className="p-3 bg-muted/50 rounded-lg text-sm">
                          <p className="text-muted-foreground">{appointment.notes}</p>
                        </div>
                      )}

                      <div className="flex items-center justify-between pt-3 border-t">
                        <div className="text-lg font-bold text-primary">
                          ₹{appointment.fee}
                        </div>
                        <div className="flex gap-2">
                          {canCancelOrReschedule(appointment) && (
                            <>
                              <Dialog open={isRescheduleDialogOpen && selectedAppointment?.id === appointment.id} onOpenChange={setIsRescheduleDialogOpen}>
                                <DialogTrigger asChild>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => {
                                      setSelectedAppointment(appointment);
                                      setNewDate(appointment.appointment_date);
                                      setNewTime(appointment.start_time);
                                    }}
                                  >
                                    <RefreshCw className="w-4 h-4 mr-2" />
                                    Reschedule
                                  </Button>
                                </DialogTrigger>
                                <DialogContent>
                                  <DialogHeader>
                                    <DialogTitle>Reschedule Appointment</DialogTitle>
                                    <DialogDescription>
                                      Choose a new date and time for your appointment with Dr. {appointment.doctors?.profiles?.first_name} {appointment.doctors?.profiles?.last_name}
                                    </DialogDescription>
                                  </DialogHeader>
                                  <div className="space-y-4 py-4">
                                    <div className="space-y-2">
                                      <Label htmlFor="new-date">New Date</Label>
                                      <Input
                                        id="new-date"
                                        type="date"
                                        value={newDate}
                                        onChange={(e) => setNewDate(e.target.value)}
                                        min={new Date().toISOString().split('T')[0]}
                                      />
                                    </div>
                                    <div className="space-y-2">
                                      <Label htmlFor="new-time">New Time</Label>
                                      <Input
                                        id="new-time"
                                        type="time"
                                        value={newTime}
                                        onChange={(e) => setNewTime(e.target.value)}
                                      />
                                    </div>
                                  </div>
                                  <DialogFooter>
                                    <Button variant="outline" onClick={() => setIsRescheduleDialogOpen(false)}>
                                      Cancel
                                    </Button>
                                    <Button 
                                      onClick={handleRescheduleAppointment}
                                      disabled={actionLoading || !newDate || !newTime}
                                      className="bg-gradient-to-r from-primary to-accent"
                                    >
                                      {actionLoading ? (
                                        <>
                                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                          Rescheduling...
                                        </>
                                      ) : (
                                        <>
                                          <CheckCircle className="w-4 h-4 mr-2" />
                                          Confirm Reschedule
                                        </>
                                      )}
                                    </Button>
                                  </DialogFooter>
                                </DialogContent>
                              </Dialog>

                              <Dialog open={isCancelDialogOpen && selectedAppointment?.id === appointment.id} onOpenChange={setIsCancelDialogOpen}>
                                <DialogTrigger asChild>
                                  <Button
                                    variant="destructive"
                                    size="sm"
                                    onClick={() => setSelectedAppointment(appointment)}
                                  >
                                    <X className="w-4 h-4 mr-2" />
                                    Cancel
                                  </Button>
                                </DialogTrigger>
                                <DialogContent>
                                  <DialogHeader>
                                    <DialogTitle>Cancel Appointment</DialogTitle>
                                    <DialogDescription>
                                      Are you sure you want to cancel your appointment with Dr. {appointment.doctors?.profiles?.first_name} {appointment.doctors?.profiles?.last_name}?
                                    </DialogDescription>
                                  </DialogHeader>
                                  <div className="space-y-4 py-4">
                                    <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                                      <div className="flex items-start gap-3">
                                        <AlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mt-0.5" />
                                        <div className="text-sm text-yellow-800 dark:text-yellow-200">
                                          <p className="font-medium mb-1">Cancellation Policy</p>
                                          <p>Cancellations made less than 24 hours before the appointment may incur a cancellation fee.</p>
                                        </div>
                                      </div>
                                    </div>
                                    <div className="space-y-2">
                                      <Label htmlFor="cancel-reason">Reason for Cancellation *</Label>
                                      <Textarea
                                        id="cancel-reason"
                                        placeholder="Please provide a reason for cancellation..."
                                        value={cancelReason}
                                        onChange={(e) => setCancelReason(e.target.value)}
                                        rows={4}
                                      />
                                    </div>
                                  </div>
                                  <DialogFooter>
                                    <Button variant="outline" onClick={() => setIsCancelDialogOpen(false)}>
                                      Keep Appointment
                                    </Button>
                                    <Button 
                                      variant="destructive"
                                      onClick={handleCancelAppointment}
                                      disabled={actionLoading || !cancelReason.trim()}
                                    >
                                      {actionLoading ? (
                                        <>
                                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                          Cancelling...
                                        </>
                                      ) : (
                                        <>
                                          <X className="w-4 h-4 mr-2" />
                                          Confirm Cancellation
                                        </>
                                      )}
                                    </Button>
                                  </DialogFooter>
                                </DialogContent>
                              </Dialog>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
