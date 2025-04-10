
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export interface Course {
  id: string;
  title: string;
  description: string;
  instructor: string;
  duration: string;
  level: "beginner" | "intermediate" | "advanced";
  price: number;
  image: string;
  enrollmentStatus?: "open" | "closed" | "in progress";
}

interface CourseCardProps {
  course: Course;
}

const CourseCard = ({ course }: CourseCardProps) => {
  const getLevelColor = (level: string) => {
    switch (level) {
      case "beginner":
        return "bg-green-100 text-green-800 hover:bg-green-200";
      case "intermediate":
        return "bg-blue-100 text-blue-800 hover:bg-blue-200";
      case "advanced":
        return "bg-purple-100 text-purple-800 hover:bg-purple-200";
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-200";
    }
  };

  return (
    <Card className="overflow-hidden transition-all hover:shadow-md">
      <div className="aspect-video overflow-hidden">
        <img 
          src={course.image} 
          alt={course.title} 
          className="w-full h-full object-cover transition-transform hover:scale-105"
        />
      </div>
      <CardHeader className="p-4">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg text-brand-darkBlue">{course.title}</CardTitle>
          <Badge className={getLevelColor(course.level)} variant="outline">
            {course.level.charAt(0).toUpperCase() + course.level.slice(1)}
          </Badge>
        </div>
        <CardDescription className="line-clamp-2">{course.description}</CardDescription>
      </CardHeader>
      <CardContent className="p-4 pt-0 space-y-2">
        <div className="text-sm">
          <span className="font-medium">Instructor:</span> {course.instructor}
        </div>
        <div className="text-sm">
          <span className="font-medium">Duration:</span> {course.duration}
        </div>
        <div className="font-bold text-lg text-brand-darkBlue">
          ₹{course.price.toLocaleString('en-IN')}
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button asChild className="w-full">
          <Link to={`/courses/${course.id}`}>View Details</Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default CourseCard;
