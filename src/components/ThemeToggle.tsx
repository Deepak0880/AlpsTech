
import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { Toggle } from "@/components/ui/toggle";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

const ThemeToggle = ({ className }: { className?: string }) => {
  const { theme, toggleTheme, isChanging } = useTheme();
  const [rotation, setRotation] = useState(0);

  // Add 3D rotation effect when theme changes
  useEffect(() => {
    if (!isChanging) return;
    
    setRotation(prev => prev + 180);
    
    const timeout = setTimeout(() => {
      setRotation(0);
    }, 600);
    
    return () => clearTimeout(timeout);
  }, [isChanging]);

  return (
    <Toggle
      pressed={theme === "dark"}
      onPressedChange={toggleTheme}
      aria-label="Toggle theme"
      className={cn(
        "relative transition-all duration-300 hover:scale-110 overflow-hidden group",
        theme === "dark" 
          ? "bg-slate-800 text-yellow-300 hover:bg-slate-700 hover:text-yellow-200 shadow-inner shadow-blue-900/30" 
          : "bg-blue-100 text-blue-900 hover:bg-blue-200 hover:text-blue-950 shadow-sm",
        isChanging && "animate-pulse",
        className
      )}
      style={{
        transform: `perspective(400px) rotateY(${rotation}deg)`,
        transformStyle: 'preserve-3d'
      }}
    >
      <div className={cn(
        "relative z-10 transition-all duration-300 w-full h-full flex items-center justify-center",
        isChanging ? "scale-0" : "scale-100"
      )}>
        {theme === "dark" ? (
          <Moon className="h-4 w-4 animate-in zoom-in duration-300 filter drop-shadow-md group-hover:animate-pulse" />
        ) : (
          <Sun className="h-4 w-4 animate-in zoom-in duration-300 filter drop-shadow-sm group-hover:animate-spin group-hover:animation-duration-3000" />
        )}
      </div>
      
      {/* Animated cosmic background for dark mode */}
      <div className={cn(
        "absolute inset-0 w-full h-full transition-opacity duration-700",
        theme === "dark" ? "opacity-100" : "opacity-0"
      )}>
        <div className="absolute top-1 left-1 rounded-full w-1 h-1 bg-indigo-300 opacity-70 animate-pulse"></div>
        <div className="absolute bottom-1 right-1 rounded-full w-0.5 h-0.5 bg-indigo-200 opacity-50 animate-ping animation-duration-3000"></div>
        <div className="absolute top-1 right-2 rounded-full w-0.5 h-0.5 bg-indigo-300 opacity-60 animate-pulse animation-delay-300"></div>
        <div className="absolute bottom-2 left-1 rounded-full w-0.5 h-0.5 bg-purple-300 opacity-60 animate-ping animation-duration-4000"></div>
      </div>
      
      {/* 3D lighting effect */}
      <div className={cn(
        "absolute inset-0 bg-gradient-to-tr from-transparent via-white to-transparent opacity-0 group-hover:opacity-10 transition-opacity duration-300",
        theme === "dark" && "from-transparent via-blue-400 to-transparent group-hover:opacity-20"
      )}></div>
      
      {/* Rising/setting sun animation */}
      <div 
        className={cn(
          "absolute w-3 h-3 rounded-full transition-all duration-500",
          theme === "dark" 
            ? "bg-transparent bottom-[-8px] right-1" 
            : "bg-yellow-300 bottom-[-2px] right-1 animate-pulse shadow-lg shadow-yellow-200"
        )}
      />
    </Toggle>
  );
};

export default ThemeToggle;
