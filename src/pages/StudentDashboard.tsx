
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { LoadingBar } from "@/components/ui/loading-bar";
import { getEnrolledCourses, getStudentResults } from "@/lib/data";
import { useAuth } from "@/hooks/useAuth";

const StudentDashboard = () => {
  const { user } = useAuth();
  const [enrolledCourses, setEnrolledCourses] = useState<any[]>([]);
  const [results, setResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);

  useEffect(() => {
    if (!user) return;
    
    // Simulate API call with progress
    const loadingInterval = setInterval(() => {
      setLoadingProgress(prev => {
        const newProgress = prev + 15;
        return newProgress >= 100 ? 100 : newProgress;
      });
    }, 300);
    
    // Simulate API call delay
    setTimeout(() => {
      setEnrolledCourses(getEnrolledCourses(user.id) as any[]);
      setResults(getStudentResults(user.id));
      setIsLoading(false);
      clearInterval(loadingInterval);
    }, 1000);
    
    return () => clearInterval(loadingInterval);
  }, [user]);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col justify-center items-center min-h-[400px] gap-4">
          <LoadingBar 
            progress={loadingProgress} 
            className="w-64 animate-pulse"
          />
          <p className="text-muted-foreground animate-pulse">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  // Get the latest result
  const latestResult = results.length > 0 ? 
    results.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0] : 
    null;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Student Dashboard</h1>
        <p className="text-gray-600">Welcome back, {user?.name}!</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">My Courses</CardTitle>
            <CardDescription>
              You're enrolled in {enrolledCourses.length} courses
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center h-24">
              <div className="text-4xl font-bold text-brand-blue">
                {enrolledCourses.length}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Latest Result</CardTitle>
            <CardDescription>
              Your most recent test score
            </CardDescription>
          </CardHeader>
          <CardContent>
            {latestResult ? (
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm truncate" title={latestResult.courseName}>
                    {latestResult.courseName}
                  </span>
                  <Badge>{latestResult.grade}</Badge>
                </div>
                <Progress value={(latestResult.score / latestResult.maxScore) * 100} className="h-2" />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>Score: {latestResult.score}/{latestResult.maxScore}</span>
                  <span>{latestResult.date}</span>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-24">
                <span className="text-gray-500">No results yet</span>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Quick Actions</CardTitle>
            <CardDescription>
              Manage your student account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Button asChild variant="outline" className="w-full justify-start">
                <Link to="/courses">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="mr-2"
                  >
                    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
                  </svg>
                  Browse Courses
                </Link>
              </Button>
              <Button asChild variant="outline" className="w-full justify-start">
                <Link to="/results">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="mr-2"
                  >
                    <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                    <polyline points="14 2 14 8 20 8" />
                    <path d="M16 13H8" />
                    <path d="M16 17H8" />
                    <path d="M10 9H8" />
                  </svg>
                  View Results
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Enrolled courses */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">My Courses</h2>
          <Button asChild variant="outline">
            <Link to="/courses">Browse More Courses</Link>
          </Button>
        </div>

        {enrolledCourses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {enrolledCourses.map((course: any) => (
              <Card key={course.id} className="overflow-hidden">
                <div className="aspect-video overflow-hidden">
                  <img 
                    src={course.image} 
                    alt={course.title} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardHeader className="pb-2">
                  <CardTitle className="truncate" title={course.title}>
                    {course.title}
                  </CardTitle>
                  <CardDescription>
                    Enrolled on: {new Date(course.enrollmentDate).toLocaleDateString()}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-1 text-sm">
                        <span>Progress</span>
                        <span>40%</span>
                      </div>
                      <Progress value={40} className="h-2" />
                    </div>
                    <Button asChild className="w-full">
                      <Link to={`/courses/${course.id}`}>Continue Learning</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="p-8">
            <div className="text-center">
              <h3 className="text-lg font-medium mb-2">No courses enrolled yet</h3>
              <p className="text-gray-600 mb-4">
                Explore our course catalog and start your learning journey today.
              </p>
              <Button asChild>
                <Link to="/courses">Browse Courses</Link>
              </Button>
            </div>
          </Card>
        )}
      </div>

      {/* Recent Results */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Recent Results</h2>
          <Button asChild variant="outline">
            <Link to="/results">View All Results</Link>
          </Button>
        </div>

        {results.length > 0 ? (
          <div className="overflow-hidden rounded-lg border">
            <table className="min-w-full divide-y">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Course
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Score
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Grade
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y">
                {results.slice(0, 3).map((result) => (
                  <tr key={result.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{result.courseName}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{result.date}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{result.score}/{result.maxScore}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge>{result.grade}</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <Card className="p-8">
            <div className="text-center">
              <h3 className="text-lg font-medium mb-2">No results available</h3>
              <p className="text-gray-600">
                Results will appear here after completing course assessments.
              </p>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

export default StudentDashboard;
