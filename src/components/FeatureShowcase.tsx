
import { useState, useEffect } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { cn } from '@/lib/utils';
import { 
  Users, 
  GraduationCap, 
  Clock, 
  Computer,
  Lightbulb,
  BookOpen,
  BarChart,
  Globe,
} from 'lucide-react';

// Feature data
const features = [
  {
    icon: <Clock className="w-6 h-6" />,
    title: "Flexible Scheduling",
    description: "Learn at your own pace with our flexible course schedules and online resources."
  },
  {
    icon: <Users className="w-6 h-6" />,
    title: "Expert Instructors",
    description: "Learn from industry professionals with years of practical experience."
  },
  {
    icon: <Computer className="w-6 h-6" />,
    title: "Modern Curriculum",
    description: "Our courses are regularly updated to reflect the latest industry standards and technologies."
  },
  {
    icon: <BookOpen className="w-6 h-6" />,
    title: "Comprehensive Materials",
    description: "Get access to detailed study materials, video lectures, and practice assignments."
  },
  {
    icon: <GraduationCap className="w-6 h-6" />,
    title: "Certifications",
    description: "Earn industry-recognized certifications to boost your resume and career prospects."
  },
  {
    icon: <Lightbulb className="w-6 h-6" />,
    title: "Hands-on Projects",
    description: "Apply your knowledge through practical projects that simulate real-world scenarios."
  },
  {
    icon: <BarChart className="w-6 h-6" />,
    title: "Career Support",
    description: "Get placement assistance and career guidance from our dedicated support team."
  },
  {
    icon: <Globe className="w-6 h-6" />,
    title: "Global Community",
    description: "Join our global community of learners and expand your professional network."
  }
];

interface FeatureShowcaseProps {
  isVisible: boolean;
}

const FeatureCard = ({ 
  feature, 
  index, 
  isVisible 
}: { 
  feature: typeof features[0]; 
  index: number;
  isVisible: boolean;
}) => {
  const { theme } = useTheme();
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <div 
      className={cn(
        "bg-white dark:bg-gray-800 rounded-xl p-6 transition-all duration-500",
        isHovered ? "transform scale-105" : "",
        theme === "dark" ? "shadow-blue-900/5" : "shadow-md",
        "transform transition-all"
      )}
      style={{ 
        transitionDelay: `${index * 100}ms`,
        opacity: isVisible ? 1 : 0,
        transform: isVisible 
          ? isHovered ? "translateY(-5px) scale(1.05)" : "translateY(0) scale(1)" 
          : "translateY(20px) scale(0.95)"
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className={cn(
        "w-14 h-14 rounded-lg mb-4 flex items-center justify-center transition-colors",
        isHovered 
          ? "bg-brand-blue text-white" 
          : theme === "dark" 
            ? "bg-gray-700 text-blue-400" 
            : "bg-blue-100 text-blue-600"
      )}>
        {feature.icon}
      </div>
      
      <h3 className="text-xl font-semibold mb-2 dark:text-white">{feature.title}</h3>
      <p className="text-gray-600 dark:text-gray-300">{feature.description}</p>
    </div>
  );
};

const FeatureShowcase = ({ isVisible }: FeatureShowcaseProps) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {features.map((feature, index) => (
        <FeatureCard 
          key={feature.title}
          feature={feature}
          index={index}
          isVisible={isVisible}
        />
      ))}
    </div>
  );
};

export default FeatureShowcase;
