import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { FileText, Calendar, User, Activity, Download, Printer } from "lucide-react";
import { toast } from "sonner";

interface PatientSummaryProps {
  patientId: string;
  onClose?: () => void;
}

export default function PatientSummary({ patientId, onClose }: PatientSummaryProps) {
  const [patientData, setPatientData] = useState<any>(null);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPatientSummary();
  }, [patientId]);

  const fetchPatientSummary = async () => {
    setLoading(true);
    try {
      // Fetch patient profile
      const { data: patient, error: patientError } = await supabase
        .from('patients')
        .select(`
          *,
          profiles (
            first_name,
            last_name,
            email,
            phone,
            date_of_birth,
            address
          )
        `)
        .eq('id', patientId)
        .single();

      if (patientError) throw patientError;

      // Fetch appointments history
      const { data: appointmentsData, error: appointmentsError } = await supabase
        .from('appointments')
        .select(`
          *,
          doctors (
            specialty,
            profiles (
              first_name,
              last_name
            )
          )
        `)
        .eq('patient_id', patientId)
        .order('appointment_date', { ascending: false });

      if (appointmentsError) throw appointmentsError;

      setPatientData(patient);
      setAppointments(appointmentsData || []);
    } catch (error) {
      console.error('Error fetching patient summary:', error);
      toast.error("Failed to load patient summary");
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    const content = generateReportContent();
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `patient-summary-${patientData?.profiles?.first_name}-${patientData?.profiles?.last_name}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success("Report downloaded successfully");
  };

  const generateReportContent = () => {
    if (!patientData) return '';
    
    const profile = patientData.profiles;
    let content = `PATIENT SUMMARY REPORT\n`;
    content += `Generated: ${new Date().toLocaleString()}\n\n`;
    content += `=================================\n`;
    content += `PATIENT INFORMATION\n`;
    content += `=================================\n`;
    content += `Name: ${profile.first_name} ${profile.last_name}\n`;
    content += `Email: ${profile.email}\n`;
    content += `Phone: ${profile.phone || 'N/A'}\n`;
    content += `Date of Birth: ${profile.date_of_birth || 'N/A'}\n`;
    content += `Address: ${profile.address || 'N/A'}\n`;
    content += `Blood Group: ${patientData.blood_group || 'N/A'}\n`;
    content += `Allergies: ${patientData.allergies || 'None recorded'}\n`;
    content += `Chronic Conditions: ${patientData.chronic_conditions || 'None recorded'}\n`;
    content += `Current Medications: ${patientData.current_medications || 'None recorded'}\n\n`;
    
    content += `=================================\n`;
    content += `APPOINTMENT HISTORY\n`;
    content += `=================================\n`;
    appointments.forEach((apt, index) => {
      content += `\nAppointment ${index + 1}:\n`;
      content += `  Date: ${new Date(apt.appointment_date).toLocaleDateString()}\n`;
      content += `  Time: ${apt.start_time}\n`;
      content += `  Doctor: Dr. ${apt.doctors?.profiles?.first_name} ${apt.doctors?.profiles?.last_name}\n`;
      content += `  Specialty: ${apt.doctors?.specialty}\n`;
      content += `  Status: ${apt.status}\n`;
      content += `  Service: ${apt.service_type || 'General Consultation'}\n`;
      if (apt.notes) content += `  Notes: ${apt.notes}\n`;
    });
    
    return content;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!patientData) {
    return (
      <Card>
        <CardContent className="p-12 text-center">
          <p className="text-muted-foreground">Patient data not found</p>
        </CardContent>
      </Card>
    );
  }

  const profile = patientData.profiles;

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex justify-between items-center print:hidden">
        <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <FileText className="w-6 h-6 text-primary" />
          Patient Summary Report
        </h2>
        <div className="flex gap-2">
          <Button onClick={handleDownload} variant="outline" className="gap-2">
            <Download className="w-4 h-4" />
            Download
          </Button>
          <Button onClick={handlePrint} variant="outline" className="gap-2">
            <Printer className="w-4 h-4" />
            Print
          </Button>
          {onClose && (
            <Button onClick={onClose} variant="ghost">
              Close
            </Button>
          )}
        </div>
      </div>

      {/* Patient Information Card */}
      <Card>
        <CardHeader className="bg-primary/5">
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5 text-primary" />
            Patient Information
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Full Name</label>
              <p className="text-lg font-semibold text-foreground">{profile.first_name} {profile.last_name}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Email</label>
              <p className="text-lg text-foreground">{profile.email}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Phone</label>
              <p className="text-lg text-foreground">{profile.phone || 'Not provided'}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Date of Birth</label>
              <p className="text-lg text-foreground">
                {profile.date_of_birth ? new Date(profile.date_of_birth).toLocaleDateString() : 'Not provided'}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Blood Group</label>
              <p className="text-lg text-foreground">{patientData.blood_group || 'Not recorded'}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Address</label>
              <p className="text-lg text-foreground">{profile.address || 'Not provided'}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Medical Information */}
      <Card>
        <CardHeader className="bg-accent/5">
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-primary" />
            Medical Information
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <Tabs defaultValue="allergies" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="allergies">Allergies</TabsTrigger>
              <TabsTrigger value="conditions">Conditions</TabsTrigger>
              <TabsTrigger value="medications">Medications</TabsTrigger>
            </TabsList>
            <TabsContent value="allergies" className="mt-4">
              <div className="p-4 bg-muted/30 rounded-lg">
                <p className="text-foreground">{patientData.allergies || 'No allergies recorded'}</p>
              </div>
            </TabsContent>
            <TabsContent value="conditions" className="mt-4">
              <div className="p-4 bg-muted/30 rounded-lg">
                <p className="text-foreground">{patientData.chronic_conditions || 'No chronic conditions recorded'}</p>
              </div>
            </TabsContent>
            <TabsContent value="medications" className="mt-4">
              <div className="p-4 bg-muted/30 rounded-lg">
                <p className="text-foreground">{patientData.current_medications || 'No current medications recorded'}</p>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Appointment History */}
      <Card>
        <CardHeader className="bg-primary/5">
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-primary" />
            Appointment History ({appointments.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          {appointments.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">No appointment history found</p>
          ) : (
            <div className="space-y-4">
              {appointments.map((apt) => (
                <div
                  key={apt.id}
                  className="p-4 border border-border rounded-lg hover:bg-muted/30 transition-colors"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="font-semibold text-foreground">
                        {new Date(apt.appointment_date).toLocaleDateString('en-US', { 
                          weekday: 'long', 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })}
                      </p>
                      <p className="text-sm text-muted-foreground">Time: {apt.start_time}</p>
                    </div>
                    <Badge variant={apt.status === 'completed' ? 'default' : 'secondary'}>
                      {apt.status}
                    </Badge>
                  </div>
                  <div className="text-sm space-y-1">
                    <p className="text-foreground">
                      <span className="font-medium">Doctor:</span> Dr. {apt.doctors?.profiles?.first_name} {apt.doctors?.profiles?.last_name}
                    </p>
                    <p className="text-foreground">
                      <span className="font-medium">Specialty:</span> {apt.doctors?.specialty}
                    </p>
                    <p className="text-foreground">
                      <span className="font-medium">Service:</span> {apt.service_type || 'General Consultation'}
                    </p>
                    {apt.notes && (
                      <p className="text-muted-foreground mt-2">
                        <span className="font-medium">Notes:</span> {apt.notes}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}