import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center space-y-6 max-w-md">
        <h1 className="text-8xl font-heading font-bold cosmic-glow">404</h1>
        <p className="text-2xl font-semibold">Lost in Space</p>
        <p className="text-muted-foreground">
          Oops! This celestial object doesn't exist in our database.
        </p>
        <Button asChild className="shadow-glow-primary">
          <Link to="/">Return to Home</Link>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
