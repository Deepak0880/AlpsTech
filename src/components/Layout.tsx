
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import Chatbot from "./Chatbot";
import { useState, useEffect } from "react";
import { useTheme } from "@/contexts/ThemeContext";
import { cn } from "@/lib/utils";
import AnimatedBackground from "./AnimatedBackground";
import FloatingObjects from "./FloatingObjects";

/**
 * Main layout component for the application
 * Manages the page structure and background effects
 */
const Layout = () => {
  const [chatbotOpen, setChatbotOpen] = useState(false);
  const [isChatbotMinimized, setIsChatbotMinimized] = useState(false);
  const { theme, isChanging } = useTheme();
  const [showFloatingObjects, setShowFloatingObjects] = useState(false);

  // Delayed loading of canvas objects for better initial performance
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowFloatingObjects(true);
    }, 1200); // Increased delay for better loading sequence
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={cn(
      "flex flex-col min-h-screen bg-background text-foreground transition-colors duration-500 relative overflow-hidden",
      isChanging && "animate-pulse transition-opacity"
    )}>
      {/* Background layer - visual effects */}
      <div className="absolute inset-0 z-0">
        {/* 2D animated background */}
        <AnimatedBackground />
        
        {/* Floating objects with canvas */}
        {showFloatingObjects && <FloatingObjects />}
      </div>
      
      {/* Content layer - actual page content */}
      <div className="relative z-10 flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-1 container mx-auto px-4 py-8 animate-in fade-in duration-500">
          <Outlet />
        </main>
        <Footer />
      </div>
      
      {/* UI overlay layer - floating UI elements */}
      <div className="relative z-50">
        {/* Chatbot toggle button */}
        <button 
          onClick={() => {
            if (isChatbotMinimized) {
              setIsChatbotMinimized(false);
            } else {
              setChatbotOpen(prev => !prev);
            }
          }}
          className={cn(
            "fixed bottom-6 right-6 p-4 rounded-full bg-brand-blue text-white shadow-lg transition-all duration-300 hover:scale-105",
            chatbotOpen && !isChatbotMinimized ? "rotate-3" : "",
            isChatbotMinimized ? "animate-pulse" : "",
            theme === "dark" && "shadow-lg shadow-blue-500/20"
          )}
          aria-label="Toggle chatbot"
        >
          {chatbotOpen && !isChatbotMinimized ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-x animate-in zoom-in duration-300"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-message-circle animate-in zoom-in duration-300 hover:animate-bounce"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>
          )}
        </button>
        
        {/* Theme transition overlay */}
        <div className={cn(
          "fixed inset-0 pointer-events-none z-[100] bg-background transition-opacity duration-300",
          isChanging ? "opacity-10" : "opacity-0"
        )}></div>
        
        {/* Chatbot component */}
        {chatbotOpen && (
          <Chatbot 
            onClose={() => setChatbotOpen(false)} 
            isMinimized={isChatbotMinimized}
            onMinimize={() => setIsChatbotMinimized(!isChatbotMinimized)}
          />
        )}
      </div>
    </div>
  );
};

export default Layout;
