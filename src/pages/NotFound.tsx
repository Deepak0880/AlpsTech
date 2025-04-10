
import { useLocation, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Frown, Search, ArrowUp } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";

const NotFound = () => {
  const location = useLocation();
  const { theme } = useTheme();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
    
    // Trigger animations after component mounts
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);
    
    return () => clearTimeout(timer);
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden">
      {/* Animated background particles */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute w-full h-full opacity-20">
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className={cn(
                "absolute rounded-full bg-primary/30 backdrop-blur-sm",
                theme === "dark" ? "bg-blue-500/30" : "bg-blue-400/20"
              )}
              style={{
                width: `${Math.random() * 10 + 5}rem`,
                height: `${Math.random() * 10 + 5}rem`,
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                animation: `float ${Math.random() * 10 + 10}s ease-in-out infinite`,
                animationDelay: `${Math.random() * 5}s`,
                opacity: Math.random() * 0.5 + 0.1
              }}
            />
          ))}
        </div>
      </div>
      
      <div 
        className={cn(
          "text-center px-6 py-12 rounded-xl backdrop-blur-sm transition-all duration-1000 transform",
          theme === "dark" 
            ? "bg-slate-900/50 shadow-lg shadow-blue-900/10 border border-blue-900/20" 
            : "bg-white/50 shadow-xl border border-slate-200/50",
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
        )}
      >
        {/* Error icon with animation */}
        <div className="mx-auto w-24 h-24 mb-8 relative">
          <div className="absolute inset-0 animate-pulse-glow">
            <Search 
              size={96} 
              className={cn(
                "stroke-1", 
                theme === "dark" ? "text-blue-400" : "text-blue-600"
              )} 
            />
          </div>
          <Frown 
            size={48} 
            className={cn(
              "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transition-transform duration-500 animation-delay-300",
              theme === "dark" ? "text-blue-300" : "text-blue-500",
              isVisible ? "scale-100" : "scale-0"
            )} 
          />
        </div>
        
        {/* Error message with staggered animations */}
        <h1 
          className={cn(
            "text-6xl font-bold mb-2 transition-all duration-700 transform",
            theme === "dark" ? "text-blue-300" : "text-blue-600",
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          )}
        >
          404
        </h1>
        
        <p 
          className={cn(
            "text-xl mb-6 transition-all duration-700 delay-100 transform",
            theme === "dark" ? "text-slate-300" : "text-slate-600",
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          )}
        >
          Oops! This page has wandered off
        </p>
        
        <p 
          className={cn(
            "mb-8 max-w-md mx-auto transition-all duration-700 delay-200 transform",
            theme === "dark" ? "text-slate-400" : "text-slate-500",
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          )}
        >
          We couldn't find <span className="font-mono bg-slate-200/70 dark:bg-slate-700/70 px-2 py-1 rounded">{location.pathname}</span>
        </p>
        
        {/* Return button with hover animation */}
        <Link 
          to="/" 
          className={cn(
            "inline-flex items-center gap-2 px-6 py-3 rounded-full transition-all duration-700 delay-300",
            "hover:scale-105 active:scale-95",
            theme === "dark" 
              ? "bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-500/20" 
              : "bg-blue-500 hover:bg-blue-600 text-white shadow-md",
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          )}
        >
          <ArrowUp size={20} className="rotate-90 mr-2" />
          Return to Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
