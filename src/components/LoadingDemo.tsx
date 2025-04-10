
import React, { useState, useEffect } from "react";
import { LoadingBar } from "@/components/ui/loading-bar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const LoadingDemo = () => {
  const [progress, setProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  
  // Handle progress simulation
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isLoading && progress < 100) {
      interval = setInterval(() => {
        setProgress((prev) => {
          const next = prev + Math.floor(Math.random() * 10) + 5;
          return next > 100 ? 100 : next;
        });
      }, 300);
    } else if (progress >= 100) {
      setTimeout(() => {
        setIsLoading(false);
        setProgress(0);
      }, 500);
    }
    
    return () => clearInterval(interval);
  }, [isLoading, progress]);
  
  const startLoading = () => {
    setIsLoading(true);
    setProgress(0);
  };

  return (
    <div className="grid gap-8">
      <Card>
        <CardHeader>
          <CardTitle>Loading Indicators</CardTitle>
          <CardDescription>Different styles of loading bars for the application</CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Determinate Progress</h3>
            <LoadingBar progress={progress} className="mb-2" />
            <div className="flex gap-4">
              <Button onClick={startLoading} disabled={isLoading}>
                {isLoading ? "Loading..." : "Start Loading"}
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setProgress(0)} 
                disabled={isLoading}
              >
                Reset
              </Button>
            </div>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Indeterminate Progress</h3>
            <div className="space-y-4">
              <LoadingBar indeterminate height="h-1" />
              <LoadingBar indeterminate variant="accent" height="h-2" />
              <LoadingBar indeterminate variant="secondary" height="h-1.5" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoadingDemo;
