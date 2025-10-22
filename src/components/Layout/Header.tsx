import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Bell, Globe, Menu, X, Heart, Stethoscope, Calendar, FileText, MessageSquare, ChevronDown, FileSearch, Activity, Sparkles, Brain, LogIn, User, Moon, Sun } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import { Badge } from "@/components/ui/badge";
import { useTheme } from "@/components/theme-provider";
import { supabase } from "@/integrations/supabase/client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mobileAIMenuOpen, setMobileAIMenuOpen] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, profile, signOut } = useAuth();
  const { theme, setTheme } = useTheme();

  // AI Services menu items
  const aiServicesMenu = [
    {
      name: "AI Health Assistant",
      description: "Personalized health guidance",
      href: "/ai/health-assistant",
      icon: MessageSquare,
      gradient: "from-blue-500 to-cyan-500"
    },
    {
      name: "Symptom Analyzer",
      description: "AI-powered symptom checker",
      href: "/ai/symptom-analyzer",
      icon: FileSearch,
      gradient: "from-purple-500 to-pink-500"
    },
    {
      name: "Smart Booking",
      description: "Intelligent appointment scheduling",
      href: "/ai/smart-booking",
      icon: Calendar,
      gradient: "from-green-500 to-emerald-500"
    },
    {
      name: "Health Insights",
      description: "Data analytics dashboard",
      href: "/ai/health-insights",
      icon: Activity,
      gradient: "from-orange-500 to-red-500"
    }
  ];

  const handleSignOut = async () => {
    await signOut();
    navigate('/auth');
  };

  const getInitials = (firstName?: string, lastName?: string) => {
    return `${firstName?.[0] || ''}${lastName?.[0] || ''}`.toUpperCase();
  };

  const getRoleBasedNavigation = () => {
    const commonLinks = [
      { name: "Home", href: "/" },
    ];

    if (!user) {
      return [
        ...commonLinks,
        { name: "About", href: "/about" },
      ];
    }

    const authenticatedLinks = [
      ...commonLinks,
      { name: "Members", href: "/members" },
    ];

    if (!profile) return authenticatedLinks;

    switch (profile.role) {
      case 'doctor':
        return [
          { name: "Dashboard", href: "/doctor" },
          ...authenticatedLinks,
          { name: "My Patients", href: "/doctor#patients" },
          { name: "Schedule", href: "/doctor#schedule" },
        ];
      case 'patient':
        return [
          ...authenticatedLinks,
          { name: "Find Doctors", href: "/doctors" },
          { name: "My Appointments", href: "/account" },
          { name: "Health Records", href: "/patient-info" },
          { name: "File Share", href: "/file-share" },
          { name: "Book Appointment", href: "/booking" },
        ];
      default:
        return authenticatedLinks;
    }
  };

  const navigation = getRoleBasedNavigation();

  const isActiveLink = (href: string) => {
    if (href.startsWith("/#")) {
      return location.pathname === "/" && location.hash === href.substring(1);
    }
    return location.pathname === href;
  };

  // Fetch notifications for the current user
  useEffect(() => {
    if (user && profile) {
      loadNotifications();
    }
  }, [user, profile]);

  const loadNotifications = async () => {
    try {
      // Generate sample notifications based on user role
      const sampleNotifications = [];
      
      if (profile?.role === 'patient') {
        sampleNotifications.push(
          {
            id: '1',
            type: 'appointment',
            title: 'Upcoming Appointment',
            message: 'You have an appointment tomorrow at 10:00 AM',
            icon: Calendar,
            time: '1 hour ago',
            read: false
          },
          {
            id: '2',
            type: 'message',
            title: 'New Message',
            message: 'Dr. Smith sent you a follow-up message',
            icon: MessageSquare,
            time: '3 hours ago',
            read: false
          },
          {
            id: '3',
            type: 'result',
            title: 'Lab Results Available',
            message: 'Your recent lab results are now ready for review',
            icon: FileText,
            time: '1 day ago',
            read: true
          }
        );
      } else if (profile?.role === 'doctor') {
        sampleNotifications.push(
          {
            id: '1',
            type: 'appointment',
            title: 'New Appointment Request',
            message: 'John Doe requested an appointment for tomorrow',
            icon: Calendar,
            time: '30 minutes ago',
            read: false
          },
          {
            id: '2',
            type: 'message',
            title: 'Patient Message',
            message: 'You have 3 unread patient messages',
            icon: MessageSquare,
            time: '2 hours ago',
            read: false
          }
        );
      }

      setNotifications(sampleNotifications);
      setUnreadCount(sampleNotifications.filter(n => !n.read).length);
    } catch (error) {
      console.error('Error loading notifications:', error);
    }
  };

  const markAsRead = (notificationId: string) => {
    setNotifications(prev => 
      prev.map(n => 
        n.id === notificationId ? { ...n, read: true } : n
      )
    );
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    setUnreadCount(0);
  };

  return (
    <header className="bg-white/95 dark:bg-background/95 backdrop-blur-sm border-b border-border sticky top-0 z-50">
      <nav className="container mx-auto px-4 lg:px-6 py-3 flex justify-between items-center">
        {/* Logo */}
        <Link 
          to="/" 
          className="flex items-center space-x-3 hover:opacity-90 transition-all duration-300 transform hover:scale-105 group"
        >
          <div className="relative flex-shrink-0">
            <img 
              src="/logo.svg" 
              alt="MediConnect Logo" 
              className="w-10 h-10 group-hover:rotate-6 transition-transform duration-300"
            />
          </div>
          <span className="text-2xl md:text-3xl font-extrabold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent tracking-tight">
            MediConnect
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-8">
          {navigation.slice(0, 1).map((item) => (
            <Link
              key={item.name}
              to={item.href}
              className={cn(
                "font-semibold transition-colors hover:text-primary",
                isActiveLink(item.href) 
                  ? "text-primary dark:text-primary-light" 
                  : "text-slate-800 dark:text-slate-200"
              )}
            >
              {item.name}
            </Link>
          ))}
          
          {/* AI Services Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                className={cn(
                    "font-semibold transition-colors hover:text-primary hover:bg-transparent p-0 h-auto",
                    location.pathname.startsWith('/ai') 
                      ? "text-primary dark:text-primary-light" 
                      : "text-slate-800 dark:text-slate-200"
                  )}
              >
                AI Services
                <ChevronDown className="w-4 h-4 ml-1" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-80 p-2">
              {aiServicesMenu.map((service, index) => (
                <DropdownMenuItem key={index} asChild className="p-0">
                  <Link
                    to={service.href}
                    className="flex items-center gap-4 p-3 rounded-lg hover:bg-accent cursor-pointer"
                  >
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${service.gradient} flex items-center justify-center flex-shrink-0`}>
                      <service.icon className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-sm text-foreground">
                        {service.name}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {service.description}
                      </div>
                    </div>
                  </Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          
            {navigation.slice(1).map((item) => (
            <Link
              key={item.name}
              to={item.href}
              className={cn(
                "font-semibold transition-colors hover:text-primary",
                isActiveLink(item.href) 
                  ? "text-primary dark:text-primary-light" 
                  : "text-slate-800 dark:text-slate-200"
              )}
            >
              {item.name}
            </Link>
          ))}
        </div>

        {/* Right Side Actions */}
        <div className="flex items-center space-x-4">
          {/* Theme Toggle Icon */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all duration-300"
          >
            {theme === "dark" ? (
              <Sun className="w-5 h-5" />
            ) : (
              <Moon className="w-5 h-5" />
            )}
          </Button>

          {/* Notifications Dropdown */}
          {user && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all duration-300">
                  <Bell className="w-5 h-5" />
                  {unreadCount > 0 && (
                    <Badge 
                      variant="destructive" 
                      className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
                    >
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </Badge>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80 max-h-96 overflow-y-auto">
                <div className="flex items-center justify-between p-3 border-b">
                  <h4 className="font-semibold text-sm">Notifications</h4>
                  {unreadCount > 0 && (
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={markAllAsRead}
                      className="text-xs text-muted-foreground hover:text-primary"
                    >
                      Mark all read
                    </Button>
                  )}
                </div>
                
                {notifications.length === 0 ? (
                  <div className="p-4 text-center text-muted-foreground">
                    <Bell className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No notifications yet</p>
                  </div>
                ) : (
                  notifications.map((notification) => {
                    const IconComponent = notification.icon;
                    return (
                      <DropdownMenuItem 
                        key={notification.id}
                        className={cn(
                          "p-3 cursor-pointer flex items-start space-x-3 border-b last:border-b-0",
                          !notification.read && "bg-primary/5"
                        )}
                        onClick={() => markAsRead(notification.id)}
                      >
                        <div className={cn(
                          "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0",
                          notification.type === 'appointment' && "bg-blue-100 text-blue-600",
                          notification.type === 'message' && "bg-green-100 text-green-600",
                          notification.type === 'result' && "bg-purple-100 text-purple-600"
                        )}>
                          <IconComponent className="w-4 h-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-medium text-foreground truncate">
                              {notification.title}
                            </p>
                            {!notification.read && (
                              <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0"></div>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                            {notification.message}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {notification.time}
                          </p>
                        </div>
                      </DropdownMenuItem>
                    );
                  })
                )}
                
                {notifications.length > 0 && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-center py-2">
                      <Button variant="ghost" size="sm" className="w-full text-xs">
                        View All Notifications
                      </Button>
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
          
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center space-x-2">
                <Avatar className="h-9 w-9 cursor-pointer hover:ring-2 hover:ring-primary/20 transition-all">
                  <AvatarImage src="" alt="User profile" />
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    {profile ? getInitials(profile.first_name || '', profile.last_name || '') : user.email?.[0]?.toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="hidden lg:block text-left">
                  <p className="text-sm font-medium">
                    {profile ? `${profile.first_name} ${profile.last_name}` : user.email}
                  </p>
                  {profile && (
                    <Badge variant="secondary" className="text-xs">
                      {profile.role}
                    </Badge>
                  )}
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem asChild>
                  <Link to="/account">Account Settings</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut} className="text-destructive">
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button variant="outline" size="sm" onClick={() => navigate('/auth')} className="flex items-center gap-2">
              <LogIn className="w-4 h-4" />
              Sign In
            </Button>
          )}

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>
      </nav>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-border bg-background/95 backdrop-blur-lg">
          <div className="px-4 py-2 space-y-1">
            {/* First nav item (Home) */}
            {navigation.slice(0, 1).map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  "block py-3 px-4 rounded-lg font-medium transition-all duration-300",
                  isActiveLink(item.href)
                    ? "text-primary bg-primary/10 border-l-4 border-primary"
                    : "text-muted-foreground hover:text-primary hover:bg-primary/5"
                )}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            
            {/* AI Services Expandable Section */}
            <div>
              <button
                onClick={() => setMobileAIMenuOpen(!mobileAIMenuOpen)}
                className={cn(
                  "w-full flex items-center justify-between py-3 px-4 rounded-lg font-medium transition-all duration-300",
                  location.pathname.startsWith('/ai')
                    ? "text-primary bg-primary/10 border-l-4 border-primary"
                    : "text-muted-foreground hover:text-primary hover:bg-primary/5"
                )}
              >
                <span>AI Services</span>
                <ChevronDown className={cn(
                  "w-4 h-4 transition-transform duration-200",
                  mobileAIMenuOpen && "rotate-180"
                )} />
              </button>
              
              {mobileAIMenuOpen && (
                <div className="ml-4 mt-2 space-y-1">
                  {aiServicesMenu.map((service, index) => (
                    <Link
                      key={index}
                      to={service.href}
                      className="flex items-center gap-3 py-2 px-3 rounded-lg hover:bg-accent transition-colors"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${service.gradient} flex items-center justify-center flex-shrink-0`}>
                        <service.icon className="w-4 h-4 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-sm text-foreground">
                          {service.name}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {service.description}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
            
            {/* Rest of navigation items */}
            {navigation.slice(1).map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  "block py-3 px-4 rounded-lg font-medium transition-all duration-300",
                  isActiveLink(item.href)
                    ? "text-primary bg-primary/10 border-l-4 border-primary"
                    : "text-muted-foreground hover:text-primary hover:bg-primary/5"
                )}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
};