import { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { supabase } from '@/integrations/supabase/client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Progress } from '@/components/ui/progress'
import { Calendar } from '@/components/ui/calendar'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/hooks/use-toast'
import { 
  Calendar as CalendarIcon, 
  Users, 
  DollarSign, 
  Clock, 
  TrendingUp, 
  Activity,
  User,
  Phone,
  Mail,
  MapPin,
  Stethoscope,
  Star,
  CheckCircle,
  XCircle,
  AlertCircle,
  Plus,
  Eye,
  Edit,
  Video,
  MessageSquare,
  FileText,
  Settings,
  Search,
  Filter,
  BookOpen,
  Award,
  Calendar as CalendarDays,
  Loader2
} from 'lucide-react'

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
    id: string
    profile: {
      first_name: string
      last_name: string
      email: string
      phone: string
      date_of_birth?: string
    }
    emergency_contact_name?: string
    emergency_contact_phone?: string
    medical_conditions?: string[]
    allergies?: string[]
  }
}

interface DoctorInfo {
  id: string
  specialty: string
  license_number: string
  years_experience: number
  bio: string
  consultation_fee: number
  profiles: {
    first_name: string
    last_name: string
    email: string
    phone: string
  }
}

interface DashboardStats {
  totalPatients: number
  todayAppointments: number
  monthlyRevenue: number
  avgRating: number
  completedAppointments: number
  pendingAppointments: number
}

export default function Doctor() {
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [todayAppointments, setTodayAppointments] = useState<Appointment[]>([])
  const [doctorInfo, setDoctorInfo] = useState<DoctorInfo | null>(null)
  const [stats, setStats] = useState<DashboardStats>({
    totalPatients: 0,
    todayAppointments: 0,
    monthlyRevenue: 0,
    avgRating: 4.8,
    completedAppointments: 0,
    pendingAppointments: 0
  })
  const [loading, setLoading] = useState(true)
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedStatus, setSelectedStatus] = useState("all")
  const { profile } = useAuth()
  const { toast } = useToast()

  const fetchDoctorData = async () => {
    if (!profile) return

    try {
      setLoading(true)

      // Fetch doctor info with profile
      const { data: doctorData, error: doctorError } = await supabase
        .from('doctors')
        .select(`
          *,
          profiles (
            first_name,
            last_name,
            email,
            phone
          )
        `)
        .eq('profile_id', profile.id)
        .single()

      if (doctorError) throw doctorError
      setDoctorInfo(doctorData)

      // Fetch appointments with patient details
      const { data: appointmentsData, error: appointmentsError } = await supabase
        .from('appointments')
        .select(`
          *,
          patient:patients (
            id,
            emergency_contact_name,
            emergency_contact_phone,
            medical_conditions,
            allergies,
            profile:profiles (
              first_name,
              last_name,
              email,
              phone,
              date_of_birth
            )
          )
        `)
        .eq('doctor_id', doctorData.id)
        .order('appointment_date', { ascending: false })

      if (appointmentsError) throw appointmentsError
      setAppointments(appointmentsData || [])

      // Get today's appointments
      const today = new Date().toISOString().split('T')[0]
      const todaysAppts = (appointmentsData || []).filter(
        (apt) => apt.appointment_date === today
      )
      setTodayAppointments(todaysAppts)

      // Calculate statistics
      const currentMonth = new Date().getMonth()
      const currentYear = new Date().getFullYear()
      
      const monthlyAppts = (appointmentsData || []).filter((apt) => {
        const apptDate = new Date(apt.appointment_date)
        return apptDate.getMonth() === currentMonth && apptDate.getFullYear() === currentYear
      })

      const totalRevenue = monthlyAppts.reduce((sum, apt) => sum + (apt.fee || 0), 0)
      const uniquePatients = new Set((appointmentsData || []).map(apt => apt.patient_id)).size
      const completed = (appointmentsData || []).filter(apt => apt.status === 'completed').length
      const pending = (appointmentsData || []).filter(apt => apt.status === 'pending').length

      setStats({
        totalPatients: uniquePatients,
        todayAppointments: todaysAppts.length,
        monthlyRevenue: totalRevenue,
        avgRating: 4.8,
        completedAppointments: completed,
        pendingAppointments: pending
      })

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

  const updateAppointmentStatus = async (appointmentId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('appointments')
        .update({ status: newStatus })
        .eq('id', appointmentId)

      if (error) throw error

      setAppointments(prev => 
        prev.map(apt => apt.id === appointmentId ? { ...apt, status: newStatus } : apt)
      )
      setTodayAppointments(prev => 
        prev.map(apt => apt.id === appointmentId ? { ...apt, status: newStatus } : apt)
      )

      toast({
        title: "Success",
        description: `Appointment ${newStatus} successfully`,
      })
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      })
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      case 'pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
      case 'cancelled': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
      case 'confirmed': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-4 h-4" />
      case 'pending': return <AlertCircle className="w-4 h-4" />
      case 'cancelled': return <XCircle className="w-4 h-4" />
      case 'confirmed': return <CheckCircle className="w-4 h-4" />
      default: return <AlertCircle className="w-4 h-4" />
    }
  }

  const filteredAppointments = appointments.filter(appointment => {
    const matchesSearch = 
      appointment.patient.profile.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.patient.profile.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.service_type.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = selectedStatus === "all" || appointment.status === selectedStatus
    
    return matchesSearch && matchesStatus
  })

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  if (!doctorInfo) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Stethoscope className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
          <h2 className="text-2xl font-bold mb-2">Doctor Profile Not Found</h2>
          <p className="text-muted-foreground mb-4">Your doctor profile needs to be set up by an administrator.</p>
          <Button>Contact Support</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-muted/30 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-primary to-accent rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Avatar className="w-16 h-16 border-4 border-white/20">
                <AvatarImage src="/placeholder.svg" />
                <AvatarFallback className="bg-white/20 text-white text-lg font-bold">
                  {doctorInfo.profiles?.first_name?.[0]}{doctorInfo.profiles?.last_name?.[0]}
                </AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-3xl font-bold">
                  Dr. {doctorInfo.profiles?.first_name} {doctorInfo.profiles?.last_name}
                </h1>
                <p className="text-white/90 text-lg">{doctorInfo.specialty}</p>
                <div className="flex items-center space-x-4 mt-2 text-sm text-white/80">
                  <span className="flex items-center">
                    <Award className="w-4 h-4 mr-1" />
                    {doctorInfo.years_experience} years experience
                  </span>
                  <span className="flex items-center">
                    <Star className="w-4 h-4 mr-1" />
                    {stats.avgRating} rating
                  </span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <p className="text-white/80 text-sm">Today's Appointments</p>
              <p className="text-3xl font-bold">{stats.todayAppointments}</p>
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Patients</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{stats.totalPatients}</div>
              <p className="text-xs text-muted-foreground">
                +12% from last month
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">₹{stats.monthlyRevenue.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                +8% from last month
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.completedAppointments}</div>
              <p className="text-xs text-muted-foreground">
                Appointments this month
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending</CardTitle>
              <AlertCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{stats.pendingAppointments}</div>
              <p className="text-xs text-muted-foreground">
                Awaiting your attention
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="dashboard" className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="appointments">Appointments</TabsTrigger>
            <TabsTrigger value="patients">Patients</TabsTrigger>
            <TabsTrigger value="schedule">Schedule</TabsTrigger>
            <TabsTrigger value="consultations">Consultations</TabsTrigger>
            <TabsTrigger value="profile">Profile</TabsTrigger>
          </TabsList>

          {/* Dashboard Tab */}
          <TabsContent value="dashboard" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Today's Appointments */}
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Clock className="w-5 h-5" />
                      Today's Appointments
                    </CardTitle>
                    <CardDescription>
                      {new Date().toLocaleDateString('en-US', { 
                        weekday: 'long', 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {todayAppointments.length === 0 ? (
                      <div className="text-center py-8">
                        <CalendarIcon className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                        <p className="text-muted-foreground">No appointments today</p>
                        <p className="text-sm text-muted-foreground">Enjoy your free time!</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {todayAppointments.map((appointment) => (
                          <div key={appointment.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                            <div className="flex items-center space-x-4">
                              <Avatar>
                                <AvatarFallback>
                                  {appointment.patient?.profile?.first_name?.[0]}
                                  {appointment.patient?.profile?.last_name?.[0]}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-medium">
                                  {appointment.patient?.profile?.first_name} {appointment.patient?.profile?.last_name}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                  {appointment.start_time} - {appointment.end_time}
                                </p>
                                <p className="text-sm text-muted-foreground">{appointment.service_type}</p>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Badge className={getStatusColor(appointment.status)}>
                                {getStatusIcon(appointment.status)}
                                <span className="ml-1">{appointment.status}</span>
                              </Badge>
                              {appointment.status === 'pending' && (
                                <>
                                  <Button size="sm" onClick={() => updateAppointmentStatus(appointment.id, 'confirmed')}>
                                    Confirm
                                  </Button>
                                  <Button size="sm" variant="outline" onClick={() => updateAppointmentStatus(appointment.id, 'completed')}>
                                    Complete
                                  </Button>
                                </>
                              )}
                              {appointment.status === 'confirmed' && (
                                <Button size="sm" onClick={() => updateAppointmentStatus(appointment.id, 'completed')}>
                                  Complete
                                </Button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Quick Actions & Calendar */}
              <div className="space-y-6">
                {/* Quick Actions */}
                <Card>
                  <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button className="w-full justify-start" variant="outline">
                      <Plus className="w-4 h-4 mr-2" />
                      New Appointment
                    </Button>
                    <Button className="w-full justify-start" variant="outline">
                      <Video className="w-4 h-4 mr-2" />
                      Start Consultation
                    </Button>
                    <Button className="w-full justify-start" variant="outline">
                      <FileText className="w-4 h-4 mr-2" />
                      Write Prescription
                    </Button>
                    <Button className="w-full justify-start" variant="outline">
                      <Settings className="w-4 h-4 mr-2" />
                      Update Schedule
                    </Button>
                  </CardContent>
                </Card>

                {/* Mini Calendar */}
                <Card>
                  <CardHeader>
                    <CardTitle>Calendar</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={(date) => date && setSelectedDate(date)}
                      className="w-full"
                    />
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Appointments Tab */}
          <TabsContent value="appointments" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>All Appointments</CardTitle>
                    <CardDescription>Manage your patient appointments</CardDescription>
                  </div>
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    New Appointment
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {/* Search and Filter */}
                <div className="flex flex-col sm:flex-row gap-4 mb-6">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input
                      placeholder="Search patients or appointment types..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="px-3 py-2 border rounded-md bg-background"
                  >
                    <option value="all">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>

                {/* Appointments Table */}
                {filteredAppointments.length === 0 ? (
                  <div className="text-center py-8">
                    <CalendarIcon className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-muted-foreground">No appointments found</p>
                  </div>
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
                      {filteredAppointments.map((appointment) => (
                        <TableRow key={appointment.id}>
                          <TableCell>
                            <div className="flex items-center space-x-3">
                              <Avatar>
                                <AvatarFallback>
                                  {appointment.patient?.profile?.first_name?.[0]}
                                  {appointment.patient?.profile?.last_name?.[0]}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-medium">
                                  {appointment.patient?.profile?.first_name} {appointment.patient?.profile?.last_name}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                  {appointment.patient?.profile?.phone}
                                </p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div>
                              <p className="font-medium">{appointment.appointment_date}</p>
                              <p className="text-sm text-muted-foreground">
                                {appointment.start_time} - {appointment.end_time}
                              </p>
                            </div>
                          </TableCell>
                          <TableCell>{appointment.service_type}</TableCell>
                          <TableCell>
                            <Badge className={getStatusColor(appointment.status)}>
                              {getStatusIcon(appointment.status)}
                              <span className="ml-1">{appointment.status}</span>
                            </Badge>
                          </TableCell>
                          <TableCell>₹{appointment.fee}</TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button size="sm" variant="outline">
                                <Eye className="w-4 h-4" />
                              </Button>
                              {appointment.status === 'pending' && (
                                <Button size="sm" onClick={() => updateAppointmentStatus(appointment.id, 'confirmed')}>
                                  Confirm
                                </Button>
                              )}
                              {(appointment.status === 'confirmed' || appointment.status === 'pending') && (
                                <Button size="sm" onClick={() => updateAppointmentStatus(appointment.id, 'completed')}>
                                  Complete
                                </Button>
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

          {/* More tabs would continue here... */}
          <TabsContent value="patients">
            <Card>
              <CardHeader>
                <CardTitle>Patient Management</CardTitle>
                <CardDescription>View and manage your patients</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-center text-muted-foreground py-8">
                  Patient management features coming soon...
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="schedule">
            <Card>
              <CardHeader>
                <CardTitle>Schedule Management</CardTitle>
                <CardDescription>Manage your availability and time slots</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-center text-muted-foreground py-8">
                  Schedule management features coming soon...
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="consultations">
            <Card>
              <CardHeader>
                <CardTitle>Online Consultations</CardTitle>
                <CardDescription>Manage video consultations and prescriptions</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-center text-muted-foreground py-8">
                  Consultation features coming soon...
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle>Profile Settings</CardTitle>
                <CardDescription>Update your professional information</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="specialty">Specialty</Label>
                      <Input id="specialty" value={doctorInfo.specialty} readOnly />
                    </div>
                    <div>
                      <Label htmlFor="license">License Number</Label>
                      <Input id="license" value={doctorInfo.license_number} readOnly />
                    </div>
                    <div>
                      <Label htmlFor="experience">Years of Experience</Label>
                      <Input id="experience" value={doctorInfo.years_experience} readOnly />
                    </div>
                    <div>
                      <Label htmlFor="fee">Consultation Fee</Label>
                      <Input id="fee" value={`₹${doctorInfo.consultation_fee}`} readOnly />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="bio">Biography</Label>
                    <Textarea id="bio" value={doctorInfo.bio} readOnly rows={4} />
                  </div>
                  <Button disabled>
                    <Edit className="w-4 h-4 mr-2" />
                    Edit Profile (Contact Admin)
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}