
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { getCourseById } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

const CourseDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [course, setCourse] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { user, isEnrolled, enrollInCourse } = useAuth();

  useEffect(() => {
    // Simulate API call delay
    const timer = setTimeout(() => {
      if (id) {
        const courseData = getCourseById(id);
        setCourse(courseData);
      }
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [id]);

  const handleEnroll = () => {
    if (!user) {
      toast.error("Please log in to enroll in this course");
      return;
    }
    
    if (course.enrollmentStatus === "closed") {
      toast.error("This course is currently closed for enrollment");
      return;
    }
    
    enrollInCourse(course.id);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-brand-blue mb-2"></div>
            <p>Loading course details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-3xl mx-auto">
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <h2 className="text-2xl font-bold mb-2">Course Not Found</h2>
              <p className="text-gray-600 mb-4">The course you're looking for doesn't exist or has been removed.</p>
              <Button asChild>
                <Link to="/courses">Browse Courses</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const isUserEnrolled = user && isEnrolled(course.id);
  const canEnroll = !isUserEnrolled && course.enrollmentStatus !== "closed";

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Course Image and Enrollment */}
        <div className="lg:col-span-1">
          <Card className="sticky top-24">
            <div className="aspect-video w-full overflow-hidden rounded-t-lg">
              <img 
                src={course.image} 
                alt={course.title} 
                className="w-full h-full object-cover"
              />
            </div>
            <CardContent className="pt-6">
              <div className="space-y-2 mb-4">
                <Badge variant={course.enrollmentStatus === "open" ? "default" : "outline"} className="mb-2">
                  {course.enrollmentStatus === "open" ? "Open for Enrollment" : 
                   course.enrollmentStatus === "in progress" ? "In Progress" : "Closed"}
                </Badge>
                <p className="flex items-center text-sm">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                  Duration: {course.duration}
                </p>
                <p className="flex items-center text-sm">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2"><path d="M12 5v8.5l3.5 3.5"/><circle cx="12" cy="12" r="10"/></svg>
                  Level: {course.level.charAt(0).toUpperCase() + course.level.slice(1)}
                </p>
                <p className="flex items-center text-sm">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2"><circle cx="12" cy="8" r="4"/><path d="M20 19v-1a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v1"/></svg>
                  Instructor: {course.instructor}
                </p>
              </div>
              <div className="text-2xl font-bold mb-4">₹{course.price.toLocaleString('en-IN')}</div>
            </CardContent>
            <CardFooter>
              {isUserEnrolled ? (
                <div className="space-y-2 w-full">
                  <p className="text-center text-sm text-green-600 mb-2">
                    You are enrolled in this course
                  </p>
                  <Button className="w-full">Continue Learning</Button>
                </div>
              ) : (
                <Button 
                  className="w-full" 
                  disabled={!canEnroll}
                  onClick={handleEnroll}
                >
                  {course.enrollmentStatus === "closed" ? "Enrollment Closed" : "Enroll Now"}
                </Button>
              )}
            </CardFooter>
          </Card>
        </div>

        {/* Course Details */}
        <div className="lg:col-span-2">
          <div className="mb-6">
            <Link to="/courses" className="text-brand-blue hover:underline inline-flex items-center mb-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1"><path d="m15 18-6-6 6-6"/></svg>
              Back to Courses
            </Link>
            <h1 className="text-3xl font-bold mb-2">{course.title}</h1>
            <p className="text-gray-600">{course.description}</p>
          </div>

          <Tabs defaultValue="content" className="mb-8">
            <TabsList className="mb-4">
              <TabsTrigger value="content">Course Content</TabsTrigger>
              <TabsTrigger value="instructor">Instructor</TabsTrigger>
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
            </TabsList>
            
            <TabsContent value="content" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>What You'll Learn</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    <li className="flex items-start">
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-500 mr-2 mt-1"><polyline points="20 6 9 17 4 12"/></svg>
                      <span>Understand core concepts and principles</span>
                    </li>
                    <li className="flex items-start">
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-500 mr-2 mt-1"><polyline points="20 6 9 17 4 12"/></svg>
                      <span>Build real-world projects step by step</span>
                    </li>
                    <li className="flex items-start">
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-500 mr-2 mt-1"><polyline points="20 6 9 17 4 12"/></svg>
                      <span>Master essential techniques and tools</span>
                    </li>
                    <li className="flex items-start">
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-500 mr-2 mt-1"><polyline points="20 6 9 17 4 12"/></svg>
                      <span>Apply knowledge in practical scenarios</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Course Modules</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[1, 2, 3, 4].map((module) => (
                      <div key={module} className="border rounded-lg p-4">
                        <div className="flex justify-between items-center mb-2">
                          <h3 className="font-medium">Module {module}: Key Concepts</h3>
                          <Badge variant="outline">4 Lessons</Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">Learn the fundamental building blocks and essential theory.</p>
                        {isUserEnrolled ? (
                          <Button variant="outline" size="sm">View Lessons</Button>
                        ) : (
                          <p className="text-sm text-gray-500">Enroll to access lessons</p>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="instructor">
              <Card>
                <CardHeader>
                  <CardTitle>About the Instructor</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                    </div>
                    <div>
                      <h3 className="text-lg font-medium">{course.instructor}</h3>
                      <p className="text-gray-600">Expert in {course.title.split(" ")[0]}</p>
                    </div>
                  </div>
                  <p className="mb-4">With over 10 years of industry experience, {course.instructor} has helped thousands of students master complex concepts through clear, practical instruction.</p>
                  <div className="flex gap-2">
                    <Badge variant="outline" className="bg-gray-100">15+ Courses</Badge>
                    <Badge variant="outline" className="bg-gray-100">4.8 Rating</Badge>
                    <Badge variant="outline" className="bg-gray-100">10k+ Students</Badge>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="reviews">
              <Card>
                <CardHeader>
                  <CardTitle>Student Reviews</CardTitle>
                  <CardDescription>What our students are saying about this course</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="border-b pb-4 last:border-b-0 last:pb-0">
                        <div className="flex justify-between mb-2">
                          <div className="flex items-center">
                            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center shrink-0 mr-2">
                              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                            </div>
                            <span className="font-medium">Student {i + 1}</span>
                          </div>
                          <div className="flex">
                            {[...Array(5)].map((_, starIndex) => (
                              <svg key={starIndex} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill={starIndex < 4 + i % 2 ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-yellow-500"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                            ))}
                          </div>
                        </div>
                        <p className="text-sm text-gray-700">
                          {i === 0 ? "This course exceeded my expectations. The content is well-structured and the instructor explains complex topics in an easy-to-understand way." :
                           i === 1 ? "Very practical course with lots of hands-on examples. I was able to apply what I learned immediately in my projects." :
                           "Great value for money. Comprehensive coverage of the subject matter with good pacing."}
                        </p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
          
          {/* Call to Action */}
          {!isUserEnrolled && (
            <Card className="bg-brand-blue text-white">
              <CardContent className="pt-6">
                <div className="text-center py-4">
                  <h2 className="text-2xl font-bold mb-2">Ready to start learning?</h2>
                  <p className="mb-4">Join thousands of students already enrolled in this course.</p>
                  <Button 
                    variant="outline" 
                    className="bg-white text-brand-blue hover:bg-gray-100"
                    disabled={!canEnroll}
                    onClick={handleEnroll}
                  >
                    {course.enrollmentStatus === "closed" ? "Enrollment Closed" : "Enroll Now"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default CourseDetails;
