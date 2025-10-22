import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { ShieldAlert, Home, LogOut } from 'lucide-react'

export default function Unauthorized() {
  const navigate = useNavigate()
  const { signOut, profile } = useAuth()

  const handleSignOut = async () => {
    await signOut()
    navigate('/auth')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted p-4">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="p-4 bg-destructive/10 rounded-full">
              <ShieldAlert className="w-12 h-12 text-destructive" />
            </div>
          </div>
          <div>
            <CardTitle className="text-2xl text-destructive">Access Denied</CardTitle>
            <CardDescription className="text-base mt-2">
              {profile?.role === 'patient' 
                ? "This is a doctor-only area. Patients cannot access the doctor portal."
                : "You don't have permission to access this page."
              }
            </CardDescription>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-3">
          <Button 
            onClick={() => navigate('/')} 
            variant="outline" 
            className="w-full"
          >
            <Home className="w-4 h-4 mr-2" />
            Go to Home
          </Button>
          <Button 
            onClick={handleSignOut} 
            variant="destructive" 
            className="w-full"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}