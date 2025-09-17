import { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { supabase } from '@/integrations/supabase/client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/use-toast'

interface Appointment {
  id: string
  appointment_date: string
  start_time: string
  end_time: string
  service_type: string
  status: string
  notes: string
  fee: number
  patient: {
    profile: {
      first_name: string
      last_name: string
      email: string
      phone: string
    }
  }
}

interface DoctorInfo {
  id: string
  specialty: string
  license_number: string
  years_experience: number
  bio: string
  consultation_fee: number
}

export default function Doctor() {
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [doctorInfo, setDoctorInfo] = useState<DoctorInfo | null>(null)
  const [loading, setLoading] = useState(true)
  const { profile } = useAuth()
  const { toast } = useToast()

  const fetchDoctorData = async () => {
    if (!profile) return

    try {
      // Fetch doctor info
      const { data: doctorData, error: doctorError } = await supabase
        .from('doctors')
        .select('*')
        .eq('profile_id', profile.id)
        .single()

      if (doctorError) throw doctorError
      setDoctorInfo(doctorData)

      // Fetch appointments
      const { data: appointmentsData, error: appointmentsError } = await supabase
        .from('appointments')
        .select(`
          *,
          patient:patients(
            profile:profiles(
              first_name,
              last_name,
              email,
              phone
            )
          )
        `)
        .eq('doctor_id', doctorData.id)
        .order('appointment_date', { ascending: true })

      if (appointmentsError) throw appointmentsError
      setAppointments(appointmentsData || [])

    } catch (error) {
      console.error('Error fetching doctor data:', error)
      toast({
        title: 'Error',
        description: 'Failed to fetch data',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDoctorData()
  }, [profile])

  const updateAppointmentStatus = async (appointmentId: string, status: string) => {
    try {
      const { error } = await supabase
        .from('appointments')
        .update({ status })
        .eq('id', appointmentId)

      if (error) throw error

      toast({
        title: 'Success',
        description: `Appointment ${status} successfully`
      })

      fetchDoctorData()
    } catch (error) {
      console.error('Error updating appointment:', error)
      toast({
        title: 'Error',
        description: 'Failed to update appointment',
        variant: 'destructive'
      })
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-primary">Doctor Dashboard</h1>
      </div>

      {doctorInfo && (
        <Card>
          <CardHeader>
            <CardTitle>Dr. {profile?.first_name} {profile?.last_name}</CardTitle>
            <CardDescription>{doctorInfo.specialty}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <p className="font-medium">License Number</p>
                <p className="text-muted-foreground">{doctorInfo.license_number}</p>
              </div>
              <div>
                <p className="font-medium">Experience</p>
                <p className="text-muted-foreground">{doctorInfo.years_experience} years</p>
              </div>
              <div>
                <p className="font-medium">Consultation Fee</p>
                <p className="text-muted-foreground">₹{doctorInfo.consultation_fee}</p>
              </div>
              <div>
                <p className="font-medium">Total Appointments</p>
                <p className="text-muted-foreground">{appointments.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="appointments" className="space-y-6">
        <TabsList>
          <TabsTrigger value="appointments">My Appointments</TabsTrigger>
          <TabsTrigger value="patients">My Patients</TabsTrigger>
          <TabsTrigger value="schedule">Schedule</TabsTrigger>
        </TabsList>

        <TabsContent value="appointments" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Appointments</CardTitle>
              <CardDescription>Manage your patient appointments</CardDescription>
            </CardHeader>
            <CardContent>
              {appointments.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">No appointments scheduled</p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Patient</TableHead>
                      <TableHead>Date & Time</TableHead>
                      <TableHead>Service</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Fee</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {appointments.map((appointment) => (
                      <TableRow key={appointment.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">
                              {appointment.patient.profile.first_name} {appointment.patient.profile.last_name}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {appointment.patient.profile.email}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p>{new Date(appointment.appointment_date).toLocaleDateString()}</p>
                            <p className="text-sm text-muted-foreground">
                              {appointment.start_time} - {appointment.end_time}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>{appointment.service_type}</TableCell>
                        <TableCell>
                          <Badge variant={
                            appointment.status === 'completed' ? 'default' :
                            appointment.status === 'cancelled' ? 'destructive' :
                            appointment.status === 'rescheduled' ? 'secondary' : 'secondary'
                          }>
                            {appointment.status}
                          </Badge>
                        </TableCell>
                        <TableCell>₹{appointment.fee}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            {appointment.status === 'scheduled' && (
                              <>
                                <Button
                                  size="sm"
                                  onClick={() => updateAppointmentStatus(appointment.id, 'completed')}
                                >
                                  Complete
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => updateAppointmentStatus(appointment.id, 'cancelled')}
                                >
                                  Cancel
                                </Button>
                              </>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="patients" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>My Patients</CardTitle>
              <CardDescription>Patients you have treated</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Patient management features coming soon...</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="schedule" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Schedule Management</CardTitle>
              <CardDescription>Manage your availability and schedule</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Schedule management features coming soon...</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}