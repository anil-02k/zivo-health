
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-vivo-50 to-white">
      <div className="glass p-8 rounded-xl text-center max-w-md animate-scale-in">
        <h1 className="text-6xl font-bold text-vivo-600 mb-4">404</h1>
        <p className="text-xl text-foreground mb-6">
          Oops! We couldn't find the page you're looking for.
        </p>
        <Button className="bg-vivo-600 hover:bg-vivo-700 btn-hover" size="lg">
          <ArrowLeft size={16} className="mr-2" />
          <a href="/">Return to Home</a>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
