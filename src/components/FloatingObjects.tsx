
import { useEffect, useRef, useState } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { cn } from '@/lib/utils';

/**
 * Main component that renders floating objects using canvas and CSS
 */
const FloatingObjects = () => {
  const { theme } = useTheme();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [mounted, setMounted] = useState(false);
  
  // Delayed mounting to avoid hydration issues
  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true);
    }, 300); // Slightly longer delay for stability
    
    return () => clearTimeout(timer);
  }, []);

  // Canvas animation
  useEffect(() => {
    if (!mounted || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas dimensions
    const updateCanvasSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    updateCanvasSize();
    window.addEventListener('resize', updateCanvasSize);

    // Create floating objects based on theme
    const objects = theme === 'dark' 
      ? [
          { x: canvas.width * 0.3, y: canvas.height * 0.3, size: 70, color: '#4361ee', speedX: 0.2, speedY: 0.3 },
          { x: canvas.width * 0.7, y: canvas.height * 0.4, size: 90, color: '#3a0ca3', speedX: 0.1, speedY: 0.2 },
          { x: canvas.width * 0.4, y: canvas.height * 0.6, size: 50, color: '#7209b7', speedX: 0.15, speedY: 0.25 },
          { x: canvas.width * 0.8, y: canvas.height * 0.7, size: 60, color: '#560bad', speedX: 0.25, speedY: 0.15 },
          { x: canvas.width * 0.5, y: canvas.height * 0.2, size: 80, color: '#480ca8', speedX: 0.1, speedY: 0.1 }
        ]
      : [
          { x: canvas.width * 0.3, y: canvas.height * 0.3, size: 70, color: '#90e0ef', speedX: 0.2, speedY: 0.3 },
          { x: canvas.width * 0.7, y: canvas.height * 0.4, size: 90, color: '#00b4d8', speedX: 0.1, speedY: 0.2 },
          { x: canvas.width * 0.4, y: canvas.height * 0.6, size: 50, color: '#0077b6', speedX: 0.15, speedY: 0.25 },
          { x: canvas.width * 0.8, y: canvas.height * 0.7, size: 60, color: '#48cae4', speedX: 0.25, speedY: 0.15 },
          { x: canvas.width * 0.5, y: canvas.height * 0.2, size: 80, color: '#ade8f4', speedX: 0.1, speedY: 0.1 }
        ];

    // Animation variables
    let time = 0;
    let animationFrameId: number;

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      time += 0.01;
      
      // Draw objects
      objects.forEach(obj => {
        ctx.save();
        
        // Update position based on time
        const x = obj.x + Math.sin(time * obj.speedX * 10) * 30;
        const y = obj.y + Math.cos(time * obj.speedY * 10) * 30;
        
        // Create radial gradient for glow effect
        const gradient = ctx.createRadialGradient(x, y, 0, x, y, obj.size);
        gradient.addColorStop(0, obj.color);
        gradient.addColorStop(0.8, obj.color + '66'); // 40% opacity
        gradient.addColorStop(1, obj.color + '00'); // 0% opacity
        
        // Draw circle with glow
        ctx.beginPath();
        ctx.arc(x, y, obj.size, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.globalAlpha = 0.7;
        ctx.fill();
        
        ctx.restore();
      });
      
      animationFrameId = window.requestAnimationFrame(animate);
    };
    
    animate();
    
    // Clean up
    return () => {
      window.removeEventListener('resize', updateCanvasSize);
      window.cancelAnimationFrame(animationFrameId);
    };
  }, [mounted, theme]);
  
  // Don't render anything until mounted
  if (!mounted) return null;
  
  return (
    <div className={cn(
      "fixed inset-0 w-full h-full pointer-events-none z-0 transition-opacity duration-1000",
      theme === 'dark' ? 'opacity-60' : 'opacity-40'
    )}>
      <canvas 
        ref={canvasRef} 
        className="w-full h-full"
      />
    </div>
  );
};

export default FloatingObjects;
