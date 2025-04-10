
import { useState, useEffect } from "react";
import { getStudentResults } from "@/lib/data";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import ResultCard, { Result } from "@/components/ResultCard";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/hooks/useAuth";

const StudentResults = () => {
  const { user } = useAuth();
  const [results, setResults] = useState<Result[]>([]);
  const [filteredResults, setFilteredResults] = useState<Result[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [gradeFilter, setGradeFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    
    // Simulate API call delay
    setTimeout(() => {
      const data = getStudentResults(user.id);
      setResults(data);
      setFilteredResults(data);
      setIsLoading(false);
    }, 1000);
  }, [user]);

  useEffect(() => {
    // Apply filters whenever search term or grade filter changes
    const filtered = results.filter((result) => {
      const matchesSearch = result.courseName.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesGrade = gradeFilter === "all" || result.grade === gradeFilter;
      return matchesSearch && matchesGrade;
    });
    
    setFilteredResults(filtered);
  }, [searchTerm, gradeFilter, results]);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-brand-blue mb-2"></div>
            <p>Loading results...</p>
          </div>
        </div>
      </div>
    );
  }

  // Calculate statistics
  const totalResults = results.length;
  const avgScore = results.length > 0
    ? results.reduce((sum, result) => sum + (result.score / result.maxScore) * 100, 0) / results.length
    : 0;
  const highestGrade = results.length > 0
    ? results.reduce((prev, current) => {
        const gradeMap: Record<string, number> = { 'A+': 5, 'A': 4, 'B+': 3.5, 'B': 3, 'C+': 2.5, 'C': 2, 'D': 1, 'F': 0 };
        return gradeMap[prev.grade] > gradeMap[current.grade] ? prev : current;
      }).grade
    : 'N/A';

  return (
    <div className="container mx-auto px-4 py-8 transition-colors duration-300">
      <div className="mb-8 animate-in fade-in duration-500">
        <h1 className="text-3xl font-bold text-foreground">My Results</h1>
        <p className="text-muted-foreground">View and track your academic performance</p>
      </div>

      {/* Statistics cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="animate-in fade-in slide-in-from-left duration-500 hover:shadow-md transition-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Total Assessments</CardTitle>
            <CardDescription>
              Number of completed tests
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center h-24">
              <div className="text-4xl font-bold text-brand-blue">
                {totalResults}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="animate-in fade-in slide-in-from-left duration-500 delay-100 hover:shadow-md transition-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Average Score</CardTitle>
            <CardDescription>
              Your overall performance
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center h-24">
              <div className="text-4xl font-bold text-brand-blue">
                {avgScore.toFixed(1)}%
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="animate-in fade-in slide-in-from-left duration-500 delay-200 hover:shadow-md transition-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Highest Grade</CardTitle>
            <CardDescription>
              Your best performance
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center h-24">
              <div className="text-4xl font-bold text-brand-blue">
                {highestGrade}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      {results.length > 0 && (
        <div className="mb-8 animate-in fade-in duration-500 delay-300">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="search-results">Search by Course</Label>
              <Input
                id="search-results"
                type="text"
                placeholder="Search courses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="mt-1 transition-all duration-300 focus:ring-2 focus:ring-brand-blue"
              />
            </div>
            
            <div>
              <Label htmlFor="grade-filter">Filter by Grade</Label>
              <Select value={gradeFilter} onValueChange={setGradeFilter}>
                <SelectTrigger id="grade-filter" className="mt-1 transition-all duration-300 focus:ring-2 focus:ring-brand-blue">
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
        </div>
      )}

      {/* Results list */}
      {filteredResults.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredResults.map((result, index) => (
            <div key={result.id} className={`animate-in fade-in slide-in-from-bottom duration-500 delay-${Math.min(index * 100, 500)}`}>
              <ResultCard result={result} />
            </div>
          ))}
        </div>
      ) : (
        <Card className="p-8 animate-in fade-in duration-500">
          <div className="text-center">
            <h3 className="text-lg font-medium mb-2">No results found</h3>
            <p className="text-muted-foreground">
              {results.length > 0 
                ? "Try adjusting your search or filter criteria" 
                : "You haven't completed any assessments yet"}
            </p>
          </div>
        </Card>
      )}
    </div>
  );
};

export default StudentResults;
