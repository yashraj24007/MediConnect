import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Bell, Plus, Clock, Pill, Calendar, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function MedicationReminders() {
  const { toast } = useToast();
  const [medications, setMedications] = useState([
    {
      id: 1,
      name: "Aspirin",
      dosage: "100mg",
      frequency: "Once daily",
      time: "9:00 AM",
      duration: "30 days",
      startDate: "2025-10-01",
      active: true
    },
    {
      id: 2,
      name: "Metformin",
      dosage: "500mg",
      frequency: "Twice daily",
      time: "8:00 AM, 8:00 PM",
      duration: "90 days",
      startDate: "2025-10-15",
      active: true
    }
  ]);

  const [showAddForm, setShowAddForm] = useState(false);
  const [newMed, setNewMed] = useState({
    name: "",
    dosage: "",
    frequency: "",
    time: "",
    duration: ""
  });

  const handleAddMedication = () => {
    if (!newMed.name || !newMed.dosage || !newMed.time) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    const medication = {
      id: medications.length + 1,
      ...newMed,
      startDate: new Date().toISOString().split('T')[0],
      active: true
    };

    setMedications([...medications, medication]);
    setNewMed({ name: "", dosage: "", frequency: "", time: "", duration: "" });
    setShowAddForm(false);
    
    toast({
      title: "Medication Added",
      description: "Reminder set successfully! You'll receive notifications."
    });
  };

  const toggleMedication = (id: number) => {
    setMedications(medications.map(med => 
      med.id === id ? { ...med, active: !med.active } : med
    ));
    
    toast({
      title: "Status Updated",
      description: "Medication reminder status changed"
    });
  };

  return (
    <div className="min-h-screen bg-muted py-12">
      <div className="container mx-auto px-4 lg:px-6 max-w-5xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-extrabold text-primary mb-4 flex items-center gap-3">
            <Pill className="w-10 h-10" />
            Medication Reminders
          </h1>
          <p className="text-lg text-muted-foreground">
            AI-powered medication tracking to help you stay on schedule with your prescriptions
          </p>
        </div>

        {/* AI Features Banner */}
        <Card className="mb-8 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-blue-200 dark:border-blue-900">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-blue-500/20 rounded-full">
                <Bell className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-lg mb-2">Smart Reminders Powered by AI</h3>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>✓ Automatic notifications at scheduled times</li>
                  <li>✓ Track medication adherence and missed doses</li>
                  <li>✓ Refill reminders before you run out</li>
                  <li>✓ Drug interaction warnings and side effect tracking</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Add Medication Button */}
        <div className="mb-6">
          {!showAddForm && (
            <Button onClick={() => setShowAddForm(true)} className="w-full md:w-auto">
              <Plus className="w-4 h-4 mr-2" />
              Add Medication
            </Button>
          )}
        </div>

        {/* Add Medication Form */}
        {showAddForm && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Add New Medication</CardTitle>
              <CardDescription>Set up a reminder for your medication</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="medName">Medication Name *</Label>
                  <Input
                    id="medName"
                    placeholder="e.g., Aspirin"
                    value={newMed.name}
                    onChange={(e) => setNewMed({ ...newMed, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dosage">Dosage *</Label>
                  <Input
                    id="dosage"
                    placeholder="e.g., 100mg"
                    value={newMed.dosage}
                    onChange={(e) => setNewMed({ ...newMed, dosage: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="frequency">Frequency</Label>
                  <Input
                    id="frequency"
                    placeholder="e.g., Twice daily"
                    value={newMed.frequency}
                    onChange={(e) => setNewMed({ ...newMed, frequency: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="time">Time(s) *</Label>
                  <Input
                    id="time"
                    placeholder="e.g., 9:00 AM"
                    value={newMed.time}
                    onChange={(e) => setNewMed({ ...newMed, time: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="duration">Duration</Label>
                  <Input
                    id="duration"
                    placeholder="e.g., 30 days"
                    value={newMed.duration}
                    onChange={(e) => setNewMed({ ...newMed, duration: e.target.value })}
                  />
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <Button onClick={handleAddMedication}>
                  Save Medication
                </Button>
                <Button variant="outline" onClick={() => setShowAddForm(false)}>
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Medications List */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Active Medications</h2>
          
          {medications.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <Pill className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No medications added yet</h3>
                <p className="text-muted-foreground mb-4">
                  Start tracking your medications to receive timely reminders
                </p>
                <Button onClick={() => setShowAddForm(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Your First Medication
                </Button>
              </CardContent>
            </Card>
          ) : (
            medications.map((med) => (
              <Card key={med.id} className={!med.active ? "opacity-60" : ""}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-bold">{med.name}</h3>
                        <Badge variant={med.active ? "default" : "secondary"}>
                          {med.active ? "Active" : "Paused"}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
                        <div className="flex items-center gap-2 text-sm">
                          <Pill className="w-4 h-4 text-muted-foreground" />
                          <span className="text-muted-foreground">Dosage:</span>
                          <span className="font-medium">{med.dosage}</span>
                        </div>
                        
                        <div className="flex items-center gap-2 text-sm">
                          <Clock className="w-4 h-4 text-muted-foreground" />
                          <span className="text-muted-foreground">Time:</span>
                          <span className="font-medium">{med.time}</span>
                        </div>
                        
                        {med.frequency && (
                          <div className="flex items-center gap-2 text-sm">
                            <Bell className="w-4 h-4 text-muted-foreground" />
                            <span className="text-muted-foreground">Frequency:</span>
                            <span className="font-medium">{med.frequency}</span>
                          </div>
                        )}
                        
                        {med.duration && (
                          <div className="flex items-center gap-2 text-sm">
                            <Calendar className="w-4 h-4 text-muted-foreground" />
                            <span className="text-muted-foreground">Duration:</span>
                            <span className="font-medium">{med.duration}</span>
                          </div>
                        )}
                      </div>
                      
                      <div className="mt-4 text-xs text-muted-foreground">
                        Started on: {new Date(med.startDate).toLocaleDateString()}
                      </div>
                    </div>
                    
                    <div className="flex flex-col gap-2">
                      <Button
                        size="sm"
                        variant={med.active ? "outline" : "default"}
                        onClick={() => toggleMedication(med.id)}
                      >
                        {med.active ? "Pause" : "Resume"}
                      </Button>
                      <Button size="sm" variant="ghost" className="text-destructive">
                        Delete
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Info Card */}
        <Card className="mt-8 border-orange-200 dark:border-orange-900">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <AlertCircle className="w-6 h-6 text-orange-600 dark:text-orange-400 mt-1" />
              <div>
                <h4 className="font-semibold mb-2">Important Information</h4>
                <p className="text-sm text-muted-foreground">
                  This tool is designed to help you remember your medications, but it should not replace medical advice. Always consult your healthcare provider before starting, stopping, or changing any medication regimen.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
