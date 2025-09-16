import { Link, useLocation } from "react-router-dom";
import { Heart, Activity } from "lucide-react";

const Navigation = () => {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="bg-card shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-3">
            <div className="bg-primary rounded-lg p-2">
              <Heart className="h-6 w-6 text-primary-foreground" />
            </div>
            <h1 className="text-2xl font-bold text-foreground">
              HEALTH CHECKUP
            </h1>
          </Link>
          
          <div className="flex items-center space-x-8">
            <Link
              to="/symptom-checker"
              className={`flex items-center space-x-2 nav-link-healthcare ${
                isActive("/symptom-checker") ? "text-primary" : ""
              }`}
            >
              <Activity className="h-5 w-5" />
              <span>Symptom Checker</span>
            </Link>
            
            <Link
              to="/find-doctor"
              className={`flex items-center space-x-2 nav-link-healthcare ${
                isActive("/find-doctor") ? "text-primary" : ""
              }`}
            >
              <Heart className="h-5 w-5" />
              <span>Find My Doctor</span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;