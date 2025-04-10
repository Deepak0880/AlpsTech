import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LoadingBar } from "@/components/ui/loading-bar";
import { coursesData, resultsData } from "@/lib/data";
import { useAuth } from "@/hooks/useAuth";
import { useTheme } from "@/contexts/ThemeContext";
import { cn } from "@/lib/utils";

const AdminDashboard = () => {
  const { users } = useAuth();
  const { theme } = useTheme();
  const [stats, setStats] = useState({
    totalCourses: 0,
    totalStudents: 0,
    totalResults: 0,
    openEnrollments: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);

  const getGradeBadgeStyle = (grade: string) => {
    if (theme === "dark") {
      switch (grade) {
        case "A":
        case "A+":
          return "bg-green-700 text-white font-medium";
        case "B":
        case "B+":
          return "bg-blue-700 text-white font-medium";
        case "C":
        case "C+":
          return "bg-yellow-700 text-white font-medium";
        case "D":
          return "bg-orange-700 text-white font-medium";
        case "F":
          return "bg-red-700 text-white font-medium";
        default:
          return "bg-gray-700 text-white font-medium";
      }
    } else {
      switch (grade) {
        case "A":
        case "A+":
          return "bg-green-100 text-green-800";
        case "B":
        case "B+":
          return "bg-blue-100 text-blue-800";
        case "C":
        case "C+":
          return "bg-yellow-100 text-yellow-800";
        case "D":
          return "bg-orange-100 text-orange-800";
        case "F":
          return "bg-red-100 text-red-800";
        default:
          return "bg-gray-100 text-gray-800";
      }
    }
  };

  useEffect(() => {
    const loadingInterval = setInterval(() => {
      setLoadingProgress(prev => {
        const newProgress = prev + 20;
        return newProgress >= 100 ? 100 : newProgress;
      });
    }, 250);
    
    const studentCount = users.filter(user => user.role === "student").length;

    setTimeout(() => {
      setStats({
        totalCourses: coursesData.length,
        totalStudents: studentCount,
        totalResults: resultsData.length,
        openEnrollments: coursesData.filter(c => c.enrollmentStatus === "open").length,
      });
      setIsLoading(false);
      clearInterval(loadingInterval);
    }, 800);
    
    return () => clearInterval(loadingInterval);
  }, [users]);

  if (isLoading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[400px] gap-4">
        <LoadingBar 
          className="w-64"
          progress={loadingProgress}
          variant="primary"
        />
        <p className="text-muted-foreground">Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <p className="text-gray-600 dark:text-gray-300">Overview of the computer center's statistics</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Total Courses</CardTitle>
            <CardDescription>
              Number of courses offered
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center h-24">
              <div className="text-4xl font-bold text-brand-blue">
                {stats.totalCourses}
              </div>
            </div>
          </CardContent>
          <CardFooter className="pt-0">
            <Button asChild variant="ghost" className="w-full">
              <Link to="/admin/courses">Manage Courses</Link>
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Total Students</CardTitle>
            <CardDescription>
              Registered students
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center h-24">
              <div className="text-4xl font-bold text-brand-blue">
                {stats.totalStudents}
              </div>
            </div>
          </CardContent>
          <CardFooter className="pt-0">
            <Button asChild variant="ghost" className="w-full">
              <Link to="/admin/students">View Students</Link>
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Total Results</CardTitle>
            <CardDescription>
              Recorded assessment results
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center h-24">
              <div className="text-4xl font-bold text-brand-blue">
                {stats.totalResults}
              </div>
            </div>
          </CardContent>
          <CardFooter className="pt-0">
            <Button asChild variant="ghost" className="w-full">
              <Link to="/admin/results">Manage Results</Link>
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Open Enrollments</CardTitle>
            <CardDescription>
              Courses with open enrollment
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center h-24">
              <div className="text-4xl font-bold text-brand-blue">
                {stats.openEnrollments}
              </div>
            </div>
          </CardContent>
          <CardFooter className="pt-0">
            <Button asChild variant="ghost" className="w-full">
              <Link to="/admin/courses">View Courses</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Recent Enrollments</CardTitle>
            <CardDescription>
              Latest student enrollments
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center justify-between border-b pb-3 last:border-0 last:pb-0">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center shrink-0">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                        <circle cx="12" cy="7" r="4" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium">Student {i + 1}</p>
                      <p className="text-sm text-gray-600">Enrolled in {coursesData[i % coursesData.length].title}</p>
                    </div>
                  </div>
                  <span className="text-sm text-gray-500">
                    {new Date(Date.now() - i * 86400000).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter>
            <Button asChild variant="outline" className="w-full">
              <Link to="/admin/students">View All Enrollments</Link>
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Latest Results</CardTitle>
            <CardDescription>
              Recently uploaded results
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {resultsData.slice(0, 5).map((result, i) => (
                <div key={i} className="flex items-center justify-between border-b pb-3 last:border-0 last:pb-0">
                  <div>
                    <p className="font-medium">{result.courseName}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Student ID: {Math.floor(Math.random() * 10000).toString().padStart(4, '0')} • Score: {result.score}/{result.maxScore}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className={cn("inline-block px-2 py-1 text-xs font-semibold rounded-full", getGradeBadgeStyle(result.grade))}>
                      Grade: {result.grade}
                    </span>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{result.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter>
            <Button asChild variant="outline" className="w-full">
              <Link to="/admin/results">View All Results</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
