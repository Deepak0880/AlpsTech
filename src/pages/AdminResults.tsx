
import { useState, useEffect } from "react";
import { resultsData, coursesData } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

interface Result {
  id: string;
  courseId: string;
  courseName: string;
  score: number;
  maxScore: number;
  grade: string;
  date: string;
  feedback?: string;
  studentId?: string;
  studentName?: string;
}

const AdminResults = () => {
  const [results, setResults] = useState<Result[]>([]);
  const [filteredResults, setFilteredResults] = useState<Result[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [courseFilter, setCourseFilter] = useState("all");
  const [gradeFilter, setGradeFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newResult, setNewResult] = useState<Omit<Result, "id">>({
    courseId: "",
    courseName: "",
    score: 0,
    maxScore: 100,
    grade: "C",
    date: new Date().toISOString().split("T")[0],
    feedback: "",
    studentId: "",
    studentName: "",
  });

  // Simulate getting student data
  const studentData = [
    { id: "STU001", name: "John Doe" },
    { id: "STU002", name: "Jane Smith" },
    { id: "STU003", name: "Michael Johnson" },
    { id: "STU004", name: "Emily Williams" },
    { id: "STU005", name: "David Brown" },
  ];

  useEffect(() => {
    // Simulate API call delay
    setTimeout(() => {
      // Enhance the results with student information
      const enhancedResults = resultsData.map(result => ({
        ...result,
        studentId: `STU00${Math.floor(Math.random() * 5) + 1}`,
        studentName: studentData[Math.floor(Math.random() * studentData.length)].name,
      }));
      
      setResults(enhancedResults);
      setFilteredResults(enhancedResults);
      setIsLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    // Apply filters whenever search term, course filter, or grade filter changes
    const filtered = results.filter((result) => {
      const matchesSearch = result.studentName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           result.studentId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           result.courseName.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCourse = courseFilter === "all" || result.courseId === courseFilter;
      
      const matchesGrade = gradeFilter === "all" || result.grade === gradeFilter;
      
      return matchesSearch && matchesCourse && matchesGrade;
    });
    
    setFilteredResults(filtered);
  }, [searchTerm, courseFilter, gradeFilter, results]);

  const handleCourseChange = (courseId: string) => {
    const course = coursesData.find(c => c.id === courseId);
    setNewResult({
      ...newResult,
      courseId,
      courseName: course ? course.title : "",
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewResult({
      ...newResult,
      [name]: ["score", "maxScore"].includes(name) ? parseInt(value) || 0 : value,
    });
  };

  const handleStudentChange = (studentId: string) => {
    const student = studentData.find(s => s.id === studentId);
    setNewResult({
      ...newResult,
      studentId,
      studentName: student ? student.name : "",
    });
  };

  const calculateGrade = (score: number, maxScore: number): string => {
    const percentage = (score / maxScore) * 100;
    
    if (percentage >= 90) return "A+";
    if (percentage >= 80) return "A";
    if (percentage >= 75) return "B+";
    if (percentage >= 70) return "B";
    if (percentage >= 65) return "C+";
    if (percentage >= 60) return "C";
    if (percentage >= 50) return "D";
    return "F";
  };

  const handleScoreChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const score = parseInt(e.target.value) || 0;
    const maxScore = newResult.maxScore;
    const grade = calculateGrade(score, maxScore);
    
    setNewResult({
      ...newResult,
      score,
      grade,
    });
  };

  const handleAddResult = () => {
    const newId = (Math.max(...results.map(r => parseInt(r.id))) + 1).toString();
    
    const resultToAdd = {
      ...newResult,
      id: newId,
    };
    
    setResults([...results, resultToAdd]);
    setIsAddDialogOpen(false);
    toast.success("Result added successfully!");
    
    // Reset form
    setNewResult({
      courseId: "",
      courseName: "",
      score: 0,
      maxScore: 100,
      grade: "C",
      date: new Date().toISOString().split("T")[0],
      feedback: "",
      studentId: "",
      studentName: "",
    });
  };

  const handleDeleteResult = (id: string) => {
    setResults(results.filter(result => result.id !== id));
    toast.success("Result deleted successfully!");
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-brand-blue mb-2"></div>
          <p>Loading results...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Manage Results</h1>
          <p className="text-gray-600">Upload and manage student results</p>
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
              Add New Result
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add New Result</DialogTitle>
              <DialogDescription>
                Enter the details for the student's result
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="studentId">Student</Label>
                <Select
                  value={newResult.studentId}
                  onValueChange={handleStudentChange}
                >
                  <SelectTrigger id="studentId">
                    <SelectValue placeholder="Select student" />
                  </SelectTrigger>
                  <SelectContent>
                    {studentData.map((student) => (
                      <SelectItem key={student.id} value={student.id}>
                        {student.name} ({student.id})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="courseId">Course</Label>
                <Select
                  value={newResult.courseId}
                  onValueChange={handleCourseChange}
                >
                  <SelectTrigger id="courseId">
                    <SelectValue placeholder="Select course" />
                  </SelectTrigger>
                  <SelectContent>
                    {coursesData.map((course) => (
                      <SelectItem key={course.id} value={course.id}>
                        {course.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="score">Score</Label>
                <Input
                  id="score"
                  name="score"
                  type="number"
                  min="0"
                  max={newResult.maxScore}
                  value={newResult.score}
                  onChange={handleScoreChange}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="maxScore">Maximum Score</Label>
                <Input
                  id="maxScore"
                  name="maxScore"
                  type="number"
                  min="1"
                  value={newResult.maxScore}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="grade">Grade (Auto-calculated)</Label>
                <Input
                  id="grade"
                  name="grade"
                  value={newResult.grade}
                  readOnly
                  className="bg-gray-100"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="date">Test Date</Label>
                <Input
                  id="date"
                  name="date"
                  type="date"
                  value={newResult.date}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="feedback">Feedback (Optional)</Label>
                <Textarea
                  id="feedback"
                  name="feedback"
                  value={newResult.feedback}
                  onChange={handleInputChange}
                  placeholder="Provide feedback for the student"
                  rows={4}
                />
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button 
                onClick={handleAddResult} 
                disabled={!newResult.studentId || !newResult.courseId || newResult.score < 0}
              >
                Add Result
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
              <Label htmlFor="search-results">Search</Label>
              <Input
                id="search-results"
                type="text"
                placeholder="Search by student or course..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="course-filter">Filter by Course</Label>
              <Select value={courseFilter} onValueChange={setCourseFilter}>
                <SelectTrigger id="course-filter" className="mt-1">
                  <SelectValue placeholder="All Courses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Courses</SelectItem>
                  {coursesData.map((course) => (
                    <SelectItem key={course.id} value={course.id}>
                      {course.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="grade-filter">Filter by Grade</Label>
              <Select value={gradeFilter} onValueChange={setGradeFilter}>
                <SelectTrigger id="grade-filter" className="mt-1">
                  <SelectValue placeholder="All Grades" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Grades</SelectItem>
                  <SelectItem value="A+">A+</SelectItem>
                  <SelectItem value="A">A</SelectItem>
                  <SelectItem value="B+">B+</SelectItem>
                  <SelectItem value="B">B</SelectItem>
                  <SelectItem value="C+">C+</SelectItem>
                  <SelectItem value="C">C</SelectItem>
                  <SelectItem value="D">D</SelectItem>
                  <SelectItem value="F">F</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
        <CardFooter className="bg-gray-50 px-6 py-3 border-t">
          <div className="text-sm text-gray-600">
            Showing {filteredResults.length} of {results.length} results
          </div>
        </CardFooter>
      </Card>
      
      {/* Results table */}
      <div className="rounded-lg border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Student
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Course
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Score
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Grade
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredResults.map((result) => (
                <tr key={result.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{result.studentName}</div>
                    <div className="text-sm text-gray-500">{result.studentId}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{result.courseName}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {result.score}/{result.maxScore} ({((result.score / result.maxScore) * 100).toFixed(1)}%)
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      result.grade === "A+" || result.grade === "A" 
                        ? "bg-green-100 text-green-800"
                        : result.grade === "B+" || result.grade === "B" 
                        ? "bg-blue-100 text-blue-800"
                        : result.grade === "C+" || result.grade === "C" 
                        ? "bg-yellow-100 text-yellow-800"
                        : result.grade === "D" 
                        ? "bg-orange-100 text-orange-800"
                        : "bg-red-100 text-red-800"
                    }`}>
                      {result.grade}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{result.date}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-800">
                      Edit
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-red-600 hover:text-red-800 ml-2"
                      onClick={() => handleDeleteResult(result.id)}
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {filteredResults.length === 0 && (
          <div className="py-8 text-center">
            <p className="text-gray-500">No results found. Try adjusting your filters.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminResults;
