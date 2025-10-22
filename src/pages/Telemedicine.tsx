import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Video, Calendar, Clock, User, Phone, AlertCircle, CheckCircle } from "lucide-react";

export default function Telemedicine() {
  const [upcomingCalls, setUpcomingCalls] = useState([
    {
      id: 1,
      patientName: "John Doe",
      date: "2025-10-23",
      time: "10:00 AM",
      duration: "30 mins",
      type: "Follow-up Consultation",
      status: "Scheduled"
    },
    {
      id: 2,
      patientName: "Jane Smith",
      date: "2025-10-23",
      time: "11:00 AM",
      duration: "45 mins",
      type: "Initial Consultation",
      status: "Scheduled"
    },
    {
      id: 3,
      patientName: "Robert Johnson",
      date: "2025-10-23",
      time: "2:00 PM",
      duration: "30 mins",
      type: "Prescription Review",
      status: "Scheduled"
    }
  ]);

  const completedCalls = [
    {
      id: 4,
      patientName: "Emily Davis",
      date: "2025-10-22",
      time: "9:00 AM",
      duration: "30 mins",
      type: "Follow-up",
      status: "Completed"
    },
    {
      id: 5,
      patientName: "Michael Brown",
      date: "2025-10-21",
      time: "3:00 PM",
      duration: "40 mins",
      type: "Initial Consultation",
      status: "Completed"
    }
  ];

  const startCall = (callId: number) => {
    alert(`Starting video call for appointment ${callId}...`);
    // Integration with video calling service would go here
  };

  return (
    <div className="min-h-screen bg-muted py-12">
      <div className="container mx-auto px-4 lg:px-6 max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-extrabold text-primary mb-4 flex items-center gap-3">
            <Video className="w-10 h-10" />
            Telemedicine
          </h1>
          <p className="text-lg text-muted-foreground">
            Secure video consultations with your patients from anywhere
          </p>
        </div>

        {/* Feature Banner */}
        <Card className="mb-8 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-blue-200 dark:border-blue-900">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-blue-500/20 rounded-full">
                <Video className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-lg mb-2">Secure HD Video Consultations</h3>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>✓ HIPAA-compliant encrypted video calls</li>
                  <li>✓ Screen sharing for reviewing reports and scans</li>
                  <li>✓ Real-time chat and file sharing</li>
                  <li>✓ Automatic call recording for medical records (with consent)</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Today's Calls</p>
                  <p className="text-3xl font-bold">{upcomingCalls.length}</p>
                </div>
                <Video className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Completed</p>
                  <p className="text-3xl font-bold text-green-600">{completedCalls.length}</p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Next Call In</p>
                  <p className="text-3xl font-bold text-orange-600">25m</p>
                </div>
                <Clock className="w-8 h-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Upcoming Consultations */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Upcoming Consultations</h2>
          <div className="space-y-4">
            {upcomingCalls.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <Video className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No upcoming consultations</h3>
                  <p className="text-muted-foreground">
                    Your schedule is clear for today
                  </p>
                </CardContent>
              </Card>
            ) : (
              upcomingCalls.map((call) => (
                <Card key={call.id} className="hover:shadow-lg transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-full">
                            <User className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                          </div>
                          <div>
                            <h3 className="text-xl font-bold">{call.patientName}</h3>
                            <Badge variant="outline">{call.type}</Badge>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-muted-foreground" />
                            <div>
                              <p className="text-sm text-muted-foreground">Date</p>
                              <p className="font-medium">
                                {new Date(call.date).toLocaleDateString('en-US', {
                                  month: 'short',
                                  day: 'numeric',
                                  year: 'numeric'
                                })}
                              </p>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-muted-foreground" />
                            <div>
                              <p className="text-sm text-muted-foreground">Time</p>
                              <p className="font-medium">{call.time}</p>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <Video className="w-4 h-4 text-muted-foreground" />
                            <div>
                              <p className="text-sm text-muted-foreground">Duration</p>
                              <p className="font-medium">{call.duration}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex flex-col gap-2 ml-4">
                        <Button 
                          size="sm" 
                          onClick={() => startCall(call.id)}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <Video className="w-4 h-4 mr-2" />
                          Join Call
                        </Button>
                        <Button size="sm" variant="outline">
                          <Phone className="w-4 h-4 mr-2" />
                          Call Patient
                        </Button>
                        <Button size="sm" variant="ghost">
                          Reschedule
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>

        {/* Completed Consultations */}
        <div>
          <h2 className="text-2xl font-bold mb-4">Recent Consultations</h2>
          <div className="space-y-4">
            {completedCalls.map((call) => (
              <Card key={call.id} className="opacity-75">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 bg-green-100 dark:bg-green-900 rounded-full">
                          <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold">{call.patientName}</h3>
                          <Badge variant="secondary">{call.status}</Badge>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                        <div>
                          <p className="text-sm text-muted-foreground">Date</p>
                          <p className="font-medium">
                            {new Date(call.date).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric'
                            })}
                          </p>
                        </div>
                        
                        <div>
                          <p className="text-sm text-muted-foreground">Type</p>
                          <p className="font-medium">{call.type}</p>
                        </div>
                        
                        <div>
                          <p className="text-sm text-muted-foreground">Duration</p>
                          <p className="font-medium">{call.duration}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-col gap-2 ml-4">
                      <Button size="sm" variant="outline">
                        View Notes
                      </Button>
                      <Button size="sm" variant="ghost">
                        View Recording
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* System Requirements */}
        <Card className="mt-8 border-orange-200 dark:border-orange-900">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-orange-600" />
              System Requirements
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-muted-foreground">
              <div>
                <h4 className="font-semibold text-foreground mb-2">Browser Support</h4>
                <ul className="space-y-1">
                  <li>• Chrome 90+ (Recommended)</li>
                  <li>• Firefox 88+</li>
                  <li>• Safari 14+</li>
                  <li>• Edge 90+</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-foreground mb-2">Hardware Requirements</h4>
                <ul className="space-y-1">
                  <li>• Webcam (720p or higher)</li>
                  <li>• Microphone and speakers/headset</li>
                  <li>• Stable internet (5 Mbps minimum)</li>
                  <li>• Updated browser</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
