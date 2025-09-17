import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Calendar, Clock, User, Video, Sparkles } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { format } from "date-fns";

interface Appointment {
  id: string;
  appointment_date: string;
  start_time: string;
  end_time: string;
  service_type: string;
  status: string;
  fee: number;
  doctors: {
    profiles: {
      first_name: string;
      last_name: string;
    };
  };
}

export default function PatientInfo() {
  const { user, profile } = useAuth();
  const [prepInput, setPrepInput] = useState("");
  const [prepResult, setPrepResult] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [patientRecord, setPatientRecord] = useState<any>(null);

  useEffect(() => {
    if (user && profile?.role === 'patient') {
      fetchPatientRecord();
    }
  }, [user, profile]);

  useEffect(() => {
    if (patientRecord) {
      fetchAppointments();
    }
  }, [patientRecord]);

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
        return;
      }
      
      setPatientRecord(newPatient);
    } else {
      setPatientRecord(data);
    }
  };

  const fetchAppointments = async () => {
    if (!patientRecord?.id) return;

    const { data, error } = await supabase
      .from('appointments')
      .select(`
        *,
        doctors (
          profiles (
            first_name,
            last_name
          )
        )
      `)
      .eq('patient_id', patientRecord.id)
      .order('appointment_date', { ascending: true });

    if (error) {
      console.error('Error fetching appointments:', error);
      return;
    }

    setAppointments(data || []);
  };

  const formatTime = (time: string) => {
    const [hour, minute] = time.split(':');
    const hourNum = parseInt(hour);
    const ampm = hourNum >= 12 ? 'PM' : 'AM';
    const displayHour = hourNum === 0 ? 12 : hourNum > 12 ? hourNum - 12 : hourNum;
    return `${displayHour}:${minute} ${ampm}`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, 'EEEE, MMM d');
  };

  const handleSessionPrep = async () => {
    if (!prepInput.trim() || !selectedAppointment) return;

    setIsLoading(true);
    
    // Simulate AI response
    setTimeout(() => {
      const doctorName = `Dr. ${selectedAppointment.doctors.profiles.first_name} ${selectedAppointment.doctors.profiles.last_name}`;
      setPrepResult(`
### Questions for your ${selectedAppointment.service_type} with ${doctorName}

**Recommended Questions:**
* What should I expect during this consultation?
* Are there any symptoms I should be monitoring?
* What are the next steps in my treatment plan?
* Are there any lifestyle changes I should consider?
* When should I schedule my next appointment?

**Preparation Tips:**
* Bring a list of current medications
* Note any new symptoms or changes since your last visit
* Prepare questions about your treatment plan
* Consider discussing any concerns about your condition

Please bring this list with you to make the most of your appointment time.
      `);
      setIsLoading(false);
    }, 1500);
  };

  const formatAIResponse = (text: string) => {
    return text
      .replace(/### (.*)/g, '<h3 class="text-lg font-semibold text-primary mt-4 mb-2">$1</h3>')
      .replace(/\*\* (.*?) \*\*/g, '<strong>$1</strong>')
      .replace(/\* (.*)/g, '<li class="text-muted-foreground">$1</li>')
      .replace(/(<li>.*<\/li>)+/g, '<ul class="list-disc ml-6 mb-4 space-y-1">$&</ul>')
      .split('\n')
      .map(line => line.trim())
      .filter(line => line)
      .map(line => line.match(/<[^>]+>/) ? line : `<p class="mb-4 text-muted-foreground leading-relaxed">${line}</p>`)
      .join('');
  };

  const today = new Date();
  const upcomingAppointments = appointments.filter(a => 
    new Date(a.appointment_date) >= today && a.status !== 'cancelled'
  );
  const completedAppointments = appointments.filter(a => 
    new Date(a.appointment_date) < today || a.status === 'completed'
  );

  return (
    <div className="min-h-screen bg-muted py-12">
      <div className="container mx-auto px-4 lg:px-6">
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-primary mb-2">
            Patient Dashboard
          </h1>
          <p className="text-muted-foreground">
            Manage your appointments and prepare for upcoming sessions.
          </p>
        </div>

        {/* Upcoming Sessions */}
        <Card className="medical-card mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-primary" />
              Upcoming Sessions
            </CardTitle>
            <CardDescription>
              Your scheduled appointments and consultations
            </CardDescription>
          </CardHeader>
          <CardContent>
            {upcomingAppointments.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">
                No upcoming appointments scheduled.
              </p>
            ) : (
              <div className="space-y-4">
                {upcomingAppointments.map((appointment) => (
                  <div
                    key={appointment.id}
                    className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center p-4 border border-border rounded-lg hover:bg-accent/50 transition-colors"
                  >
                    <div className="space-y-1">
                      <p className="font-semibold text-foreground">{formatDate(appointment.appointment_date)}</p>
                      <p className="text-sm text-muted-foreground flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {formatTime(appointment.start_time)} - {formatTime(appointment.end_time)}
                      </p>
                    </div>
                    
                    <div className="hidden md:block">
                      <Badge variant="secondary">{appointment.service_type}</Badge>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-muted-foreground" />
                      <span className="text-foreground">
                        Dr. {appointment.doctors.profiles.first_name} {appointment.doctors.profiles.last_name}
                      </span>
                    </div>
                    
                    <div className="text-right">
                      <Button variant="outline" size="sm" className="flex items-center gap-2">
                        <Video className="w-4 h-4" />
                        Join Online
                      </Button>
                    </div>
                    
                    <div className="text-right">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button 
                            variant="default" 
                            size="sm"
                            onClick={() => setSelectedAppointment(appointment)}
                          >
                            <Sparkles className="w-4 h-4 mr-1" />
                            Prepare with AI
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle className="flex items-center gap-2">
                              <Sparkles className="w-5 h-5 text-primary" />
                              Prepare for Your Session
                            </DialogTitle>
                            <DialogDescription>
                              I can help you prepare for your upcoming{" "}
                              <strong>{selectedAppointment?.service_type}</strong> with{" "}
                              <strong>Dr. {selectedAppointment?.doctors.profiles.first_name} {selectedAppointment?.doctors.profiles.last_name}</strong>. What's on your mind?
                            </DialogDescription>
                          </DialogHeader>
                          
                          <div className="space-y-4">
                            <Textarea
                              value={prepInput}
                              onChange={(e) => setPrepInput(e.target.value)}
                              placeholder="e.g., 'What are the key questions I should ask about managing high blood pressure?'"
                              rows={3}
                            />
                            
                            <Button 
                              onClick={handleSessionPrep} 
                              variant="default"
                              disabled={!prepInput.trim() || isLoading}
                              className="w-full"
                            >
                              {isLoading ? (
                                <>
                                  <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin mr-2"></div>
                                  Generating Questions...
                                </>
                              ) : (
                                "Generate Questions"
                              )}
                            </Button>
                            
                            {prepResult && (
                              <div 
                                className="max-h-64 overflow-y-auto custom-scrollbar border-t border-border pt-4"
                                dangerouslySetInnerHTML={{ __html: formatAIResponse(prepResult) }}
                              />
                            )}
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Sessions */}
        <Card className="medical-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-muted-foreground" />
              Recent Sessions
            </CardTitle>
            <CardDescription>
              Your completed appointments and consultations
            </CardDescription>
          </CardHeader>
          <CardContent>
            {completedAppointments.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">
                No recent appointments found.
              </p>
            ) : (
              <div className="space-y-4">
                {completedAppointments.map((appointment) => (
                  <div
                    key={appointment.id}
                    className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center p-4 border border-border rounded-lg opacity-75"
                  >
                    <div className="space-y-1">
                      <p className="font-semibold text-foreground">{formatDate(appointment.appointment_date)}</p>
                      <p className="text-sm text-muted-foreground">
                        {formatTime(appointment.start_time)} - {formatTime(appointment.end_time)}
                      </p>
                    </div>
                    
                    <div>
                      <Badge variant="outline">{appointment.service_type}</Badge>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-muted-foreground" />
                      <span className="text-foreground">
                        Dr. {appointment.doctors.profiles.first_name} {appointment.doctors.profiles.last_name}
                      </span>
                    </div>
                    
                    <div className="text-right">
                      <Badge className="bg-success text-success-foreground">
                        {appointment.status === 'completed' ? 'Completed' : 'Past'}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}