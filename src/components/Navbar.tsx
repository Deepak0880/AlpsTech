
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import ThemeToggle from "@/components/ThemeToggle";
import { LoadingBar } from "./ui/loading-bar";
import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Menu } from "lucide-react";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isNavigating, setIsNavigating] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const handleNavigation = (path: string) => {
    setIsNavigating(true);
    setIsMobileMenuOpen(false); // Close mobile menu when navigating
    setTimeout(() => {
      navigate(path);
      setIsNavigating(false);
    }, 400);
  };
  
  const handleLogout = () => {
    setIsNavigating(true);
    setIsMobileMenuOpen(false); // Close mobile menu when logging out
    setTimeout(() => {
      logout();
      setIsNavigating(false);
    }, 400);
  };

  // Navigation items to avoid repetition
  const navItems = [
    { label: "Home", path: "/", role: "all" },
    { label: "Courses", path: "/courses", role: "all" },
    { label: "Dashboard", path: "/dashboard", role: "student" },
    { label: "Results", path: "/results", role: "student" },
    { label: "Admin", path: "/admin", role: "admin" },
  ];

  const renderNavItems = (isMobile = false) => {
    return navItems.map((item) => {
      if (item.role === "all" || (user && user.role === item.role)) {
        return (
          <button
            key={item.path}
            onClick={() => handleNavigation(item.path)}
            className={
              isMobile
                ? "w-full text-left px-4 py-3 hover:bg-accent text-foreground transition-colors duration-300"
                : "text-muted-foreground hover:text-foreground transition-colors duration-300"
            }
          >
            {item.label}
          </button>
        );
      }
      return null;
    });
  };

  return (
    <nav className="bg-background border-border shadow-sm border-b transition-colors duration-300 relative">
      {isNavigating && (
        <LoadingBar indeterminate className="absolute top-0 left-0 right-0" height="h-0.5" />
      )}
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-brand-blue transition-colors duration-300"
              >
                <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                <path d="M6 12v5c3 3 9 3 12 0v-5" />
              </svg>
              <span className="ml-2 text-xl font-bold text-foreground transition-colors duration-300">AlpsTech</span>
            </Link>
          </div>
          
          <div className="hidden md:flex items-center space-x-6">
            {renderNavItems()}
            
            {user ? (
              <Button variant="ghost" onClick={handleLogout}>Logout</Button>
            ) : (
              <Button asChild variant="default" className="animate-in slide-in-from-right border border-transparent">
                <Link to="/login">Login</Link>
              </Button>
            )}
            <ThemeToggle />
          </div>
          
          <div className="md:hidden flex items-center gap-2">
            <ThemeToggle />
            
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[250px] sm:w-[300px] pt-10">
                <div className="flex flex-col gap-4 py-4">
                  {renderNavItems(true)}
                  
                  {user ? (
                    <Button 
                      variant="ghost" 
                      onClick={handleLogout}
                      className="w-full justify-start px-4"
                    >
                      Logout
                    </Button>
                  ) : (
                    <Button 
                      asChild 
                      variant="default" 
                      className="w-full justify-center"
                    >
                      <Link to="/login">Login</Link>
                    </Button>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
