import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Layout } from "@/components/Layout/Layout";
import { AuthProvider, useAuth } from "@/hooks/useAuth";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { ThemeProvider } from "@/components/theme-provider";
import Home from "./pages/Home";
import PatientInfo from "./pages/PatientInfo";
import Members from "./pages/Members";
import Account from "./pages/Account";
import FileShare from "./pages/FileShare";
import Booking from "./pages/Booking";
import Auth from "./pages/Auth";
import Doctor from "./pages/Doctor";
import Hospitals from "./pages/Hospitals";
import HospitalProfile from "./pages/HospitalProfile";
import Doctors from "./pages/Doctors";
import DoctorProfile from "./pages/DoctorProfile";
import DoctorManagement from "./pages/DoctorManagement";
import Unauthorized from "./pages/Unauthorized";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function AppRoutes() {
  const { user, profile, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Redirect based on role for authenticated users
  const getRoleBasedRedirect = () => {
    if (!user) return '/auth';
    if (!profile) return '/'; // Allow access to home while profile is loading
    
    switch (profile.role) {
      case 'doctor':
        return '/doctor';
      case 'patient':
        return '/';
      default:
        return '/';
    }
  };

  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/auth" element={!user ? <Auth /> : <Navigate to={getRoleBasedRedirect()} replace />} />
        <Route path="/unauthorized" element={<Unauthorized />} />
        
        {/* Public home page */}
        <Route path="/" element={
          <Layout>
            <Home />
          </Layout>
        } />
        
        {/* Public pages */}
        <Route path="/hospitals" element={
          <Layout>
            <Hospitals />
          </Layout>
        } />
        
        <Route path="/hospitals/:id" element={
          <Layout>
            <HospitalProfile />
          </Layout>
        } />
        
        <Route path="/doctors" element={
          <Layout>
            <Doctors />
          </Layout>
        } />
        
        <Route path="/doctors/:id" element={
          <Layout>
            <DoctorProfile />
          </Layout>
        } />
        
        <Route path="/admin/doctors" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <Layout>
              <DoctorManagement />
            </Layout>
          </ProtectedRoute>
        } />
        
        {/* Protected routes */}
        
        <Route path="/patient-info" element={
          <ProtectedRoute allowedRoles={['patient']}>
            <Layout>
              <PatientInfo />
            </Layout>
          </ProtectedRoute>
        } />
        
        <Route path="/members" element={
          <ProtectedRoute allowedRoles={['patient', 'doctor']}>
            <Layout>
              <Members />
            </Layout>
          </ProtectedRoute>
        } />
        
        <Route path="/account" element={
          <ProtectedRoute allowedRoles={['patient', 'doctor']}>
            <Layout>
              <Account />
            </Layout>
          </ProtectedRoute>
        } />
        
        <Route path="/file-share" element={
          <ProtectedRoute allowedRoles={['patient', 'doctor']}>
            <Layout>
              <FileShare />
            </Layout>
          </ProtectedRoute>
        } />
        
        <Route path="/booking" element={
          <ProtectedRoute allowedRoles={['patient']}>
            <Layout>
              <Booking />
            </Layout>
          </ProtectedRoute>
        } />
        
        {/* Role-specific dashboards */}
        <Route path="/doctor" element={
          <ProtectedRoute>
            <Layout>
              <Doctor />
            </Layout>
          </ProtectedRoute>
        } />
        
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="light" storageKey="mediconnect-ui-theme">
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <AppRoutes />
        </TooltipProvider>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
