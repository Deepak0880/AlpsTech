
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useTheme } from "@/contexts/ThemeContext";
import { cn } from "@/lib/utils";

export interface Result {
  id: string;
  courseId: string;
  courseName: string;
  score: number;
  maxScore: number;
  grade: string;
  date: string;
  feedback?: string;
}

interface ResultCardProps {
  result: Result;
}

const ResultCard = ({ result }: ResultCardProps) => {
  const percentage = (result.score / result.maxScore) * 100;
  const { theme } = useTheme();
  
  const getGradeColor = (grade: string) => {
    if (theme === "dark") {
      switch (grade) {
        case "A":
        case "A+":
          return "bg-green-700 text-white hover:bg-green-600";
        case "B":
        case "B+":
          return "bg-blue-700 text-white hover:bg-blue-600";
        case "C":
        case "C+":
          return "bg-yellow-700 text-white hover:bg-yellow-600";
        case "D":
          return "bg-orange-700 text-white hover:bg-orange-600";
        case "F":
          return "bg-red-700 text-white hover:bg-red-600";
        default:
          return "bg-gray-700 text-white hover:bg-gray-600";
      }
    } else {
      switch (grade) {
        case "A":
        case "A+":
          return "bg-green-100 text-green-800 hover:bg-green-200";
        case "B":
        case "B+":
          return "bg-blue-100 text-blue-800 hover:bg-blue-200";
        case "C":
        case "C+":
          return "bg-yellow-100 text-yellow-800 hover:bg-yellow-200";
        case "D":
          return "bg-orange-100 text-orange-800 hover:bg-orange-200";
        case "F":
          return "bg-red-100 text-red-800 hover:bg-red-200";
        default:
          return "bg-gray-100 text-gray-800 hover:bg-gray-200";
      }
    }
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg">{result.courseName}</CardTitle>
          <Badge className={getGradeColor(result.grade)} variant="outline">
            Grade: {result.grade}
          </Badge>
        </div>
        <div className="text-sm text-gray-500 dark:text-gray-400">Test Date: {result.date}</div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-sm font-medium">Score</span>
              <span className="text-sm font-medium">{result.score}/{result.maxScore} ({percentage.toFixed(1)}%)</span>
            </div>
            <Progress value={percentage} className="h-2" />
          </div>
          
          {result.feedback && (
            <div>
              <h4 className="text-sm font-medium mb-1">Feedback:</h4>
              <p className="text-sm text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-800 p-3 rounded-md">{result.feedback}</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ResultCard;
