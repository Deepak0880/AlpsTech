
import { useRef, useEffect } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { cn } from '@/lib/utils';

const AnimatedBackground = () => {
  const { theme } = useTheme();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    
    const particles: {
      x: number;
      y: number;
      radius: number;
      color: string;
      speedX: number;
      speedY: number;
    }[] = [];
    
    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
      initParticles();
    };

    const initParticles = () => {
      particles.length = 0;
      const particleCount = Math.min(Math.floor(width * height / 15000), 100);
      
      for (let i = 0; i < particleCount; i++) {
        const radius = Math.random() * 2 + 1;
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          radius: radius,
          color: theme === 'dark' 
            ? `rgba(${120 + Math.random() * 80}, ${120 + Math.random() * 80}, ${220 + Math.random() * 35}, ${0.3 + Math.random() * 0.4})`
            : `rgba(${180 + Math.random() * 75}, ${210 + Math.random() * 45}, ${250}, ${0.2 + Math.random() * 0.3})`,
          speedX: Math.random() * 0.5 - 0.25,
          speedY: Math.random() * 0.5 - 0.25
        });
      }
    };

    const drawParticles = () => {
      ctx.clearRect(0, 0, width, height);
      
      particles.forEach(particle => {
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        ctx.fillStyle = particle.color;
        ctx.fill();
        
        // Update position
        particle.x += particle.speedX;
        particle.y += particle.speedY;
        
        // Bounce off walls
        if (particle.x < 0 || particle.x > width) particle.speedX *= -1;
        if (particle.y < 0 || particle.y > height) particle.speedY *= -1;
      });

      // Draw connecting lines
      ctx.strokeStyle = theme === 'dark' 
        ? 'rgba(100, 120, 240, 0.04)' 
        : 'rgba(170, 200, 255, 0.07)';
      ctx.lineWidth = 0.5;
      
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < 160) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }
      
      requestAnimationFrame(drawParticles);
    };

    resize();
    window.addEventListener('resize', resize);
    drawParticles();

    return () => {
      window.removeEventListener('resize', resize);
    };
  }, [theme]);

  return (
    <canvas 
      ref={canvasRef} 
      className={cn(
        "fixed inset-0 w-full h-full pointer-events-none z-0 transition-opacity duration-1000",
        theme === 'dark' ? 'opacity-80' : 'opacity-70'
      )}
    />
  );
};

export default AnimatedBackground;
