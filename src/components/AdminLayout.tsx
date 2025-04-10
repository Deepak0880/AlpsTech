
import { Outlet } from "react-router-dom";
import { useTheme } from "@/contexts/ThemeContext";
import { cn } from "@/lib/utils";

const AdminLayout = () => {
  const { theme } = useTheme();
  
  return (
    <div className={cn(
      "min-h-screen transition-colors duration-300",
      theme === "dark" ? "bg-gray-900 text-gray-100" : "bg-gray-50 text-gray-900"
    )}>
      <header className={cn(
        "border-b transition-colors duration-300",
        theme === "dark" ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
      )}>
        <div className="container mx-auto px-4 py-4">
          <h1 className={cn(
            "text-2xl font-bold",
            theme === "dark" ? "text-white" : "text-gray-800"
          )}>AlpsTech Admin Dashboard</h1>
        </div>
      </header>
      
      <div className="container mx-auto px-4 py-8">
        <Outlet />
      </div>
    </div>
  );
};

export default AdminLayout;
