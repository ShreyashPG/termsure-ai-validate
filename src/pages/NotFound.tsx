
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { FileX } from "lucide-react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <div className="text-center max-w-md p-6">
        <div className="h-20 w-20 mx-auto mb-4 financial-gradient rounded-full flex items-center justify-center">
          <FileX className="h-10 w-10 text-white" />
        </div>
        <h1 className="text-4xl font-bold text-financial-primary mb-2">404</h1>
        <p className="text-xl text-gray-700 mb-6">Oops! Page not found</p>
        <p className="text-gray-500 mb-8">
          The page you are looking for might have been removed, had its name changed, 
          or is temporarily unavailable.
        </p>
        <Button 
          size="lg"
          className="bg-financial-primary hover:bg-financial-primary/90"
          asChild
        >
          <a href="/">Return to Home</a>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
