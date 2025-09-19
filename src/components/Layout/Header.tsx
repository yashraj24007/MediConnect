import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Bell, Globe, Menu, X, Heart, Stethoscope, Calendar, FileText, MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import { Badge } from "@/components/ui/badge";
import { ThemeToggle } from "@/components/theme-toggle";
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
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, profile, signOut } = useAuth();

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

    if (!user) return commonLinks;

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
        ];
      case 'patient':
        return [
          ...authenticatedLinks,
          { name: "My Appointments", href: "/account" },
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
    <header className="bg-background/95 backdrop-blur-sm border-b border-border sticky top-0 z-50">
      <nav className="container mx-auto px-4 lg:px-6 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link 
          to="/" 
          className="flex items-center space-x-3 hover:opacity-80 transition-all duration-300 transform hover:scale-105 group"
        >
          <div className="relative">
            <Heart className="w-8 h-8 text-pink-500 fill-pink-500/20 group-hover:fill-pink-500/40 transition-all duration-300" />
            <Stethoscope className="w-4 h-4 text-blue-500 absolute -bottom-1 -right-1 group-hover:rotate-12 transition-transform duration-300" />
          </div>
          <span className="text-3xl font-extrabold text-foreground tracking-tight">
            MediConnect
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-8">
          {navigation.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              className={cn(
                "font-semibold transition-colors hover:text-primary-light",
                isActiveLink(item.href) 
                  ? "text-primary-light" 
                  : "text-muted-foreground"
              )}
            >
              {item.name}
            </Link>
          ))}
        </div>

        {/* Right Side Actions */}
        <div className="flex items-center space-x-4">
          <ThemeToggle />
          
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
            <Button variant="outline" size="sm" onClick={() => navigate('/auth')}>
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
            {navigation.map((item) => (
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