
import React, { useState } from "react";
import { useBudget, Expense } from "@/contexts/BudgetContext";
import { Card } from "@/components/ui/card";
import { format, startOfWeek, endOfWeek } from "date-fns";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Reports: React.FC = () => {
  const { expenses, budget, dailyAllowance } = useBudget();
  const [activeTab, setActiveTab] = useState<string>("weekly");

  // Calculate weekly data
  const currentDate = new Date();
  const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 }); // Start on Monday
  const weekEnd = endOfWeek(currentDate, { weekStartsOn: 1 });

  const weeklyExpenses = expenses.filter(expense => {
    const expenseDate = new Date(expense.date);
    return expenseDate >= weekStart && expenseDate <= weekEnd;
  });

  const weeklyTotal = weeklyExpenses.reduce((sum, expense) => sum + expense.amount, 0);
  const weeklyAllowance = dailyAllowance * 7;
  const weeklyStatus = weeklyTotal > weeklyAllowance ? "over" : "under";

  // Group by days of the week
  const dailyReport: Record<string, Expense[]> = {};
  
  // Initialize all days of the week
  for (let i = 0; i < 7; i++) {
    const date = new Date(weekStart);
    date.setDate(weekStart.getDate() + i);
    const formattedDate = format(date, "yyyy-MM-dd");
    dailyReport[formattedDate] = [];
  }

  // Fill in expenses
  weeklyExpenses.forEach(expense => {
    if (!dailyReport[expense.date]) {
      dailyReport[expense.date] = [];
    }
    dailyReport[expense.date].push(expense);
  });

  // Calculate monthly report
  const monthlyData = expenses.reduce((acc: Record<string, number>, expense) => {
    const [year, month] = expense.date.split("-");
    const key = `${year}-${month}`;
    
    if (!acc[key]) acc[key] = 0;
    acc[key] += expense.amount;
    
    return acc;
  }, {});

  return (
    <Card className="budget-card">
      <h3 className="text-lg font-medium mb-4">Expense Reports</h3>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="weekly">Weekly Summary</TabsTrigger>
          <TabsTrigger value="monthly">Monthly Summary</TabsTrigger>
        </TabsList>
        
        <TabsContent value="weekly" className="pt-4">
          <div className="space-y-4">
            <div className="bg-muted/20 p-4 rounded-md">
              <div className="flex items-center justify-between">
                <h4 className="font-medium">This Week</h4>
                <p className="text-sm text-muted-foreground">
                  {format(weekStart, "MMM d")} - {format(weekEnd, "MMM d, yyyy")}
                </p>
              </div>
              
              <div className="mt-2 grid grid-cols-2 gap-2">
                <div>
                  <p className="text-sm text-muted-foreground">Total Spent</p>
                  <p className="text-xl font-bold">₹{weeklyTotal.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Weekly Allowance</p>
                  <p className="text-xl font-bold">₹{Math.round(weeklyAllowance).toLocaleString()}</p>
                </div>
              </div>
              
              <div className="mt-2">
                <p className="text-sm font-medium">
                  Status: <span className={weeklyStatus === "over" ? "text-budget-warning" : "text-budget-success"}>
                    {weeklyStatus === "over" ? "Over budget" : "Under budget"}
                  </span>
                </p>
              </div>
            </div>
            
            <h4 className="font-medium">Daily Breakdown</h4>
            <div className="space-y-3">
              {Object.entries(dailyReport)
                .sort(([dateA], [dateB]) => new Date(dateB).getTime() - new Date(dateA).getTime())
                .map(([date, dayExpenses]) => {
                  const dayTotal = dayExpenses.reduce((sum, exp) => sum + exp.amount, 0);
                  const formattedDate = format(new Date(date), "EEEE, MMM d");
                  
                  return (
                    <div key={date} className="bg-muted/10 p-3 rounded-md">
                      <div className="flex justify-between items-center">
                        <p className="font-medium">{formattedDate}</p>
                        <p className={`font-medium ${dayTotal > dailyAllowance ? "text-budget-warning" : ""}`}>
                          ₹{dayTotal.toLocaleString()}
                        </p>
                      </div>
                      
                      {dayExpenses.length > 0 ? (
                        <div className="mt-2 space-y-1 text-sm">
                          {dayExpenses.map(expense => (
                            <div key={expense.id} className="flex justify-between">
                              <p>{expense.description}</p>
                              <p>₹{expense.amount.toLocaleString()}</p>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-muted-foreground mt-1">No expenses</p>
                      )}
                      
                      <div className="mt-2 text-xs text-muted-foreground">
                        {dayTotal > dailyAllowance ? (
                          <span className="text-budget-warning">
                            ₹{(dayTotal - dailyAllowance).toFixed(2)} over daily budget
                          </span>
                        ) : dayTotal > 0 ? (
                          <span className="text-budget-success">
                            ₹{(dailyAllowance - dayTotal).toFixed(2)} under daily budget
                          </span>
                        ) : (
                          <span>Daily allowance: ₹{dailyAllowance.toFixed(2)}</span>
                        )}
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="monthly" className="pt-4">
          <div className="space-y-4">
            {Object.entries(monthlyData)
              .sort(([keyA], [keyB]) => keyB.localeCompare(keyA))
              .map(([key, total]) => {
                const [year, month] = key.split("-");
                const date = new Date(parseInt(year), parseInt(month) - 1, 1);
                
                return (
                  <div key={key} className="bg-muted/20 p-4 rounded-md">
                    <h4 className="font-medium">{format(date, "MMMM yyyy")}</h4>
                    <div className="mt-2 grid grid-cols-2 gap-2">
                      <div>
                        <p className="text-sm text-muted-foreground">Total Spent</p>
                        <p className="text-xl font-bold">₹{total.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Monthly Budget</p>
                        <p className="text-xl font-bold">₹{budget.toLocaleString()}</p>
                      </div>
                    </div>
                    
                    <div className="mt-2">
                      <p className="text-sm">
                        Status: <span className={total > budget ? "text-budget-warning font-medium" : "text-budget-success font-medium"}>
                          {total > budget ? `₹${(total - budget).toLocaleString()} over budget` : `₹${(budget - total).toLocaleString()} under budget`}
                        </span>
                      </p>
                    </div>
                  </div>
                );
              })}
              
            {Object.keys(monthlyData).length === 0 && (
              <div className="text-center py-6 text-muted-foreground">
                No monthly data available yet.
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </Card>
  );
};

export default Reports;
