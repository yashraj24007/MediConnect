import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Bell, Globe, Menu, X, Heart, Stethoscope } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import { Badge } from "@/components/ui/badge";
import { ThemeToggle } from "@/components/theme-toggle";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
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
          { name: "My Appointments", href: "/patient-info" },
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
          
          <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all duration-300">
            <Bell className="w-5 h-5" />
          </Button>
          
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