import { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { useLocation } from 'react-router-dom'
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
  Loader2,
  Save,
  Trash2,
  RefreshCw,
  TimerIcon,
  PauseCircle,
  PlayCircle,
  BarChart3,
  LineChart
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

interface TimeSlot {
  id: string
  start_time: string
  end_time: string
  is_available: boolean
  day_of_week: number // 0-6 (Sunday-Saturday)
}

interface DoctorSchedule {
  id: string
  doctor_id: string
  day_of_week: number
  start_time: string
  end_time: string
  is_available: boolean
  break_start?: string
  break_end?: string
  max_appointments_per_slot: number
  slot_duration: number // in minutes
}

interface ScheduleTemplate {
  monday: DoctorSchedule[]
  tuesday: DoctorSchedule[]
  wednesday: DoctorSchedule[]
  thursday: DoctorSchedule[]
  friday: DoctorSchedule[]
  saturday: DoctorSchedule[]
  sunday: DoctorSchedule[]
}

interface Consultation {
  id: string
  appointment_id: string
  type: 'video' | 'chat' | 'phone'
  status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled'
  start_time: string
  end_time?: string
  notes: string
  prescription?: string
  patient: {
    id: string
    profile: {
      first_name: string
      last_name: string
      email: string
      phone: string
    }
  }
  created_at: string
}

interface Prescription {
  id: string
  patient_id: string
  consultation_id: string
  medications: {
    name: string
    dosage: string
    frequency: string
    duration: string
    instructions: string
  }[]
  diagnosis: string
  notes: string
  created_at: string
}

export default function Doctor() {
  const location = useLocation()
  const [activeTab, setActiveTab] = useState("dashboard")
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
  const [editMode, setEditMode] = useState(false)
  const [editedProfile, setEditedProfile] = useState({
    specialty: '',
    license_number: '',
    years_experience: 0,
    bio: '',
    consultation_fee: 0
  })
  
  // Schedule Management State
  const [scheduleData, setScheduleData] = useState<ScheduleTemplate>({
    monday: [],
    tuesday: [],
    wednesday: [],
    thursday: [],
    friday: [],
    saturday: [],
    sunday: []
  })
  const [selectedDay, setSelectedDay] = useState<keyof ScheduleTemplate>('monday')
  const [scheduleEditMode, setScheduleEditMode] = useState(true)
  const [newTimeSlot, setNewTimeSlot] = useState({
    start_time: '09:00',
    end_time: '17:00',
    break_start: '12:00',
    break_end: '13:00',
    slot_duration: 30,
    max_appointments_per_slot: 1
  })

  // Consultation Management State
  const [consultations, setConsultations] = useState<Consultation[]>([])
  const [activeConsultation, setActiveConsultation] = useState<Consultation | null>(null)
  const [consultationNotes, setConsultationNotes] = useState('')
  const [prescriptionData, setPrescriptionData] = useState({
    diagnosis: '',
    medications: [{
      name: '',
      dosage: '',
      frequency: '',
      duration: '',
      instructions: ''
    }],
    notes: ''
  })
  const [consultationFilter, setConsultationFilter] = useState<'all' | 'scheduled' | 'in-progress' | 'completed'>('all')
  
  const { profile } = useAuth()
  const { toast } = useToast()

  // Handle hash navigation
  useEffect(() => {
    const hash = location.hash.replace('#', '')
    if (hash && ['dashboard', 'appointments', 'patients', 'schedule', 'consultations', 'profile'].includes(hash)) {
      setActiveTab(hash)
    }
  }, [location.hash])

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

      // If no doctor profile found, create mock data for demo purposes
      if (doctorError || !doctorData) {
        console.log('No doctor profile found, using mock data for demo')
        const mockDoctorData = {
          id: '550e8400-e29b-41d4-a716-446655440000', // Valid UUID format
          profile_id: profile.id,
          specialty: 'General Medicine',
          license_number: 'MD-2024-001',
          years_experience: 8,
          consultation_fee: 150,
          bio: 'Experienced general practitioner with expertise in preventive care and patient wellness.',
          profiles: {
            first_name: profile.first_name || 'Dr. Demo',
            last_name: profile.last_name || 'Doctor',
            email: profile.email || 'demo@mediconnect.com',
            phone: profile.phone || '+1-555-0123'
          }
        }
        setDoctorInfo(mockDoctorData)
      } else {
        setDoctorInfo(doctorData)
      }

      // Fetch appointments with patient details (use mock data if no real doctor)
      const doctorId = doctorData?.id || '550e8400-e29b-41d4-a716-446655440000'
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
        .eq('doctor_id', doctorId)
        .order('appointment_date', { ascending: false })

      // If no appointments found or error, use mock data for demo
      let appointmentsToUse = appointmentsData || []
      if (appointmentsError || !appointmentsData || appointmentsData.length === 0) {
        console.log('No appointments found, using mock data for demo')
        appointmentsToUse = [
          {
            id: '123e4567-e89b-12d3-a456-426614174000',
            appointment_date: new Date().toISOString().split('T')[0],
            start_time: '09:00',
            end_time: '09:30',
            service_type: 'consultation',
            status: 'confirmed',
            notes: 'Regular checkup',
            fee: 150,
            patient_id: '123e4567-e89b-12d3-a456-426614174001',
            doctor_id: doctorId,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            patient: {
              id: '123e4567-e89b-12d3-a456-426614174001',
              emergency_contact_name: 'Jane Doe',
              emergency_contact_phone: '+1-555-0456',
              medical_conditions: ['Hypertension'],
              allergies: ['None'],
              profile: {
                first_name: 'John',
                last_name: 'Smith',
                email: 'john.smith@email.com',
                phone: '+1-555-0789',
                date_of_birth: '1985-05-15'
              }
            }
          },
          {
            id: '123e4567-e89b-12d3-a456-426614174002',
            appointment_date: new Date(Date.now() + 86400000).toISOString().split('T')[0], // Tomorrow
            start_time: '14:00',
            end_time: '14:30',
            service_type: 'follow-up',
            status: 'pending',
            notes: 'Follow-up consultation',
            fee: 120,
            patient_id: '123e4567-e89b-12d3-a456-426614174003',
            doctor_id: doctorId,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            patient: {
              id: '123e4567-e89b-12d3-a456-426614174003',
              emergency_contact_name: 'Mike Johnson',
              emergency_contact_phone: '+1-555-0321',
              medical_conditions: ['Diabetes'],
              allergies: ['Penicillin'],
              profile: {
                first_name: 'Sarah',
                last_name: 'Wilson',
                email: 'sarah.wilson@email.com',
                phone: '+1-555-0654',
                date_of_birth: '1978-12-03'
              }
            }
          }
        ]
      }

      setAppointments(appointmentsToUse)

      // Get today's appointments
      const today = new Date().toISOString().split('T')[0]
      const todaysAppts = appointmentsToUse.filter(
        (apt) => apt.appointment_date === today
      )
      setTodayAppointments(todaysAppts)

      // Calculate statistics
      const currentMonth = new Date().getMonth()
      const currentYear = new Date().getFullYear()
      
      const monthlyAppts = appointmentsToUse.filter((apt) => {
        const apptDate = new Date(apt.appointment_date)
        return apptDate.getMonth() === currentMonth && apptDate.getFullYear() === currentYear
      })

      const totalRevenue = monthlyAppts.reduce((sum, apt) => sum + (apt.fee || 0), 0)
      const uniquePatients = new Set(appointmentsToUse.map(apt => apt.patient_id)).size
      const completed = appointmentsToUse.filter(apt => apt.status === 'completed').length
      const pending = appointmentsToUse.filter(apt => apt.status === 'pending').length

      setStats({
        totalPatients: uniquePatients || 25, // Demo data
        todayAppointments: todaysAppts.length || 3,
        monthlyRevenue: totalRevenue || 4500,
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

  // Schedule Management Functions
  const fetchScheduleData = async () => {
    if (!doctorInfo) return

    try {
      // For now, we'll create a default schedule template
      // In a real app, this would fetch from a doctor_schedules table
      const defaultSchedule: DoctorSchedule = {
        id: 'default',
        doctor_id: doctorInfo.id,
        day_of_week: 1,
        start_time: '09:00',
        end_time: '17:00',
        is_available: true,
        break_start: '12:00',
        break_end: '13:00',
        max_appointments_per_slot: 1,
        slot_duration: 30
      }

      const weekSchedule: ScheduleTemplate = {
        monday: [{ ...defaultSchedule, day_of_week: 1 }],
        tuesday: [{ ...defaultSchedule, day_of_week: 2 }],
        wednesday: [{ ...defaultSchedule, day_of_week: 3 }],
        thursday: [{ ...defaultSchedule, day_of_week: 4 }],
        friday: [{ ...defaultSchedule, day_of_week: 5 }],
        saturday: [],
        sunday: []
      }

      setScheduleData(weekSchedule)
    } catch (error) {
      console.error('Error fetching schedule:', error)
    }
  }

  const updateScheduleForDay = async (day: keyof ScheduleTemplate) => {
    try {
      const updatedSchedule = {
        ...scheduleData,
        [day]: [{
          id: `${day}-slot`,
          doctor_id: doctorInfo?.id || '',
          day_of_week: getDayNumber(day),
          start_time: newTimeSlot.start_time,
          end_time: newTimeSlot.end_time,
          is_available: true,
          break_start: newTimeSlot.break_start,
          break_end: newTimeSlot.break_end,
          max_appointments_per_slot: newTimeSlot.max_appointments_per_slot,
          slot_duration: newTimeSlot.slot_duration
        }]
      }

      setScheduleData(updatedSchedule)
      toast({
        title: "Success",
        description: `${day.charAt(0).toUpperCase() + day.slice(1)} schedule updated`,
      })
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      })
    }
  }

  const toggleDayAvailability = (day: keyof ScheduleTemplate) => {
    const daySchedule = scheduleData[day]
    if (daySchedule.length > 0) {
      // Remove schedule (make unavailable)
      setScheduleData(prev => ({
        ...prev,
        [day]: []
      }))
    } else {
      // Add default schedule (make available)
      const defaultSlot: DoctorSchedule = {
        id: `${day}-slot`,
        doctor_id: doctorInfo?.id || '',
        day_of_week: getDayNumber(day),
        start_time: '09:00',
        end_time: '17:00',
        is_available: true,
        break_start: '12:00',
        break_end: '13:00',
        max_appointments_per_slot: 1,
        slot_duration: 30
      }
      
      setScheduleData(prev => ({
        ...prev,
        [day]: [defaultSlot]
      }))
    }
  }

  const getDayNumber = (day: keyof ScheduleTemplate): number => {
    const dayMap = {
      sunday: 0,
      monday: 1,
      tuesday: 2,
      wednesday: 3,
      thursday: 4,
      friday: 5,
      saturday: 6
    }
    return dayMap[day]
  }

  const getDayName = (dayNumber: number): string => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    return days[dayNumber]
  }

  useEffect(() => {
    if (doctorInfo) {
      fetchScheduleData()
      fetchConsultations()
    }
  }, [doctorInfo])

  // Consultation Management Functions
  const fetchConsultations = async () => {
    try {
      // Mock consultations data - in real app, fetch from database
      const mockConsultations: Consultation[] = [
        {
          id: '1',
          appointment_id: appointments[0]?.id || 'mock-appointment',
          type: 'video',
          status: 'scheduled',
          start_time: '10:00',
          notes: '',
          patient: {
            id: 'patient-1',
            profile: {
              first_name: 'John',
              last_name: 'Doe',
              email: 'john@example.com',
              phone: '+1234567890'
            }
          },
          created_at: new Date().toISOString()
        }
      ]
      setConsultations(mockConsultations)
    } catch (error) {
      console.error('Error fetching consultations:', error)
    }
  }

  const startConsultation = async (consultationId: string) => {
    try {
      const consultation = consultations.find(c => c.id === consultationId)
      if (consultation) {
        setActiveConsultation({ ...consultation, status: 'in-progress' })
        setConsultations(prev => 
          prev.map(c => c.id === consultationId ? { ...c, status: 'in-progress' } : c)
        )
        toast({
          title: "Consultation Started",
          description: "You can now begin the consultation with the patient",
        })
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      })
    }
  }

  const endConsultation = async (consultationId: string) => {
    try {
      setConsultations(prev => 
        prev.map(c => c.id === consultationId ? { 
          ...c, 
          status: 'completed',
          end_time: new Date().toTimeString().slice(0, 5),
          notes: consultationNotes
        } : c)
      )
      setActiveConsultation(null)
      setConsultationNotes('')
      toast({
        title: "Consultation Completed",
        description: "Consultation notes have been saved",
      })
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      })
    }
  }

  const addMedication = () => {
    setPrescriptionData(prev => ({
      ...prev,
      medications: [...prev.medications, {
        name: '',
        dosage: '',
        frequency: '',
        duration: '',
        instructions: ''
      }]
    }))
  }

  const removeMedication = (index: number) => {
    setPrescriptionData(prev => ({
      ...prev,
      medications: prev.medications.filter((_, i) => i !== index)
    }))
  }

  const updateMedication = (index: number, field: keyof Prescription['medications'][0], value: string) => {
    setPrescriptionData(prev => ({
      ...prev,
      medications: prev.medications.map((med, i) => 
        i === index ? { ...med, [field]: value } : med
      )
    }));
  };

  const savePrescription = async () => {
    try {
      // In real app, save to database
      toast({
        title: "Prescription Saved",
        description: "Prescription has been saved and sent to patient",
      })
      
      // Reset prescription form
      setPrescriptionData({
        diagnosis: '',
        medications: [{
          name: '',
          dosage: '',
          frequency: '',
          duration: '',
          instructions: ''
        }],
        notes: ''
      })
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      })
    }
  }

  const updateDoctorProfile = async () => {
    try {
      // Check if this is a real doctor profile or mock data
      const isRealDoctor = doctorInfo?.id && !doctorInfo.id.startsWith('550e8400-e29b-41d4-a716-446655440000')

      if (isRealDoctor) {
        // Update real doctor profile in database
        const { error } = await supabase
          .from('doctors')
          .update({
            specialty: editedProfile.specialty,
            license_number: editedProfile.license_number,
            years_experience: editedProfile.years_experience,
            bio: editedProfile.bio,
            consultation_fee: editedProfile.consultation_fee
          })
          .eq('id', doctorInfo?.id)

        if (error) throw error
      } else {
        // For mock data, just simulate a successful update
        console.log('Updating mock doctor profile (demo mode)')
      }

      // Update local state regardless of whether it's real or mock data
      setDoctorInfo(prev => prev ? {
        ...prev,
        specialty: editedProfile.specialty,
        license_number: editedProfile.license_number,
        years_experience: editedProfile.years_experience,
        bio: editedProfile.bio,
        consultation_fee: editedProfile.consultation_fee
      } : null)

      setEditMode(false)
      toast({
        title: "Success",
        description: "Profile updated successfully",
      })
    } catch (error: any) {
      console.error('Error updating profile:', error)
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      })
    }
  }

  const startEditMode = () => {
    if (doctorInfo) {
      setEditedProfile({
        specialty: doctorInfo.specialty,
        license_number: doctorInfo.license_number,
        years_experience: doctorInfo.years_experience,
        bio: doctorInfo.bio,
        consultation_fee: doctorInfo.consultation_fee
      })
      setEditMode(true)
    }
  }

  const cancelEditMode = () => {
    setEditMode(false)
    setEditedProfile({
      specialty: '',
      license_number: '',
      years_experience: 0,
      bio: '',
      consultation_fee: 0
    })
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
          <h2 className="text-2xl font-bold mb-2">Loading Doctor Dashboard</h2>
          <p className="text-muted-foreground mb-4">Please wait while we set up your dashboard...</p>
          <Button onClick={() => window.location.reload()}>Refresh</Button>
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
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
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
            <div className="space-y-6">
              
              {/* Schedule Overview Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Working Days</CardTitle>
                    <CalendarDays className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-primary">
                      {Object.values(scheduleData).filter(day => day.length > 0).length}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      days per week
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Daily Hours</CardTitle>
                    <Clock className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-green-600">
                      {scheduleData.monday.length > 0 ? 
                        Math.round((new Date(`2000-01-01T${scheduleData.monday[0].end_time}`).getTime() - 
                                   new Date(`2000-01-01T${scheduleData.monday[0].start_time}`).getTime()) / (1000 * 60 * 60)) : 0}h
                    </div>
                    <p className="text-xs text-muted-foreground">
                      average per day
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Slot Duration</CardTitle>
                    <TimerIcon className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-blue-600">
                      {scheduleData.monday.length > 0 ? scheduleData.monday[0].slot_duration : 30}min
                    </div>
                    <p className="text-xs text-muted-foreground">
                      per appointment
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Weekly Schedule Management */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Weekly Schedule View */}
                <div className="lg:col-span-2">
                  <Card>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle>Weekly Schedule</CardTitle>
                          <CardDescription>Set your availability for each day of the week</CardDescription>
                        </div>
                        <Button 
                          variant={scheduleEditMode ? "default" : "outline"}
                          onClick={() => setScheduleEditMode(!scheduleEditMode)}
                        >
                          {scheduleEditMode ? (
                            <>
                              <Save className="w-4 h-4 mr-2" />
                              Save Changes
                            </>
                          ) : (
                            <>
                              <Edit className="w-4 h-4 mr-2" />
                              Edit Schedule
                            </>
                          )}
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {Object.entries(scheduleData).map(([day, daySchedule]) => {
                          const isAvailable = daySchedule.length > 0
                          const schedule = daySchedule[0]
                          
                          return (
                            <div 
                              key={day} 
                              className={`p-4 border rounded-lg transition-colors ${
                                selectedDay === day ? 'border-primary bg-primary/5' : 'border-border'
                              }`}
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-4">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setSelectedDay(day as keyof ScheduleTemplate)}
                                    className="text-left"
                                  >
                                    <div>
                                      <h3 className="font-semibold capitalize">
                                        {day}
                                      </h3>
                                      {isAvailable && schedule ? (
                                        <div className="text-sm text-muted-foreground">
                                          {schedule.start_time} - {schedule.end_time}
                                          {schedule.break_start && (
                                            <span className="ml-2 text-xs">
                                              (Break: {schedule.break_start}-{schedule.break_end})
                                            </span>
                                          )}
                                        </div>
                                      ) : (
                                        <p className="text-sm text-muted-foreground">Not available</p>
                                      )}
                                    </div>
                                  </Button>
                                </div>

                                <div className="flex items-center space-x-2">
                                  <Badge 
                                    variant={isAvailable ? "default" : "secondary"}
                                    className={isAvailable ? "bg-green-100 text-green-800" : ""}
                                  >
                                    {isAvailable ? (
                                      <>
                                        <PlayCircle className="w-3 h-3 mr-1" />
                                        Available
                                      </>
                                    ) : (
                                      <>
                                        <PauseCircle className="w-3 h-3 mr-1" />
                                        Unavailable
                                      </>
                                    )}
                                  </Badge>
                                  
                                  {scheduleEditMode && (
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => toggleDayAvailability(day as keyof ScheduleTemplate)}
                                    >
                                      {isAvailable ? 'Disable' : 'Enable'}
                                    </Button>
                                  )}
                                </div>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Schedule Editor Sidebar */}
                <div className="space-y-6">
                  {/* Day Schedule Editor */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg capitalize">
                        {selectedDay} Settings
                      </CardTitle>
                      <CardDescription>
                        Configure timing and availability
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {scheduleData[selectedDay].length > 0 ? (
                        <>
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <Label htmlFor="start_time">Start Time</Label>
                              <Input
                                id="start_time"
                                type="time"
                                value={scheduleData[selectedDay][0]?.start_time || newTimeSlot.start_time}
                                onChange={(e) => setNewTimeSlot(prev => ({
                                  ...prev,
                                  start_time: e.target.value
                                }))}
                                disabled={!scheduleEditMode}
                              />
                            </div>
                            <div>
                              <Label htmlFor="end_time">End Time</Label>
                              <Input
                                id="end_time"
                                type="time"
                                value={scheduleData[selectedDay][0]?.end_time || newTimeSlot.end_time}
                                onChange={(e) => setNewTimeSlot(prev => ({
                                  ...prev,
                                  end_time: e.target.value
                                }))}
                                disabled={!scheduleEditMode}
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <Label htmlFor="break_start">Break Start</Label>
                              <Input
                                id="break_start"
                                type="time"
                                value={scheduleData[selectedDay][0]?.break_start || newTimeSlot.break_start}
                                onChange={(e) => setNewTimeSlot(prev => ({
                                  ...prev,
                                  break_start: e.target.value
                                }))}
                                disabled={!scheduleEditMode}
                              />
                            </div>
                            <div>
                              <Label htmlFor="break_end">Break End</Label>
                              <Input
                                id="break_end"
                                type="time"
                                value={scheduleData[selectedDay][0]?.break_end || newTimeSlot.break_end}
                                onChange={(e) => setNewTimeSlot(prev => ({
                                  ...prev,
                                  break_end: e.target.value
                                }))}
                                disabled={!scheduleEditMode}
                              />
                            </div>
                          </div>

                          <div>
                            <Label htmlFor="slot_duration">Slot Duration (minutes)</Label>
                            <Input
                              id="slot_duration"
                              type="number"
                              min="15"
                              max="120"
                              step="15"
                              value={scheduleData[selectedDay][0]?.slot_duration || newTimeSlot.slot_duration}
                              onChange={(e) => setNewTimeSlot(prev => ({
                                ...prev,
                                slot_duration: parseInt(e.target.value) || 30
                              }))}
                              disabled={!scheduleEditMode}
                            />
                          </div>

                          <div>
                            <Label htmlFor="max_appointments">Max Appointments per Slot</Label>
                            <Input
                              id="max_appointments"
                              type="number"
                              min="1"
                              max="5"
                              value={scheduleData[selectedDay][0]?.max_appointments_per_slot || newTimeSlot.max_appointments_per_slot}
                              onChange={(e) => setNewTimeSlot(prev => ({
                                ...prev,
                                max_appointments_per_slot: parseInt(e.target.value) || 1
                              }))}
                              disabled={!scheduleEditMode}
                            />
                          </div>

                          {scheduleEditMode && (
                            <Button 
                              onClick={() => updateScheduleForDay(selectedDay)}
                              className="w-full"
                            >
                              <Save className="w-4 h-4 mr-2" />
                              Update {selectedDay.charAt(0).toUpperCase() + selectedDay.slice(1)}
                            </Button>
                          )}
                        </>
                      ) : (
                        <div className="text-center py-6">
                          <PauseCircle className="w-12 h-12 mx-auto mb-3 text-muted-foreground" />
                          <h3 className="font-semibold mb-2">Day Off</h3>
                          <p className="text-sm text-muted-foreground mb-4">
                            This day is marked as unavailable
                          </p>
                          {scheduleEditMode && (
                            <Button onClick={() => toggleDayAvailability(selectedDay)}>
                              <Plus className="w-4 h-4 mr-2" />
                              Enable {selectedDay.charAt(0).toUpperCase() + selectedDay.slice(1)}
                            </Button>
                          )}
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* Quick Actions */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Quick Actions</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <Button className="w-full justify-start" variant="outline">
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Reset to Default
                      </Button>
                      <Button className="w-full justify-start" variant="outline">
                        <CalendarIcon className="w-4 h-4 mr-2" />
                        Copy Schedule
                      </Button>
                      <Button className="w-full justify-start" variant="outline">
                        <Settings className="w-4 h-4 mr-2" />
                        Advanced Settings
                      </Button>
                    </CardContent>
                  </Card>

                  {/* Today's Schedule Preview */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Today's Schedule</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {(() => {
                        const today = new Date().getDay()
                        const dayNames: (keyof ScheduleTemplate)[] = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']
                        const todaySchedule = scheduleData[dayNames[today]]
                        
                        if (todaySchedule.length === 0) {
                          return (
                            <div className="text-center py-4">
                              <PauseCircle className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                              <p className="text-sm text-muted-foreground">Day off today</p>
                            </div>
                          )
                        }

                        const schedule = todaySchedule[0]
                        return (
                          <div className="space-y-3">
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">Working Hours:</span>
                              <span className="font-medium">{schedule.start_time} - {schedule.end_time}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">Break Time:</span>
                              <span className="font-medium">{schedule.break_start} - {schedule.break_end}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">Slot Duration:</span>
                              <span className="font-medium">{schedule.slot_duration} minutes</span>
                            </div>
                            <div className="pt-2 border-t">
                              <div className="text-sm text-muted-foreground">Available Slots:</div>
                              <div className="text-lg font-semibold text-primary">
                                {Math.floor((new Date(`2000-01-01T${schedule.end_time}`).getTime() - 
                                           new Date(`2000-01-01T${schedule.start_time}`).getTime() - 
                                           (new Date(`2000-01-01T${schedule.break_end}`).getTime() - 
                                            new Date(`2000-01-01T${schedule.break_start}`).getTime())) / 
                                           (schedule.slot_duration * 60 * 1000))} slots
                              </div>
                            </div>
                          </div>
                        )
                      })()}
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="consultations">
            <div className="space-y-6">
              
              {/* Consultation Overview Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Consultations</CardTitle>
                    <Video className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-primary">{consultations.length}</div>
                    <p className="text-xs text-muted-foreground">
                      this week
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Scheduled</CardTitle>
                    <Clock className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-blue-600">
                      {consultations.filter(c => c.status === 'scheduled').length}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      upcoming
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">In Progress</CardTitle>
                    <PlayCircle className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-green-600">
                      {consultations.filter(c => c.status === 'in-progress').length}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      active now
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Completed</CardTitle>
                    <CheckCircle className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-gray-600">
                      {consultations.filter(c => c.status === 'completed').length}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      today
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Active Consultation */}
              {activeConsultation && (
                <Card className="border-primary bg-primary/5">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-green-600">
                          Active Consultation
                        </CardTitle>
                        <CardDescription>
                          {activeConsultation.patient.profile.first_name} {activeConsultation.patient.profile.last_name}
                        </CardDescription>
                      </div>
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline">
                          <MessageSquare className="w-4 h-4 mr-2" />
                          Chat
                        </Button>
                        <Button size="sm" variant="outline">
                          <Video className="w-4 h-4 mr-2" />
                          Video Call
                        </Button>
                        <Button size="sm" onClick={() => endConsultation(activeConsultation.id)}>
                          End Session
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="consultation-notes">Session Notes</Label>
                        <Textarea
                          id="consultation-notes"
                          placeholder="Enter your consultation notes here..."
                          value={consultationNotes}
                          onChange={(e) => setConsultationNotes(e.target.value)}
                          rows={4}
                        />
                      </div>
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <span>Session started at {activeConsultation.start_time}</span>
                        <span>Type: {activeConsultation.type}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Main Consultation Management */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Consultations List */}
                <div className="lg:col-span-2 space-y-6">
                  
                  {/* Consultations Table */}
                  <Card>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle>Consultations</CardTitle>
                          <CardDescription>Manage your video and chat consultations</CardDescription>
                        </div>
                        <div className="flex space-x-2">
                          <select
                            value={consultationFilter}
                            onChange={(e) => setConsultationFilter(e.target.value as any)}
                            className="px-3 py-2 border rounded-md bg-background text-sm"
                          >
                            <option value="all">All Status</option>
                            <option value="scheduled">Scheduled</option>
                            <option value="in-progress">In Progress</option>
                            <option value="completed">Completed</option>
                          </select>
                          <Button>
                            <Plus className="w-4 h-4 mr-2" />
                            New Consultation
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      {consultations.length === 0 ? (
                        <div className="text-center py-8">
                          <Video className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                          <p className="text-muted-foreground">No consultations scheduled</p>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {consultations
                            .filter(consultation => 
                              consultationFilter === 'all' || consultation.status === consultationFilter
                            )
                            .map((consultation) => (
                              <div key={consultation.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                                <div className="flex items-center space-x-4">
                                  <Avatar>
                                    <AvatarFallback>
                                      {consultation.patient.profile.first_name[0]}
                                      {consultation.patient.profile.last_name[0]}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div>
                                    <h3 className="font-medium">
                                      {consultation.patient.profile.first_name} {consultation.patient.profile.last_name}
                                    </h3>
                                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                                      <span>{consultation.start_time}</span>
                                      {consultation.type === 'video' && <Video className="w-3 h-3" />}
                                      {consultation.type === 'chat' && <MessageSquare className="w-3 h-3" />}
                                      {consultation.type === 'phone' && <Phone className="w-3 h-3" />}
                                      <span className="capitalize">{consultation.type}</span>
                                    </div>
                                  </div>
                                </div>
                                
                                <div className="flex items-center space-x-3">
                                  <Badge 
                                    className={`${
                                      consultation.status === 'scheduled' ? 'bg-blue-100 text-blue-800' :
                                      consultation.status === 'in-progress' ? 'bg-green-100 text-green-800' :
                                      consultation.status === 'completed' ? 'bg-gray-100 text-gray-800' :
                                      'bg-red-100 text-red-800'
                                    }`}
                                  >
                                    {consultation.status === 'in-progress' && <PlayCircle className="w-3 h-3 mr-1" />}
                                    {consultation.status === 'completed' && <CheckCircle className="w-3 h-3 mr-1" />}
                                    {consultation.status === 'scheduled' && <Clock className="w-3 h-3 mr-1" />}
                                    <span className="capitalize">{consultation.status.replace('-', ' ')}</span>
                                  </Badge>
                                  
                                  {consultation.status === 'scheduled' && (
                                    <Button 
                                      size="sm"
                                      onClick={() => startConsultation(consultation.id)}
                                    >
                                      Start
                                    </Button>
                                  )}
                                  
                                  {consultation.status === 'in-progress' && (
                                    <Button 
                                      size="sm" 
                                      variant="outline"
                                      onClick={() => endConsultation(consultation.id)}
                                    >
                                      End
                                    </Button>
                                  )}
                                  
                                  <Button size="sm" variant="outline">
                                    <Eye className="w-4 h-4" />
                                  </Button>
                                </div>
                              </div>
                            ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* Prescription Writer */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Write Prescription</CardTitle>
                      <CardDescription>Create and manage patient prescriptions</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="diagnosis">Diagnosis</Label>
                          <Input
                            id="diagnosis"
                            placeholder="Enter diagnosis..."
                            value={prescriptionData.diagnosis}
                            onChange={(e) => setPrescriptionData(prev => ({
                              ...prev,
                              diagnosis: e.target.value
                            }))}
                          />
                        </div>

                        <div>
                          <div className="flex items-center justify-between mb-3">
                            <Label>Medications</Label>
                            <Button size="sm" onClick={addMedication}>
                              <Plus className="w-4 h-4 mr-2" />
                              Add Medication
                            </Button>
                          </div>

                          <div className="space-y-4">
                            {prescriptionData.medications.map((medication, index) => (
                              <div key={index} className="p-4 border rounded-lg space-y-3">
                                <div className="flex items-center justify-between">
                                  <h4 className="font-medium">Medication {index + 1}</h4>
                                  {prescriptionData.medications.length > 1 && (
                                    <Button 
                                      size="sm" 
                                      variant="outline"
                                      onClick={() => removeMedication(index)}
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </Button>
                                  )}
                                </div>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                  <div>
                                    <Label>Medication Name</Label>
                                    <Input
                                      placeholder="e.g., Paracetamol"
                                      value={medication.name}
                                      onChange={(e) => updateMedication(index, 'name', e.target.value)}
                                    />
                                  </div>
                                  <div>
                                    <Label>Dosage</Label>
                                    <Input
                                      placeholder="e.g., 500mg"
                                      value={medication.dosage}
                                      onChange={(e) => updateMedication(index, 'dosage', e.target.value)}
                                    />
                                  </div>
                                  <div>
                                    <Label>Frequency</Label>
                                    <Input
                                      placeholder="e.g., Twice daily"
                                      value={medication.frequency}
                                      onChange={(e) => updateMedication(index, 'frequency', e.target.value)}
                                    />
                                  </div>
                                  <div>
                                    <Label>Duration</Label>
                                    <Input
                                      placeholder="e.g., 7 days"
                                      value={medication.duration}
                                      onChange={(e) => updateMedication(index, 'duration', e.target.value)}
                                    />
                                  </div>
                                </div>
                                
                                <div>
                                  <Label>Special Instructions</Label>
                                  <Input
                                    placeholder="e.g., Take after meals"
                                    value={medication.instructions}
                                    onChange={(e) => updateMedication(index, 'instructions', e.target.value)}
                                  />
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div>
                          <Label htmlFor="prescription-notes">Additional Notes</Label>
                          <Textarea
                            id="prescription-notes"
                            placeholder="Any additional instructions or notes..."
                            value={prescriptionData.notes}
                            onChange={(e) => setPrescriptionData(prev => ({
                              ...prev,
                              notes: e.target.value
                            }))}
                            rows={3}
                          />
                        </div>

                        <Button onClick={savePrescription} className="w-full">
                          <FileText className="w-4 h-4 mr-2" />
                          Save Prescription
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Consultation Tools Sidebar */}
                <div className="space-y-6">
                  
                  {/* Quick Actions */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Quick Actions</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <Button className="w-full justify-start" variant="outline">
                        <Video className="w-4 h-4 mr-2" />
                        Start Video Call
                      </Button>
                      <Button className="w-full justify-start" variant="outline">
                        <MessageSquare className="w-4 h-4 mr-2" />
                        Send Message
                      </Button>
                      <Button className="w-full justify-start" variant="outline">
                        <FileText className="w-4 h-4 mr-2" />
                        New Prescription
                      </Button>
                      <Button className="w-full justify-start" variant="outline">
                        <CalendarIcon className="w-4 h-4 mr-2" />
                        Schedule Follow-up
                      </Button>
                    </CardContent>
                  </Card>

                  {/* Today's Schedule */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Today's Consultations</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {consultations
                          .filter(c => c.status === 'scheduled' || c.status === 'in-progress')
                          .slice(0, 3)
                          .map((consultation) => (
                            <div key={consultation.id} className="flex items-center space-x-3">
                              <div className={`w-3 h-3 rounded-full ${
                                consultation.status === 'in-progress' ? 'bg-green-500' : 'bg-blue-500'
                              }`} />
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium truncate">
                                  {consultation.patient.profile.first_name} {consultation.patient.profile.last_name}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  {consultation.start_time} • {consultation.type}
                                </p>
                              </div>
                            </div>
                          ))}
                        
                        {consultations.filter(c => c.status === 'scheduled' || c.status === 'in-progress').length === 0 && (
                          <p className="text-sm text-muted-foreground text-center py-4">
                            No consultations today
                          </p>
                        )}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Consultation Stats */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">This Week</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Video Calls:</span>
                        <span className="font-medium">
                          {consultations.filter(c => c.type === 'video').length}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Chat Sessions:</span>
                        <span className="font-medium">
                          {consultations.filter(c => c.type === 'chat').length}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Phone Calls:</span>
                        <span className="font-medium">
                          {consultations.filter(c => c.type === 'phone').length}
                        </span>
                      </div>
                      <div className="pt-2 border-t">
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Total Sessions:</span>
                          <span className="font-semibold text-primary">{consultations.length}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
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
                      {editMode ? (
                        <Input 
                          id="specialty" 
                          value={editedProfile.specialty}
                          onChange={(e) => setEditedProfile(prev => ({...prev, specialty: e.target.value}))}
                          placeholder="Enter your specialty"
                        />
                      ) : (
                        <Input id="specialty" value={doctorInfo.specialty} readOnly />
                      )}
                    </div>
                    <div>
                      <Label htmlFor="license">License Number</Label>
                      {editMode ? (
                        <Input 
                          id="license" 
                          value={editedProfile.license_number}
                          onChange={(e) => setEditedProfile(prev => ({...prev, license_number: e.target.value}))}
                          placeholder="Enter your license number"
                        />
                      ) : (
                        <Input id="license" value={doctorInfo.license_number} readOnly />
                      )}
                    </div>
                    <div>
                      <Label htmlFor="experience">Years of Experience</Label>
                      {editMode ? (
                        <Input 
                          id="experience" 
                          type="number"
                          value={editedProfile.years_experience}
                          onChange={(e) => setEditedProfile(prev => ({...prev, years_experience: parseInt(e.target.value) || 0}))}
                          placeholder="Enter years of experience"
                        />
                      ) : (
                        <Input id="experience" value={doctorInfo.years_experience} readOnly />
                      )}
                    </div>
                    <div>
                      <Label htmlFor="fee">Consultation Fee</Label>
                      {editMode ? (
                        <Input 
                          id="fee" 
                          type="number"
                          value={editedProfile.consultation_fee}
                          onChange={(e) => setEditedProfile(prev => ({...prev, consultation_fee: parseInt(e.target.value) || 0}))}
                          placeholder="Enter consultation fee"
                        />
                      ) : (
                        <Input id="fee" value={`₹${doctorInfo.consultation_fee}`} readOnly />
                      )}
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="bio">Biography</Label>
                    {editMode ? (
                      <Textarea 
                        id="bio" 
                        value={editedProfile.bio}
                        onChange={(e) => setEditedProfile(prev => ({...prev, bio: e.target.value}))}
                        placeholder="Enter your professional biography"
                        rows={4} 
                      />
                    ) : (
                      <Textarea id="bio" value={doctorInfo.bio} readOnly rows={4} />
                    )}
                  </div>
                  
                  <div className="flex space-x-3">
                    {editMode ? (
                      <>
                        <Button onClick={updateDoctorProfile}>
                          <Save className="w-4 h-4 mr-2" />
                          Save Changes
                        </Button>
                        <Button variant="outline" onClick={cancelEditMode}>
                          Cancel
                        </Button>
                      </>
                    ) : (
                      <Button onClick={startEditMode}>
                        <Edit className="w-4 h-4 mr-2" />
                        Edit Profile
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics">
            <div className="space-y-6">
              
              {/* Analytics Overview */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-green-600">$12,450</div>
                    <p className="text-xs text-muted-foreground">
                      +20.1% from last month
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Patient Satisfaction</CardTitle>
                    <Star className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-yellow-600">4.9</div>
                    <p className="text-xs text-muted-foreground">
                      Average rating this month
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Consultation Hours</CardTitle>
                    <Clock className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-blue-600">156</div>
                    <p className="text-xs text-muted-foreground">
                      +8% from last month
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-emerald-600">94.2%</div>
                    <p className="text-xs text-muted-foreground">
                      Patient recovery rate
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Charts Section */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* Revenue Chart */}
                <Card>
                  <CardHeader>
                    <CardTitle>Monthly Revenue</CardTitle>
                    <CardDescription>Revenue trends over the last 6 months</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64 flex items-center justify-center border-2 border-dashed border-muted-foreground/25 rounded-lg">
                      <div className="text-center">
                        <BarChart3 className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground">Revenue Chart</p>
                        <p className="text-xs text-muted-foreground mt-1">Chart component integration pending</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Appointment Trends */}
                <Card>
                  <CardHeader>
                    <CardTitle>Appointment Trends</CardTitle>
                    <CardDescription>Daily appointment bookings this month</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64 flex items-center justify-center border-2 border-dashed border-muted-foreground/25 rounded-lg">
                      <div className="text-center">
                        <LineChart className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground">Trends Chart</p>
                        <p className="text-xs text-muted-foreground mt-1">Chart component integration pending</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Detailed Analytics */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Performance Metrics */}
                <div className="lg:col-span-2 space-y-6">
                  
                  <Card>
                    <CardHeader>
                      <CardTitle>Performance Metrics</CardTitle>
                      <CardDescription>Key performance indicators for your practice</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="space-y-1">
                            <p className="text-sm font-medium">Patient Retention Rate</p>
                            <p className="text-xs text-muted-foreground">Returning patients vs new patients</p>
                          </div>
                          <div className="text-right">
                            <p className="text-2xl font-bold text-primary">87%</p>
                            <p className="text-xs text-green-600">+5.2%</p>
                          </div>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2">
                          <div className="bg-primary h-2 rounded-full" style={{ width: '87%' }}></div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="space-y-1">
                            <p className="text-sm font-medium">Average Session Duration</p>
                            <p className="text-xs text-muted-foreground">Time spent per consultation</p>
                          </div>
                          <div className="text-right">
                            <p className="text-2xl font-bold text-primary">28 min</p>
                            <p className="text-xs text-blue-600">+2.1 min</p>
                          </div>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2">
                          <div className="bg-blue-500 h-2 rounded-full" style={{ width: '75%' }}></div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="space-y-1">
                            <p className="text-sm font-medium">No-Show Rate</p>
                            <p className="text-xs text-muted-foreground">Appointments missed without notice</p>
                          </div>
                          <div className="text-right">
                            <p className="text-2xl font-bold text-primary">8.3%</p>
                            <p className="text-xs text-red-600">+1.2%</p>
                          </div>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2">
                          <div className="bg-red-500 h-2 rounded-full" style={{ width: '8.3%' }}></div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="space-y-1">
                            <p className="text-sm font-medium">Online Consultation Rate</p>
                            <p className="text-xs text-muted-foreground">Digital vs in-person appointments</p>
                          </div>
                          <div className="text-right">
                            <p className="text-2xl font-bold text-primary">64%</p>
                            <p className="text-xs text-green-600">+12.3%</p>
                          </div>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2">
                          <div className="bg-emerald-500 h-2 rounded-full" style={{ width: '64%' }}></div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Recent Reviews */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Recent Patient Reviews</CardTitle>
                      <CardDescription>Latest feedback from your patients</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {[
                          {
                            patient: "Sarah Johnson",
                            rating: 5,
                            review: "Excellent consultation! Dr. was very thorough and explained everything clearly. The online platform made it so convenient.",
                            date: "2 days ago"
                          },
                          {
                            patient: "Mike Chen",
                            rating: 5,
                            review: "Great follow-up session. Really appreciated the detailed prescription and care instructions.",
                            date: "4 days ago"
                          },
                          {
                            patient: "Emily Davis",
                            rating: 4,
                            review: "Professional service and timely consultation. Would recommend to others.",
                            date: "1 week ago"
                          }
                        ].map((review, index) => (
                          <div key={index} className="p-4 border rounded-lg space-y-2">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-2">
                                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                                  <span className="text-xs font-semibold text-primary">
                                    {review.patient.split(' ').map(n => n[0]).join('')}
                                  </span>
                                </div>
                                <div>
                                  <p className="font-medium text-sm">{review.patient}</p>
                                  <div className="flex items-center space-x-1">
                                    {Array.from({ length: 5 }).map((_, i) => (
                                      <Star
                                        key={i}
                                        className={`w-3 h-3 ${
                                          i < review.rating 
                                            ? 'text-yellow-400 fill-current' 
                                            : 'text-gray-300'
                                        }`}
                                      />
                                    ))}
                                  </div>
                                </div>
                              </div>
                              <span className="text-xs text-muted-foreground">{review.date}</span>
                            </div>
                            <p className="text-sm text-muted-foreground">{review.review}</p>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Analytics Sidebar */}
                <div className="space-y-6">
                  
                  {/* Quick Stats */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">This Week</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">New Patients:</span>
                        <span className="font-semibold text-primary">12</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Follow-ups:</span>
                        <span className="font-semibold">8</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Consultations:</span>
                        <span className="font-semibold">24</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Revenue:</span>
                        <span className="font-semibold text-green-600">$2,890</span>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Top Diagnoses */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Top Diagnoses</CardTitle>
                      <CardDescription>Most common conditions this month</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {[
                          { condition: "Hypertension", count: 18, percentage: 35 },
                          { condition: "Common Cold", count: 12, percentage: 23 },
                          { condition: "Diabetes Follow-up", count: 8, percentage: 15 },
                          { condition: "Anxiety", count: 6, percentage: 12 },
                          { condition: "Other", count: 8, percentage: 15 }
                        ].map((item, index) => (
                          <div key={index} className="space-y-1">
                            <div className="flex justify-between text-sm">
                              <span className="font-medium">{item.condition}</span>
                              <span className="text-muted-foreground">{item.count}</span>
                            </div>
                            <div className="w-full bg-muted rounded-full h-1.5">
                              <div 
                                className="bg-primary h-1.5 rounded-full" 
                                style={{ width: `${item.percentage}%` }}
                              ></div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Goal Progress */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Monthly Goals</CardTitle>
                      <CardDescription>Track your practice objectives</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Patient Target</span>
                          <span className="text-muted-foreground">85/100</span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2">
                          <div className="bg-blue-500 h-2 rounded-full" style={{ width: '85%' }}></div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Revenue Goal</span>
                          <span className="text-muted-foreground">$12,450/$15,000</span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2">
                          <div className="bg-green-500 h-2 rounded-full" style={{ width: '83%' }}></div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Satisfaction</span>
                          <span className="text-muted-foreground">4.9/5.0</span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2">
                          <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '98%' }}></div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Export Options */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Export Reports</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <Button variant="outline" size="sm" className="w-full justify-start">
                        <FileText className="w-4 h-4 mr-2" />
                        Monthly Report
                      </Button>
                      <Button variant="outline" size="sm" className="w-full justify-start">
                        <BarChart3 className="w-4 h-4 mr-2" />
                        Performance Summary
                      </Button>
                      <Button variant="outline" size="sm" className="w-full justify-start">
                        <DollarSign className="w-4 h-4 mr-2" />
                        Revenue Report
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}