
import { useState, useEffect } from "react";
import { coursesData } from "@/lib/data";
import { Course } from "@/components/CourseCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

type EnrollmentStatus = "open" | "closed" | "in progress";

const AdminCourses = () => {
  const [courses, setCourses] = useState(coursesData);
  const [filteredCourses, setFilteredCourses] = useState(coursesData);
  const [searchTerm, setSearchTerm] = useState("");
  const [levelFilter, setLevelFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [isLoading, setIsLoading] = useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [currentCourse, setCurrentCourse] = useState<Course | null>(null);
  const [newCourse, setNewCourse] = useState<Omit<Course, "id">>({
    title: "",
    description: "",
    instructor: "",
    duration: "",
    level: "beginner",
    price: 0,
    image: "https://images.unsplash.com/photo-1587620962725-abab7fe55159?q=80&w=2831&auto=format&fit=crop",
    enrollmentStatus: "open",
  });

  useEffect(() => {
    // Simulate API call delay
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    // Apply filters whenever search term, level filter, or status filter changes
    const filtered = courses.filter((course) => {
      const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           course.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           course.instructor.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesLevel = levelFilter === "all" || course.level === levelFilter;
      
      const matchesStatus = statusFilter === "all" || course.enrollmentStatus === statusFilter;
      
      return matchesSearch && matchesLevel && matchesStatus;
    });
    
    setFilteredCourses(filtered);
  }, [searchTerm, levelFilter, statusFilter, courses]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (isEditDialogOpen && currentCourse) {
      setCurrentCourse({
        ...currentCourse,
        [name]: name === "price" ? parseFloat(value) || 0 : value,
      });
    } else {
      setNewCourse({
        ...newCourse,
        [name]: name === "price" ? parseFloat(value) || 0 : value,
      });
    }
  };

  const handleSelectChange = (name: string, value: string) => {
    if (isEditDialogOpen && currentCourse) {
      if (name === "level") {
        const levelValue = value as "beginner" | "intermediate" | "advanced";
        setCurrentCourse({
          ...currentCourse,
          level: levelValue,
        });
      } else if (name === "enrollmentStatus") {
        const statusValue = value as EnrollmentStatus;
        setCurrentCourse({
          ...currentCourse,
          enrollmentStatus: statusValue,
        });
      }
    } else {
      if (name === "level") {
        // Ensure level is one of the allowed values
        const levelValue = value as "beginner" | "intermediate" | "advanced";
        setNewCourse({
          ...newCourse,
          level: levelValue,
        });
      } else if (name === "enrollmentStatus") {
        // Ensure enrollmentStatus is one of the allowed values
        const statusValue = value as EnrollmentStatus;
        setNewCourse({
          ...newCourse,
          enrollmentStatus: statusValue,
        });
      }
    }
  };

  const handleAddCourse = () => {
    const newId = (Math.max(...courses.map(c => parseInt(c.id))) + 1).toString();
    
    const courseToAdd: Course = {
      ...newCourse,
      id: newId,
    };
    
    setCourses([...courses, courseToAdd]);
    setIsAddDialogOpen(false);
    toast.success("Course added successfully!");
    
    // Reset form
    setNewCourse({
      title: "",
      description: "",
      instructor: "",
      duration: "",
      level: "beginner",
      price: 0,
      image: "https://images.unsplash.com/photo-1587620962725-abab7fe55159?q=80&w=2831&auto=format&fit=crop",
      enrollmentStatus: "open",
    });
  };

  const handleEditCourse = (course: Course) => {
    setCurrentCourse(course);
    setIsEditDialogOpen(true);
  };

  const handleUpdateCourse = () => {
    if (!currentCourse) return;
    
    setCourses(courses.map(course => 
      course.id === currentCourse.id ? currentCourse : course
    ));
    
    setIsEditDialogOpen(false);
    setCurrentCourse(null);
    toast.success("Course updated successfully!");
  };

  const handleDeleteCourse = (id: string) => {
    setCourses(courses.filter(course => course.id !== id));
    toast.success("Course deleted successfully!");
  };

  const handleUpdateStatus = (id: string, status: EnrollmentStatus) => {
    setCourses(courses.map(course => 
      course.id === id ? { ...course, enrollmentStatus: status } : course
    ));
    toast.success(`Course status updated to ${status}`);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-brand-blue mb-2"></div>
          <p>Loading courses...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Manage Courses</h1>
          <p className="text-gray-600">Add, edit and manage course offerings</p>
        </div>
        
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
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
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              Add New Course
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add New Course</DialogTitle>
              <DialogDescription>
                Fill in the details to create a new course
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="title">Course Title</Label>
                <Input
                  id="title"
                  name="title"
                  value={newCourse.title}
                  onChange={handleInputChange}
                  placeholder="e.g. Web Development Fundamentals"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="instructor">Instructor</Label>
                <Input
                  id="instructor"
                  name="instructor"
                  value={newCourse.instructor}
                  onChange={handleInputChange}
                  placeholder="e.g. John Smith"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="duration">Duration</Label>
                <Input
                  id="duration"
                  name="duration"
                  value={newCourse.duration}
                  onChange={handleInputChange}
                  placeholder="e.g. 8 weeks"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="price">Price (₹)</Label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  value={newCourse.price.toString()}
                  onChange={handleInputChange}
                  placeholder="e.g. 29999"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="level">Level</Label>
                <Select
                  value={newCourse.level}
                  onValueChange={(value) => handleSelectChange("level", value)}
                >
                  <SelectTrigger id="level">
                    <SelectValue placeholder="Select level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="beginner">Beginner</SelectItem>
                    <SelectItem value="intermediate">Intermediate</SelectItem>
                    <SelectItem value="advanced">Advanced</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="enrollmentStatus">Enrollment Status</Label>
                <Select
                  value={newCourse.enrollmentStatus}
                  onValueChange={(value) => handleSelectChange("enrollmentStatus", value)}
                >
                  <SelectTrigger id="enrollmentStatus">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="open">Open</SelectItem>
                    <SelectItem value="closed">Closed</SelectItem>
                    <SelectItem value="in progress">In Progress</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="image">Image URL</Label>
                <Input
                  id="image"
                  name="image"
                  value={newCourse.image}
                  onChange={handleInputChange}
                  placeholder="https://example.com/image.jpg"
                />
              </div>
              
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={newCourse.description}
                  onChange={handleInputChange}
                  placeholder="Provide a detailed description of the course"
                  rows={4}
                  required
                />
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddCourse} disabled={!newCourse.title || !newCourse.description}>
                Add Course
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit Course Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Edit Course</DialogTitle>
              <DialogDescription>
                Update the details of this course
              </DialogDescription>
            </DialogHeader>
            
            {currentCourse && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-title">Course Title</Label>
                  <Input
                    id="edit-title"
                    name="title"
                    value={currentCourse.title}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="edit-instructor">Instructor</Label>
                  <Input
                    id="edit-instructor"
                    name="instructor"
                    value={currentCourse.instructor}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="edit-duration">Duration</Label>
                  <Input
                    id="edit-duration"
                    name="duration"
                    value={currentCourse.duration}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="edit-price">Price (₹)</Label>
                  <Input
                    id="edit-price"
                    name="price"
                    type="number"
                    value={currentCourse.price.toString()}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="edit-level">Level</Label>
                  <Select
                    value={currentCourse.level}
                    onValueChange={(value) => handleSelectChange("level", value)}
                  >
                    <SelectTrigger id="edit-level">
                      <SelectValue placeholder="Select level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="beginner">Beginner</SelectItem>
                      <SelectItem value="intermediate">Intermediate</SelectItem>
                      <SelectItem value="advanced">Advanced</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="edit-enrollmentStatus">Enrollment Status</Label>
                  <Select
                    value={currentCourse.enrollmentStatus}
                    onValueChange={(value) => handleSelectChange("enrollmentStatus", value)}
                  >
                    <SelectTrigger id="edit-enrollmentStatus">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="open">Open</SelectItem>
                      <SelectItem value="closed">Closed</SelectItem>
                      <SelectItem value="in progress">In Progress</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="edit-image">Image URL</Label>
                  <Input
                    id="edit-image"
                    name="image"
                    value={currentCourse.image}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="edit-description">Description</Label>
                  <Textarea
                    id="edit-description"
                    name="description"
                    value={currentCourse.description}
                    onChange={handleInputChange}
                    rows={4}
                    required
                  />
                </div>
              </div>
            )}
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleUpdateCourse} disabled={!currentCourse?.title || !currentCourse?.description}>
                Update Course
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      {/* Filters */}
      <Card className="mb-8">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="search-courses">Search</Label>
              <Input
                id="search-courses"
                type="text"
                placeholder="Search courses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="level-filter">Filter by Level</Label>
              <Select value={levelFilter} onValueChange={setLevelFilter}>
                <SelectTrigger id="level-filter" className="mt-1">
                  <SelectValue placeholder="All Levels" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Levels</SelectItem>
                  <SelectItem value="beginner">Beginner</SelectItem>
                  <SelectItem value="intermediate">Intermediate</SelectItem>
                  <SelectItem value="advanced">Advanced</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="status-filter">Filter by Status</Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger id="status-filter" className="mt-1">
                  <SelectValue placeholder="All Statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="open">Open</SelectItem>
                  <SelectItem value="closed">Closed</SelectItem>
                  <SelectItem value="in progress">In Progress</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
        <CardFooter className="bg-gray-50 px-6 py-3 border-t">
          <div className="text-sm text-gray-600">
            Showing {filteredCourses.length} of {courses.length} courses
          </div>
        </CardFooter>
      </Card>
      
      {/* Courses table */}
      <div className="rounded-lg border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Course
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Instructor
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Level
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredCourses.map((course) => (
                <tr key={course.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <img
                          className="h-10 w-10 rounded-md object-cover"
                          src={course.image}
                          alt={course.title}
                        />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {course.title}
                        </div>
                        <div className="text-sm text-gray-500">
                          Duration: {course.duration}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{course.instructor}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Badge
                      variant="outline"
                      className={
                        course.level === "beginner"
                          ? "bg-green-100 text-green-800"
                          : course.level === "intermediate"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-purple-100 text-purple-800"
                      }
                    >
                      {course.level.charAt(0).toUpperCase() + course.level.slice(1)}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">₹{course.price.toLocaleString('en-IN')}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Select
                      value={course.enrollmentStatus}
                      onValueChange={(value) => handleUpdateStatus(course.id, value as any)}
                    >
                      <SelectTrigger className="h-8 w-28">
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="open">Open</SelectItem>
                        <SelectItem value="closed">Closed</SelectItem>
                        <SelectItem value="in progress">In Progress</SelectItem>
                      </SelectContent>
                    </Select>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-blue-600 hover:text-blue-800"
                      onClick={() => handleEditCourse(course)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-red-600 hover:text-red-800 ml-2"
                      onClick={() => handleDeleteCourse(course.id)}
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {filteredCourses.length === 0 && (
          <div className="py-8 text-center">
            <p className="text-gray-500">No courses found. Try adjusting your filters.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminCourses;
