
import { useEffect, useState } from "react";
import { useTheme } from "@/contexts/ThemeContext";
import { cn } from "@/lib/utils";

const CustomCursor = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [clicked, setClicked] = useState(false);
  const [linkHovered, setLinkHovered] = useState(false);
  const [hidden, setHidden] = useState(true);
  const { theme } = useTheme();

  useEffect(() => {
    // Show cursor only after it has moved (prevents flash at (0,0))
    const addEventListeners = () => {
      document.addEventListener("mousemove", onMouseMove);
      document.addEventListener("mousedown", onMouseDown);
      document.addEventListener("mouseup", onMouseUp);
      document.addEventListener("mouseenter", onMouseEnter);
      document.addEventListener("mouseleave", onMouseLeave);
    };

    const removeEventListeners = () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mousedown", onMouseDown);
      document.removeEventListener("mouseup", onMouseUp);
      document.removeEventListener("mouseenter", onMouseEnter);
      document.removeEventListener("mouseleave", onMouseLeave);
    };

    const onMouseMove = (e: MouseEvent) => {
      // Use requestAnimationFrame for smoother cursor movement
      requestAnimationFrame(() => {
        setPosition({ x: e.clientX, y: e.clientY });
      });
      setHidden(false);
    };

    const onMouseDown = () => {
      setClicked(true);
    };

    const onMouseUp = () => {
      setClicked(false);
    };

    const onMouseEnter = () => {
      setHidden(false);
    };

    const onMouseLeave = () => {
      setHidden(true);
    };

    // Use event delegation for better performance
    const handleLinkHover = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const isInteractive = 
        target.tagName === 'A' || 
        target.tagName === 'BUTTON' || 
        target.hasAttribute('role') && target.getAttribute('role') === 'button' ||
        target.tagName === 'INPUT' || 
        target.tagName === 'TEXTAREA' || 
        target.tagName === 'SELECT' ||
        target.hasAttribute('tabindex');
      
      setLinkHovered(isInteractive);
    };

    document.addEventListener('mouseover', handleLinkHover);
    document.addEventListener('mouseout', () => setLinkHovered(false));

    addEventListeners();
    return () => {
      removeEventListeners();
      document.removeEventListener('mouseover', handleLinkHover);
      document.removeEventListener('mouseout', () => setLinkHovered(false));
    };
  }, []);

  const cursorVariants = {
    default: {
      ring: theme === "dark" 
        ? "border-blue-500/80 bg-blue-500/20" 
        : "border-blue-600/80 bg-blue-500/10",
      dot: theme === "dark"
        ? "bg-blue-400" 
        : "bg-brand-blue"
    },
    clicked: {
      ring: theme === "dark"
        ? "border-purple-500/80 scale-90 bg-purple-500/30" 
        : "border-brand-darkBlue/80 scale-90 bg-brand-blue/30",
      dot: theme === "dark"
        ? "bg-purple-400 scale-75" 
        : "bg-brand-darkBlue scale-75"
    },
    hovered: {
      ring: theme === "dark"
        ? "border-blue-400/80 scale-150 bg-blue-400/10" 
        : "border-brand-blue/80 scale-150 bg-blue-500/5",
      dot: theme === "dark"
        ? "bg-blue-300 scale-75" 
        : "bg-brand-blue scale-75"
    }
  };

  const getCursorStyle = () => {
    if (clicked) return cursorVariants.clicked;
    if (linkHovered) return cursorVariants.hovered;
    return cursorVariants.default;
  };

  const cursorStyle = getCursorStyle();

  if (typeof window === "undefined" || hidden) return null;

  return (
    <>
      {/* Outer ring cursor */}
      <div 
        className={cn(
          "fixed pointer-events-none z-[999999] rounded-full border will-change-transform",
          cursorStyle.ring
        )}
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
          width: 40,
          height: 40, 
          border: '1.5px solid',
          backdropFilter: 'blur(1px)',
          transform: 'translate(-50%, -50%)',
          transition: 'transform 0.15s ease-out, opacity 0.15s ease-out, background-color 0.15s ease-out'
        }}
      />
      
      {/* Inner dot cursor */}
      <div
        className={cn(
          "fixed pointer-events-none z-[999999] rounded-full will-change-transform",
          cursorStyle.dot
        )}
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
          width: 8,
          height: 8,
          transform: 'translate(-50%, -50%)',
          transition: 'transform 0.1s ease-out, background-color 0.15s ease-out'
        }}
      />
    </>
  );
};

export default CustomCursor;
