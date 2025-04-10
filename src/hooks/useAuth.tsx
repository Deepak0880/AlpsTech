
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { toast } from "sonner";

interface User {
  id: string;
  name: string;
  email: string;
  role: "student" | "admin";
  enrolledCourses?: string[]; // Course IDs the user is enrolled in
  results?: string[]; // Result IDs associated with the user
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  users: User[]; // Added for admin purposes (would be removed in a real app)
  enrollInCourse: (courseId: string) => void;
  isEnrolled: (courseId: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Initial users data for demo purposes
const initialUsers = [
  {
    id: "1",
    name: "Student User",
    email: "student@example.com",
    password: "password123",
    role: "student" as const,
    enrolledCourses: ["1", "2", "5"], // Pre-enrolled in these courses
    results: ["1", "2", "3"], // Has these results
  },
  {
    id: "2",
    name: "Admin User",
    email: "admin@example.com",
    password: "admin123",
    role: "admin" as const,
    enrolledCourses: [],
    results: [],
  },
];

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // We'll now store the complete users list to update it when new users register
  const [usersWithPasswords, setUsersWithPasswords] = useState(() => {
    const storedUsers = localStorage.getItem("users");
    return storedUsers ? JSON.parse(storedUsers) : initialUsers;
  });

  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Create a version of users without passwords for the public API
  const usersWithoutPasswords = usersWithPasswords.map(({ password, ...userWithoutPassword }) => userWithoutPassword);

  useEffect(() => {
    // Save users to localStorage whenever they change
    localStorage.setItem("users", JSON.stringify(usersWithPasswords));
  }, [usersWithPasswords]);

  useEffect(() => {
    // Check if user is logged in from localStorage
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const foundUser = usersWithPasswords.find(
        (u) => u.email === email && u.password === password
      );

      if (foundUser) {
        const { password, ...userWithoutPassword } = foundUser;
        setUser(userWithoutPassword);
        localStorage.setItem("user", JSON.stringify(userWithoutPassword));
        toast.success(`Welcome back, ${userWithoutPassword.name}!`);
      } else {
        toast.error("Invalid email or password");
      }
    } catch (error) {
      toast.error("Login failed. Please try again.");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (name: string, email: string, password: string) => {
    setIsLoading(true);
    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      // Check if email already exists
      const emailExists = usersWithPasswords.some(user => user.email === email);
      if (emailExists) {
        toast.error("Email already registered. Please use a different email.");
        setIsLoading(false);
        return false;
      }
      
      // Create new user with generated ID
      const newUser = {
        id: (usersWithPasswords.length + 1).toString(),
        name,
        email,
        password,
        role: "student" as const,
        enrolledCourses: [], // New users start with no enrolled courses
        results: [], // New users start with no results
      };
      
      // Update users list
      setUsersWithPasswords(prevUsers => [...prevUsers, newUser]);
      
      // Auto login the new user
      const { password: _, ...userWithoutPassword } = newUser;
      setUser(userWithoutPassword);
      localStorage.setItem("user", JSON.stringify(userWithoutPassword));
      
      toast.success(`Welcome to AlpsTech, ${name}!`);
      return true;
    } catch (error) {
      toast.error("Registration failed. Please try again.");
      console.error(error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    toast.info("You have been logged out");
  };

  // Function to enroll a user in a course
  const enrollInCourse = (courseId: string) => {
    if (!user) return;
    
    // Update the current user state
    const updatedUser = {
      ...user,
      enrolledCourses: [...(user.enrolledCourses || []), courseId],
    };
    
    setUser(updatedUser);
    localStorage.setItem("user", JSON.stringify(updatedUser));
    
    // Update the user in the users list
    const updatedUsers = usersWithPasswords.map(u => {
      if (u.id === user.id) {
        return {
          ...u,
          enrolledCourses: [...(u.enrolledCourses || []), courseId],
        };
      }
      return u;
    });
    
    setUsersWithPasswords(updatedUsers);
    toast.success("You've successfully enrolled in this course!");
  };

  // Function to check if a user is enrolled in a course
  const isEnrolled = (courseId: string) => {
    if (!user || !user.enrolledCourses) return false;
    return user.enrolledCourses.includes(courseId);
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isLoading, 
      login, 
      signup, 
      logout, 
      users: usersWithoutPasswords,
      enrollInCourse,
      isEnrolled
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
