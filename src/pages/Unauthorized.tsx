import { Button } from '@/components/ui/button'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'

export default function Unauthorized() {
  const navigate = useNavigate()
  const { signOut } = useAuth()

  const handleSignOut = async () => {
    await signOut()
    navigate('/auth')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-destructive/10 to-destructive/5">
      <div className="text-center space-y-6 p-8">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold text-destructive">Access Denied</h1>
          <p className="text-lg text-muted-foreground">
            You don't have permission to access this page.
          </p>
        </div>
        
        <div className="space-y-4">
          <Button onClick={() => navigate('/')} variant="outline">
            Go Home
          </Button>
          <Button onClick={handleSignOut} variant="destructive">
            Sign Out
          </Button>
        </div>
      </div>
    </div>
  )
}