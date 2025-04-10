import React, { createContext, useContext, useEffect, useState } from "react";

type Theme = "light" | "dark";

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  isChanging: boolean;
}

interface ThemeProviderProps {
  children: React.ReactNode;
  defaultTheme?: Theme;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children, defaultTheme }) => {
  // Get saved theme from localStorage or prefer-color-scheme or defaultTheme
  const [theme, setTheme] = useState<Theme>(() => {
    // For SSR/initial render before DOM is available
    if (typeof window === "undefined") return defaultTheme || "light";
    
    const savedTheme = localStorage.getItem("theme") as Theme | null;
    if (savedTheme) return savedTheme;
    
    if (defaultTheme) return defaultTheme;
    
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  });
  
  // Track animation state
  const [isChanging, setIsChanging] = useState(false);

  // Update document class when theme changes
  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  // Set up system theme change listener
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    
    const handleChange = (e: MediaQueryListEvent) => {
      if (!localStorage.getItem("theme")) {
        setTheme(e.matches ? "dark" : "light");
      }
    };
    
    mediaQuery.addEventListener("change", handleChange);
    
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  const toggleTheme = () => {
    setIsChanging(true);
    setTimeout(() => {
      setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
      setTimeout(() => {
        setIsChanging(false);
      }, 300);
    }, 150);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, isChanging }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
