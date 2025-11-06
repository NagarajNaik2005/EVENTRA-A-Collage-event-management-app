import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";

const Header = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("studentId");
    localStorage.removeItem("studentData");
    navigate("/");
  };

  return (
    <header className="border-b border-primary/20 bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/80 sticky top-0 z-50">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/home" className="flex items-center space-x-2">
          <Calendar className="h-6 w-6 text-primary" />
          <span className="text-xl font-bold">Eventra</span>
        </Link>
        <nav className="flex items-center space-x-6">
          <Link to="/home" className="text-sm font-medium transition-colors hover:text-primary">
            Home
          </Link>
          <Link to="/dashboard" className="text-sm font-medium transition-colors hover:text-primary">
            My Dashboard
          </Link>
          <button 
            onClick={() => document.getElementById('footer')?.scrollIntoView({ behavior: 'smooth' })}
            className="text-sm font-medium transition-colors hover:text-primary"
          >
            Contact
          </button>
          <Button variant="outline" size="sm" onClick={handleLogout}>
            Logout
          </Button>
        </nav>
      </div>
    </header>
  );
};

export default Header;
