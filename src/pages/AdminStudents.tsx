
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";

const AdminStudents = () => {
  const { users } = useAuth();
  const [students, setStudents] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Filter only student users
    const studentUsers = users.filter(user => user.role === "student");
    setStudents(studentUsers);
    setIsLoading(false);
  }, [users]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-brand-blue mb-2"></div>
          <p>Loading students...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Students Management</h1>
        <p className="text-gray-600">View and manage students enrolled in courses</p>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>All Students ({students.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100 dark:bg-gray-800">
                  <th className="px-4 py-2 text-left">Name</th>
                  <th className="px-4 py-2 text-left">Email</th>
                  <th className="px-4 py-2 text-left">Enrolled Courses</th>
                  <th className="px-4 py-2 text-left">Results</th>
                  <th className="px-4 py-2 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {students.length > 0 ? (
                  students.map(student => (
                    <tr key={student.id} className="border-t border-gray-200 dark:border-gray-700">
                      <td className="px-4 py-3">{student.name}</td>
                      <td className="px-4 py-3">{student.email}</td>
                      <td className="px-4 py-3">{student.enrolledCourses ? student.enrolledCourses.length : 0}</td>
                      <td className="px-4 py-3">{student.results ? student.results.length : 0}</td>
                      <td className="px-4 py-3">
                        <Button variant="outline" size="sm">View Details</Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-4 py-3 text-center">No students found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Student Enrollments</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100 dark:bg-gray-800">
                  <th className="px-4 py-2 text-left">Student</th>
                  <th className="px-4 py-2 text-left">Course</th>
                  <th className="px-4 py-2 text-left">Enrollment Date</th>
                </tr>
              </thead>
              <tbody>
                {students.flatMap(student => 
                  (student.enrolledCourses || []).map((courseId: string, index: number) => (
                    <tr key={`${student.id}-${courseId}`} className="border-t border-gray-200 dark:border-gray-700">
                      <td className="px-4 py-3">{student.name}</td>
                      <td className="px-4 py-3">Course ID: {courseId}</td>
                      <td className="px-4 py-3">{new Date(Date.now() - index * 86400000).toLocaleDateString()}</td>
                    </tr>
                  ))
                )}
                {students.every(student => !student.enrolledCourses || student.enrolledCourses.length === 0) && (
                  <tr>
                    <td colSpan={3} className="px-4 py-3 text-center">No enrollments found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminStudents;
