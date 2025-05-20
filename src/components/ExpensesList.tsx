
import React from "react";
import { useBudget, Expense } from "@/contexts/BudgetContext";
import { format } from "date-fns";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UtensilsCrossed, Coffee, Tag, Trash2, ShoppingBag, Briefcase, Home, Car, Gift, Film } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/components/ui/use-toast";

const getCategoryIcon = (category: string) => {
  switch (category.toLowerCase()) {
    case "food":
      return <UtensilsCrossed className="w-4 h-4" />;
    case "tea":
    case "coffee":
      return <Coffee className="w-4 h-4" />;
    case "shopping":
      return <ShoppingBag className="w-4 h-4" />;
    case "work":
      return <Briefcase className="w-4 h-4" />;
    case "home":
      return <Home className="w-4 h-4" />;
    case "transport":
    case "travel":
      return <Car className="w-4 h-4" />;
    case "gift":
      return <Gift className="w-4 h-4" />;
    case "entertainment":
      return <Film className="w-4 h-4" />;
    default:
      return <Tag className="w-4 h-4" />;
  }
};

const ExpensesList: React.FC = () => {
  const { expenses, deleteExpense } = useBudget();
  const [expenseToDelete, setExpenseToDelete] = React.useState<string | null>(null);
  const { toast } = useToast();

  // Group expenses by date, with the most recent first
  const groupedExpenses: Record<string, Expense[]> = {};
  
  [...expenses].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  ).forEach(expense => {
    if (!groupedExpenses[expense.date]) {
      groupedExpenses[expense.date] = [];
    }
    groupedExpenses[expense.date].push(expense);
  });

  const handleDeleteExpense = () => {
    if (expenseToDelete) {
      deleteExpense(expenseToDelete);
      toast({
        title: "Expense deleted",
        description: "The expense has been successfully deleted.",
      });
      setExpenseToDelete(null);
    }
  };

  return (
    <>
      <Card className="budget-card">
        <h3 className="text-lg font-medium mb-4">Recent Expenses</h3>
        
        {Object.keys(groupedExpenses).length === 0 ? (
          <div className="text-center py-6 text-muted-foreground">
            No expenses yet. Start adding your daily spending.
          </div>
        ) : (
          <div className="space-y-6">
            {Object.entries(groupedExpenses).map(([date, expensesForDate]) => (
              <div key={date} className="space-y-2">
                <h4 className="text-sm font-medium text-muted-foreground">
                  {format(new Date(date), "EEEE, MMMM d, yyyy")}
                </h4>
                
                <div className="space-y-2">
                  {expensesForDate.map((expense) => (
                    <div 
                      key={expense.id} 
                      className="flex items-center justify-between p-3 rounded-md bg-muted/20 hover:bg-muted/30 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-muted">
                          {getCategoryIcon(expense.category)}
                        </div>
                        <div className="flex-grow">
                          <p className="font-medium">{expense.description}</p>
                          <p className="text-xs text-muted-foreground">{expense.category}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-sm md:text-base">₹{expense.amount.toLocaleString()}</p>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => setExpenseToDelete(expense.id)}
                          className="text-destructive hover:text-destructive hover:bg-destructive/10 p-2"
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Delete expense</span>
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="flex justify-between text-sm pt-1">
                  <span>Daily Total:</span>
                  <span className="font-medium">₹
                    {expensesForDate
                      .reduce((sum, expense) => sum + expense.amount, 0)
                      .toLocaleString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      <AlertDialog open={!!expenseToDelete} onOpenChange={(isOpen) => !isOpen && setExpenseToDelete(null)}>
        <AlertDialogContent className="max-w-sm mx-auto">
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this expense? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteExpense} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default ExpensesList;
