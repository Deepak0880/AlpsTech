
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useTheme } from "@/contexts/ThemeContext";
import { Link } from "react-router-dom";

/**
 * Home page component
 */
const Index = () => {
  const { theme } = useTheme();

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] p-4">
      <h1 className="text-4xl font-bold mb-6 animate-in slide-in-from-bottom">
        Welcome to TechEdu Learning Center
      </h1>
      
      <p className="text-xl text-muted-foreground max-w-2xl text-center mb-10 animate-in slide-in-from-bottom">
        Your gateway to mastering computer science and programming skills
        through structured courses and interactive learning.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl animate-in fade-in duration-700">
        {/* Quick access cards */}
        <Card className="hover:shadow-lg transition-all">
          <CardHeader>
            <CardTitle>Explore Courses</CardTitle>
            <CardDescription>
              Browse our comprehensive curriculum
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p>Find the perfect course to match your interests and career goals.</p>
          </CardContent>
          <CardFooter>
            <Button asChild className="w-full">
              <Link to="/courses">View Courses</Link>
            </Button>
          </CardFooter>
        </Card>

        <Card className="hover:shadow-lg transition-all">
          <CardHeader>
            <CardTitle>Student Dashboard</CardTitle>
            <CardDescription>
              Track your learning progress
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p>Access your enrolled courses, assignments, and learning materials.</p>
          </CardContent>
          <CardFooter>
            <Button asChild className="w-full">
              <Link to="/dashboard">Go to Dashboard</Link>
            </Button>
          </CardFooter>
        </Card>

        <Card className="hover:shadow-lg transition-all">
          <CardHeader>
            <CardTitle>View Results</CardTitle>
            <CardDescription>
              Check your assessment outcomes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p>Review your performance and get insights on areas for improvement.</p>
          </CardContent>
          <CardFooter>
            <Button asChild className="w-full">
              <Link to="/results">See Results</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
      
      <div className="mt-16 text-center max-w-2xl p-8 rounded-lg bg-gradient-to-r from-brand-blue/20 to-secondary/20 backdrop-blur-sm border border-brand-blue/10">
        <h2 className="text-2xl font-semibold mb-4">Ready to begin your learning journey?</h2>
        <p className="mb-8">Join thousands of students who have transformed their careers through our expert-led courses.</p>
        
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Button 
            size="lg" 
            asChild 
            className={theme === "dark" ? "bg-brand-blue hover:bg-blue-700" : ""}
          >
            <Link to="/login">Sign In</Link>
          </Button>
          
          <Button
            variant="outline" 
            size="lg"
            asChild
            className={`
              border-2 group relative overflow-hidden
              ${theme === "dark" 
                ? "border-brand-blue hover:bg-brand-blue/20 text-white" 
                : "border-brand-blue hover:bg-brand-blue/10 text-brand-blue"
              }
            `}
          >
            <Link to="/login?signup=true">
              <span className="relative z-10">New Student? Sign Up</span>
              <span className={`absolute inset-0 w-full h-full transition-all duration-300 
                ${theme === "dark" 
                  ? "bg-brand-blue/0 group-hover:bg-brand-blue/20" 
                  : "bg-brand-blue/0 group-hover:bg-brand-blue/10"
                } opacity-0 group-hover:opacity-100`}
              ></span>
            </Link>
          </Button>
        </div>
        
        <p className="mt-6 text-sm text-muted-foreground">
          Get access to all our beginner-friendly courses and learning resources.
        </p>
      </div>
    </div>
  );
};

export default Index;
