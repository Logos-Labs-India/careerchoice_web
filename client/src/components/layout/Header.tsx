import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { User, LogOut, ChevronDown } from "lucide-react";

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [location] = useLocation();
  const { user, logoutMutation } = useAuth();

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const isActive = (path: string) => {
    return location === path;
  };

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  // Generate avatar initials from user's name
  const getInitials = () => {
    if (user?.firstName && user?.lastName) {
      return `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`.toUpperCase();
    }
    return "U";
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <svg className="h-8 w-8 text-primary" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
          </svg>
          <Link href="/">
            <span className="text-xl font-bold font-sans text-gray-900 cursor-pointer">
              Career<span className="text-primary">Insight</span>
            </span>
          </Link>
        </div>
        
        <nav className="hidden md:flex items-center space-x-8">
          <Link href="/#features">
            <span className="text-gray-600 hover:text-primary transition-colors font-medium cursor-pointer">
              Features
            </span>
          </Link>
          <Link href="/#how-it-works">
            <span className="text-gray-600 hover:text-primary transition-colors font-medium cursor-pointer">
              How It Works
            </span>
          </Link>
          {user ? (
            <Link href="/dashboard">
              <span className={`text-gray-600 hover:text-primary transition-colors font-medium cursor-pointer ${isActive('/dashboard') ? 'text-primary' : ''}`}>
                Dashboard
              </span>
            </Link>
          ) : (
            <Link href="/dashboard">
              <span className={`text-gray-600 hover:text-primary transition-colors font-medium cursor-pointer ${isActive('/dashboard') ? 'text-primary' : ''}`}>
                Sample Results
              </span>
            </Link>
          )}
          {user && !user.assessmentComplete && (
            <Link href="/assessment">
              <span className="text-gray-600 hover:text-primary transition-colors font-medium cursor-pointer">
                Take the Test
              </span>
            </Link>
          )}
        </nav>
        
        {/* Auth Buttons */}
        <div className="hidden md:flex items-center space-x-4">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user.profilePicture || undefined} alt={`${user.firstName} ${user.lastName}`} />
                    <AvatarFallback>{getInitials()}</AvatarFallback>
                  </Avatar>
                  <span className="font-medium">{user.firstName}</span>
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <Link href="/dashboard">
                  <DropdownMenuItem className="cursor-pointer">
                    <User className="mr-2 h-4 w-4" />
                    <span>Dashboard</span>
                  </DropdownMenuItem>
                </Link>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Link href="/auth">
                <Button variant="ghost" className="text-gray-700">Log in</Button>
              </Link>
              <Link href="/auth?tab=signup">
                <Button>Sign up</Button>
              </Link>
            </>
          )}
        </div>
        
        <div className="md:hidden">
          <button 
            onClick={toggleMobileMenu}
            className="text-gray-600 hover:text-primary focus:outline-none"
            aria-label="Toggle mobile menu"
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
            </svg>
          </button>
        </div>
      </div>
      
      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white py-2 shadow-inner">
          <div className="container mx-auto px-4 flex flex-col space-y-2">
            <Link href="/#features">
              <span className="block py-2 text-gray-600 hover:text-primary cursor-pointer" onClick={() => setMobileMenuOpen(false)}>
                Features
              </span>
            </Link>
            <Link href="/#how-it-works">
              <span className="block py-2 text-gray-600 hover:text-primary cursor-pointer" onClick={() => setMobileMenuOpen(false)}>
                How It Works
              </span>
            </Link>
            {user ? (
              <Link href="/dashboard">
                <span className={`block py-2 hover:text-primary cursor-pointer ${isActive('/dashboard') ? 'text-primary' : 'text-gray-600'}`} onClick={() => setMobileMenuOpen(false)}>
                  Dashboard
                </span>
              </Link>
            ) : (
              <Link href="/dashboard">
                <span className={`block py-2 hover:text-primary cursor-pointer ${isActive('/dashboard') ? 'text-primary' : 'text-gray-600'}`} onClick={() => setMobileMenuOpen(false)}>
                  Sample Results
                </span>
              </Link>
            )}
            {user && !user.assessmentComplete && (
              <Link href="/assessment">
                <span className="block py-2 text-gray-600 hover:text-primary cursor-pointer" onClick={() => setMobileMenuOpen(false)}>
                  Take the Test
                </span>
              </Link>
            )}
            
            {/* Mobile Auth Links */}
            {user ? (
              <>
                <div className="border-t my-2"></div>
                <div className="flex items-center space-x-3 py-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user.profilePicture || undefined} alt={`${user.firstName} ${user.lastName}`} />
                    <AvatarFallback>{getInitials()}</AvatarFallback>
                  </Avatar>
                  <span className="font-medium">{user.firstName} {user.lastName}</span>
                </div>
                <button 
                  onClick={handleLogout}
                  className="flex items-center py-2 text-gray-600 hover:text-primary w-full text-left"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </button>
              </>
            ) : (
              <>
                <div className="border-t my-2"></div>
                <Link href="/auth">
                  <span className="block py-2 text-gray-600 hover:text-primary cursor-pointer" onClick={() => setMobileMenuOpen(false)}>
                    Log in
                  </span>
                </Link>
                <Link href="/auth?tab=signup">
                  <span className="block py-2 text-primary font-medium cursor-pointer" onClick={() => setMobileMenuOpen(false)}>
                    Sign up
                  </span>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
