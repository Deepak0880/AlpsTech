
import { useState, useEffect } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { cn } from '@/lib/utils';
import { ChevronLeft, ChevronRight, Quote } from 'lucide-react';

// Sample testimonial data
const testimonials = [
  {
    id: 1,
    name: "Priya Sharma",
    role: "Software Developer",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1887&auto=format&fit=crop",
    quote: "AlpsTech's web development course transformed my career. I went from knowing basic HTML to building full-stack applications in just 3 months. The instructors were supportive and the curriculum was industry-relevant.",
    rating: 5
  },
  {
    id: 2,
    name: "Rahul Patel",
    role: "Data Analyst",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1887&auto=format&fit=crop",
    quote: "The data science course provided me with the skills I needed to transition from a traditional analyst role to a more technical position. The hands-on projects were particularly valuable for building my portfolio.",
    rating: 5
  },
  {
    id: 3,
    name: "Ananya Desai",
    role: "UI/UX Designer",
    image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=1961&auto=format&fit=crop",
    quote: "I had tried several online courses before, but none compared to the personalized attention I received at AlpsTech. The design principles and tools I learned helped me land my dream job within weeks of completing the course.",
    rating: 4
  },
  {
    id: 4,
    name: "Vijay Kumar",
    role: "Network Administrator",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=1887&auto=format&fit=crop",
    quote: "The cybersecurity course at AlpsTech is comprehensive and up-to-date with the latest threats and protection methods. I highly recommend it for anyone looking to enhance their network security skills.",
    rating: 5
  }
];

const TestimonialSlider = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const { theme } = useTheme();

  const goToPrevious = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentIndex(prev => (prev === 0 ? testimonials.length - 1 : prev - 1));
    setTimeout(() => setIsAnimating(false), 500);
  };

  const goToNext = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentIndex(prev => (prev === testimonials.length - 1 ? 0 : prev + 1));
    setTimeout(() => setIsAnimating(false), 500);
  };

  // Auto-advance the slider
  useEffect(() => {
    const interval = setInterval(goToNext, 8000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative">
      {/* Gradient background for the slider */}
      <div className={cn(
        "absolute inset-0 rounded-xl -z-10",
        theme === "dark" 
          ? "bg-gradient-to-br from-gray-900 to-gray-800" 
          : "bg-gradient-to-br from-blue-50 to-indigo-50"
      )}></div>
      
      <div className="flex flex-col md:flex-row rounded-xl overflow-hidden shadow-lg border border-gray-200 dark:border-gray-700">
        {/* Image section */}
        <div className="md:w-2/5 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10"></div>
          
          <img 
            src={testimonials[currentIndex].image} 
            alt={testimonials[currentIndex].name}
            className={cn(
              "w-full h-full object-cover object-center transition-transform duration-500",
              isAnimating ? "scale-110" : "scale-100"
            )}
          />
          
          <div className="absolute bottom-0 left-0 p-4 z-20">
            <h3 className="text-white font-bold text-xl">{testimonials[currentIndex].name}</h3>
            <p className="text-gray-200 text-sm">{testimonials[currentIndex].role}</p>
          </div>
        </div>
        
        {/* Content section */}
        <div className="md:w-3/5 p-6 md:p-8 flex flex-col justify-center">
          <div className="mb-6">
            <Quote className={cn(
              "w-10 h-10 mb-4",
              theme === "dark" ? "text-blue-400" : "text-blue-500"
            )} />
            
            <p className={cn(
              "text-lg md:text-xl italic mb-6 transition-opacity duration-500",
              isAnimating ? "opacity-0" : "opacity-100",
              theme === "dark" ? "text-gray-300" : "text-gray-700"
            )}>
              "{testimonials[currentIndex].quote}"
            </p>
            
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <svg 
                  key={i} 
                  xmlns="http://www.w3.org/2000/svg" 
                  className={cn(
                    "h-5 w-5 mr-1", 
                    i < testimonials[currentIndex].rating 
                      ? "text-yellow-500" 
                      : "text-gray-300"
                  )} 
                  viewBox="0 0 20 20" 
                  fill="currentColor"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
          </div>
          
          <div className="flex justify-between mt-auto">
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {currentIndex + 1} of {testimonials.length}
            </span>
            
            <div className="flex space-x-2">
              <button 
                onClick={goToPrevious}
                className={cn(
                  "p-2 rounded-full transition-colors",
                  theme === "dark" 
                    ? "hover:bg-gray-700 text-gray-300" 
                    : "hover:bg-gray-200 text-gray-700"
                )}
                aria-label="Previous testimonial"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button 
                onClick={goToNext}
                className={cn(
                  "p-2 rounded-full transition-colors",
                  theme === "dark" 
                    ? "hover:bg-gray-700 text-gray-300" 
                    : "hover:bg-gray-200 text-gray-700"
                )}
                aria-label="Next testimonial"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Navigation dots */}
      <div className="flex justify-center mt-4 space-x-2">
        {testimonials.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              setIsAnimating(true);
              setCurrentIndex(index);
              setTimeout(() => setIsAnimating(false), 500);
            }}
            className={cn(
              "w-2 h-2 rounded-full transition-all duration-300",
              index === currentIndex 
                ? "w-6 bg-brand-blue" 
                : theme === "dark" ? "bg-gray-600" : "bg-gray-300"
            )}
            aria-label={`Go to testimonial ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default TestimonialSlider;
