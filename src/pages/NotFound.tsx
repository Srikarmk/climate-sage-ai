import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Home, AlertCircle } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center gradient-page px-4">
      <Card className="p-12 text-center max-w-md w-full">
        <div className="w-20 h-20 glass-strong rounded-full flex items-center justify-center mb-6 mx-auto glass-bounce">
          <AlertCircle className="w-10 h-10 text-destructive" />
        </div>
        <h1 className="mb-4 text-6xl font-bold text-foreground">404</h1>
        <p className="mb-8 text-xl text-muted-foreground">Oops! Page not found</p>
        <p className="mb-8 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link to="/">
          <Button variant="elevated" size="lg" className="text-accent hover:text-accent/80">
            <Home className="mr-2 h-5 w-5" />
            Return to Home
          </Button>
        </Link>
      </Card>
    </div>
  );
};

export default NotFound;
