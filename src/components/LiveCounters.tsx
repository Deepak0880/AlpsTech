
import { useEffect, useState } from 'react';
import { Users, GraduationCap, Award, Clock } from 'lucide-react';

type CounterProps = {
  label: string;
  value: number;
  icon: React.ReactNode;
  duration?: number;
}

const Counter = ({ label, value, icon, duration = 2000 }: CounterProps) => {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    // Animate counting from 0 to value
    let startTime: number;
    let animationFrame: number;
    
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setCount(Math.floor(progress * value));
      
      if (progress < 1) {
        animationFrame = requestAnimationFrame(step);
      }
    };
    
    animationFrame = requestAnimationFrame(step);
    
    return () => cancelAnimationFrame(animationFrame);
  }, [value, duration]);
  
  return (
    <div className="flex flex-col items-center p-4">
      <div className="mb-3 p-3 rounded-full bg-white/10 text-white">
        {icon}
      </div>
      <div className="text-3xl font-bold text-white mb-1">{count.toLocaleString()}</div>
      <div className="text-blue-100 text-sm">{label}</div>
    </div>
  );
};

const LiveCounters = () => {
  // Add some randomization to make it feel "live"
  const [students, setStudents] = useState(15420);
  const [courses, setCourses] = useState(42);
  const [awards, setAwards] = useState(18);
  const [hours, setHours] = useState(5200);

  useEffect(() => {
    // Simulate live data by updating counters randomly
    const interval = setInterval(() => {
      setStudents(prev => prev + Math.floor(Math.random() * 3));
      setHours(prev => prev + Math.floor(Math.random() * 5));
      
      // Less frequent updates for courses and awards
      if (Math.random() > 0.7) {
        setCourses(prev => prev + 1);
      }
      
      if (Math.random() > 0.9) {
        setAwards(prev => prev + 1);
      }
    }, 10000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="grid grid-cols-2 gap-6">
      <Counter 
        label="Active Students" 
        value={students} 
        icon={<Users className="w-6 h-6" />}
      />
      <Counter 
        label="Courses Offered" 
        value={courses} 
        icon={<GraduationCap className="w-6 h-6" />}
      />
      <Counter 
        label="Awards Received" 
        value={awards} 
        icon={<Award className="w-6 h-6" />}
      />
      <Counter 
        label="Learning Hours" 
        value={hours} 
        icon={<Clock className="w-6 h-6" />}
      />
    </div>
  );
};

export default LiveCounters;
