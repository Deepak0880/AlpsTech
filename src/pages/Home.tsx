
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { coursesData } from "@/lib/data";
import CourseCard from "@/components/CourseCard";
import { useTheme } from "@/contexts/ThemeContext";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import LiveCounters from "@/components/LiveCounters";
import FeatureShowcase from "@/components/FeatureShowcase";
import { Sparkles } from "lucide-react";

const Home = () => {
  // Get featured courses (first 3 for demo)
  const featuredCourses = coursesData.slice(0, 3);
  const { theme } = useTheme();
  const [scrollY, setScrollY] = useState(0);
  const [isVisible, setIsVisible] = useState<{[key: string]: boolean}>({
    hero: false,
    courses: false,
    features: false,
    cta: false
  });

  // Handle scroll animations
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
      
      // Check if sections are visible
      const sections = ['hero', 'courses', 'features', 'cta'];
      sections.forEach(section => {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          setIsVisible(prev => ({
            ...prev,
            [section]: rect.top < window.innerHeight * 0.8
          }));
        }
      });
    };
    
    // Initial check
    setTimeout(handleScroll, 100);
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="space-y-20 pb-12">
      {/* Hero section with parallax effect */}
      <section 
        id="hero"
        className={cn(
          "relative bg-gradient-to-r from-brand-darkBlue via-blue-600 to-brand-blue text-white py-24 rounded-2xl overflow-hidden transition-all duration-700 transform",
          isVisible.hero ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        )}
        style={{
          transformStyle: 'preserve-3d',
          perspective: '1000px'
        }}
      >
        <div className="absolute inset-0 bg-grid-white/5 bg-grid-pattern [mask-image:linear-gradient(to_bottom,white,transparent)]"></div>
        
        {/* Animated floating elements */}
        <div className="absolute w-64 h-64 -top-20 -right-20 bg-blue-500 rounded-full opacity-20 blur-3xl"
             style={{ transform: `translateY(${scrollY * 0.05}px)` }}></div>
        <div className="absolute w-48 h-48 top-40 -left-10 bg-indigo-600 rounded-full opacity-20 blur-3xl"
             style={{ transform: `translateY(${scrollY * -0.03}px)` }}></div>
        <div className="absolute w-56 h-56 bottom-10 right-20 bg-purple-600 rounded-full opacity-20 blur-3xl"
             style={{ transform: `translateY(${scrollY * -0.07}px)` }}></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col lg:flex-row items-center">
            <div className="max-w-2xl lg:w-1/2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm mb-6 text-sm border border-white/10">
                <Sparkles className="h-4 w-4 text-yellow-300" />
                <span>Transforming careers since 2010</span>
              </div>
              
              <h1 
                className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 animate-in slide-in-from-left leading-tight"
                style={{ 
                  transform: `translateZ(50px) translateY(${scrollY * -0.1}px)`,
                  textShadow: '0 2px 10px rgba(0, 0, 0, 0.3)'
                }}
              >
                Master Computer Skills with <span className="text-yellow-300">Expert Guidance</span>
              </h1>
              
              <p 
                className="text-lg mb-8 text-blue-50 animate-in slide-in-from-left animation-delay-300"
                style={{ transform: `translateZ(25px) translateY(${scrollY * -0.05}px)` }}
              >
                Enhance your skills with our comprehensive computer courses designed for beginners to advanced learners. Join over 15,000 students who transformed their careers with AlpsTech.
              </p>
              
              <div 
                className="flex flex-wrap gap-4 animate-in slide-in-from-bottom animation-delay-500"
                style={{ transform: `translateZ(10px)` }}
              >
                <Button asChild size="lg" className="bg-white text-brand-darkBlue hover:bg-gray-100 hover-glow hover:shadow-lg transition-all duration-300">
                  <Link to="/courses">Explore Courses</Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white/10 hover-float">
                  <Link to="/login">Student Login</Link>
                </Button>
              </div>
            </div>
            
            <div className="lg:w-1/2 mt-12 lg:mt-0 animate-in slide-in-from-right">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl blur-xl opacity-30 animate-pulse-slow"></div>
                <div className="relative bg-gradient-to-br from-gray-900/90 to-gray-800/90 p-8 rounded-xl border border-white/10 backdrop-blur-sm">
                  <LiveCounters />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured courses section with staggered animation */}
      <section 
        id="courses" 
        className={cn(
          "transition-all duration-700 transform",
          isVisible.courses ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        )}
      >
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100 relative">
              Featured Courses
              <span className="absolute -bottom-2 left-0 h-1 w-20 bg-brand-blue rounded-full"></span>
            </h2>
            <Button asChild variant="outline" className="hover-float">
              <Link to="/courses">View All Courses</Link>
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredCourses.map((course, index) => (
              <div 
                key={course.id} 
                className="transform transition-all duration-700"
                style={{ 
                  transitionDelay: `${index * 150}ms`,
                  opacity: isVisible.courses ? 1 : 0,
                  transform: isVisible.courses ? 'translateY(0)' : 'translateY(20px)'
                }}
              >
                <CourseCard course={course} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features showcase */}
      <section 
        id="features" 
        className={cn(
          "py-16 rounded-2xl transition-all duration-700 transform",
          isVisible.features ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10",
          theme === "dark" ? "bg-gray-900/30" : "bg-gray-50"
        )}
      >
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 text-gray-800 dark:text-gray-100">Why Choose AlpsTech</h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Our computer center provides industry-leading education with modern facilities and experienced instructors.
            </p>
          </div>
          
          <FeatureShowcase isVisible={isVisible.features} />
        </div>
      </section>

      {/* CTA section with glass effect */}
      <section 
        id="cta" 
        className={cn(
          "backdrop-blur-lg bg-white/10 dark:bg-gray-900/30 border border-white/20 dark:border-white/5 text-gray-800 dark:text-white rounded-2xl overflow-hidden relative transition-all duration-700 transform shadow-lg",
          isVisible.cta ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        )}
      >
        {/* Glass effect background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -right-10 -top-10 w-40 h-40 bg-blue-500 rounded-full opacity-10 blur-3xl animate-pulse"></div>
          <div className="absolute -left-10 bottom-10 w-32 h-32 bg-purple-500 rounded-full opacity-10 blur-3xl animate-pulse animation-duration-3000"></div>
        </div>
        
        <div className="container mx-auto px-4 py-16 relative z-10">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">Ready to Start Your Learning Journey?</h2>
            <p className="text-lg mb-8">
              Enroll in our courses today and take the first step towards advancing your computer skills and career.
            </p>
            <Button 
              asChild 
              size="lg" 
              className="bg-brand-blue text-white hover:bg-blue-600 hover-glow hover:shadow-lg transition-all duration-300"
            >
              <Link to="/courses">Browse All Courses</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
