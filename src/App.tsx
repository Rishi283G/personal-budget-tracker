
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { BudgetProvider } from "@/contexts/BudgetContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { FriendExpenseProvider } from "@/contexts/FriendExpenseContext";
import { Heart, ArrowUpToLine, Calendar as CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { format } from "date-fns";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import ExpensesPage from "./pages/ExpensesPage";
import ReportsPage from "./pages/ReportsPage";
import FriendsPage from "./pages/FriendsPage";
import Navbar from "./components/Navbar";
import ThemeToggle from "./components/ThemeToggle";

const queryClient = new QueryClient();

const BackToTopButton = () => {
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowButton(window.scrollY > 300);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  if (!showButton) return null;

  return (
    <Button 
      variant="outline" 
      size="icon" 
      className="fixed bottom-24 right-4 md:bottom-8 md:right-8 bg-background shadow-md z-50 rounded-full opacity-80 hover:opacity-100"
      onClick={scrollToTop}
    >
      <ArrowUpToLine className="h-4 w-4" />
      <span className="sr-only">Back to top</span>
    </Button>
  );
};

const App = () => {
  const today = new Date();
  
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <BudgetProvider>
          <FriendExpenseProvider>
            <TooltipProvider>
              <Toaster />
              <Sonner />
              <BrowserRouter>
                <div className="min-h-screen flex flex-col pb-16 md:pb-0">
                  <Navbar />
                  <div className="flex justify-end px-4 py-2 text-sm text-muted-foreground items-center">
                    <CalendarIcon className="h-4 w-4 mr-1" />
                    {format(today, "EEEE, dd MMMM yyyy")}
                  </div>
                  <main className="flex-1">
                    <Routes>
                      <Route path="/" element={<Index />} />
                      <Route path="/expenses" element={<ExpensesPage />} />
                      <Route path="/reports" element={<ReportsPage />} />
                      <Route path="/friends" element={<FriendsPage />} />
                      <Route path="*" element={<NotFound />} />
                    </Routes>
                  </main>
                  <footer className="text-center py-4 text-sm text-muted-foreground">
                    Made with <Heart className="inline h-4 w-4 text-red-500 mx-1 fill-red-500" /> by Rushikesh
                    <div className="mt-2">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-xs" 
                        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                      >
                        <ArrowUpToLine className="h-3 w-3 mr-1" /> Back to Top
                      </Button>
                    </div>
                  </footer>
                  <BackToTopButton />
                  <div className="fixed bottom-20 right-4 md:hidden">
                    <div className="bg-background border border-border rounded-full p-2 shadow-md">
                      <ThemeToggle />
                    </div>
                  </div>
                </div>
              </BrowserRouter>
            </TooltipProvider>
          </FriendExpenseProvider>
        </BudgetProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
