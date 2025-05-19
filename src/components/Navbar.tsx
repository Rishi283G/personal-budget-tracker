
import React from "react";
import { Button } from "@/components/ui/button";
import { useLocation, Link } from "react-router-dom";
import { BarChart, Calendar, FileText } from "lucide-react";
import ThemeToggle from "./ThemeToggle";

const Navbar: React.FC = () => {
  const location = useLocation();
  
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-background border-t shadow-md z-10 md:relative md:border-b md:border-t-0 md:shadow-sm">
      <div className="container max-w-5xl">
        <div className="flex justify-around md:justify-between py-2 items-center">
          <div className="hidden md:block">
            <h1 className="text-xl font-bold text-budget-primary">Food Budget Tracker</h1>
          </div>
          
          <div className="flex items-center gap-1 md:gap-2">
            <Link to="/">
              <Button 
                variant={location.pathname === "/" ? "default" : "ghost"} 
                className={location.pathname === "/" ? "bg-budget-primary text-white hover:bg-budget-primary/90" : ""} 
                size="sm"
              >
                <BarChart className="w-4 h-4 mr-1 md:mr-2" />
                <span className="hidden md:inline">Dashboard</span>
                <span className="md:hidden">Home</span>
              </Button>
            </Link>
            
            <Link to="/expenses">
              <Button 
                variant={location.pathname === "/expenses" ? "default" : "ghost"} 
                className={location.pathname === "/expenses" ? "bg-budget-primary text-white hover:bg-budget-primary/90" : ""} 
                size="sm"
              >
                <Calendar className="w-4 h-4 mr-1 md:mr-2" />
                <span className="hidden md:inline">Expenses</span>
                <span className="md:hidden">Log</span>
              </Button>
            </Link>
            
            <Link to="/reports">
              <Button 
                variant={location.pathname === "/reports" ? "default" : "ghost"} 
                className={location.pathname === "/reports" ? "bg-budget-primary text-white hover:bg-budget-primary/90" : ""} 
                size="sm"
              >
                <FileText className="w-4 h-4 mr-1 md:mr-2" />
                <span className="hidden md:inline">Reports</span>
                <span className="md:hidden">Reports</span>
              </Button>
            </Link>

            <div className="hidden md:block ml-4">
              <ThemeToggle />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
