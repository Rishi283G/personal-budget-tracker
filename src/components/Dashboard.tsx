
import React from "react";
import { useBudget } from "@/contexts/BudgetContext";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { format } from "date-fns";
import { ArrowUp, ArrowDown, Calendar } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from "recharts";

const Dashboard: React.FC = () => {
  const { budget, remainingBudget, dailyAllowance, expenses, todaySpent, startDate, endDate } = useBudget();
  
  const percentSpent = Math.round(((budget - remainingBudget) / budget) * 100);
  const today = new Date();
  const remainingDays = Math.max(1, Math.ceil((endDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)));
  
  // Calculate if today is over/under budget
  const dailyStatus = todaySpent > dailyAllowance ? 
    { status: "over", icon: <ArrowUp className="text-budget-warning" />, color: "text-budget-warning" } :
    { status: "under", icon: <ArrowDown className="text-budget-success" />, color: "text-budget-success" };

  // Get category data for pie chart
  const categoryData = expenses.reduce((acc: Record<string, number>, expense) => {
    acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
    return acc;
  }, {});

  const pieChartData = Object.entries(categoryData).map(([name, value]) => ({ name, value }));
  
  const COLORS = ['#0BB4AA', '#1A73E8', '#4CAF50', '#FF5252', '#FFA000'];

  // Get daily spending data for bar chart (last 7 days)
  const last7Days = [...Array(7)].map((_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - i);
    return format(date, "yyyy-MM-dd");
  }).reverse();

  const barChartData = last7Days.map(date => {
    const daySpent = expenses
      .filter(expense => expense.date === date)
      .reduce((total, expense) => total + expense.amount, 0);
    
    return {
      date: format(new Date(date), "dd/MM"),
      amount: daySpent,
      allowance: dailyAllowance
    };
  });

  // Find best and worst spending days
  const dailySpending = expenses.reduce((acc: Record<string, number>, expense) => {
    acc[expense.date] = (acc[expense.date] || 0) + expense.amount;
    return acc;
  }, {});
  
  const dailySpendingEntries = Object.entries(dailySpending);
  
  const bestDay = dailySpendingEntries.length > 0 ?
    dailySpendingEntries.reduce((min, current) => 
      Number(current[1]) < Number(min[1]) ? current : min
    ) : null;
    
  const worstDay = dailySpendingEntries.length > 0 ?
    dailySpendingEntries.reduce((max, current) => 
      Number(current[1]) > Number(max[1]) ? current : max
    ) : null;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:flex md:flex-row gap-4">
        <Card className="budget-card flex-1">
          <h3 className="text-lg font-medium text-muted-foreground mb-2">Total Budget</h3>
          <div className="text-3xl font-bold">₹{budget.toLocaleString()}</div>
          <div className="text-sm text-muted-foreground mt-1">
            <Calendar className="inline w-4 h-4 mr-1" />
            {format(startDate, "dd MMM")} - {format(endDate, "dd MMM yyyy")}
          </div>
        </Card>
        
        <Card className="budget-card flex-1">
          <h3 className="text-lg font-medium text-muted-foreground mb-2">Remaining</h3>
          <div className="text-3xl font-bold">₹{remainingBudget.toLocaleString()}</div>
          <Progress className="mt-2" value={percentSpent} />
          <div className="text-sm text-muted-foreground mt-1">{remainingDays} days left</div>
        </Card>
        
        <Card className="budget-card flex-1">
          <h3 className="text-lg font-medium text-muted-foreground mb-2">Daily Allowance</h3>
          <div className="text-3xl font-bold">₹{Math.round(dailyAllowance).toLocaleString()}</div>
          <div className="text-xs text-muted-foreground mb-1">Based on remaining budget & days</div>
          <div className="flex items-center mt-1">
            <div className="text-sm">
              Today spent: <span className={dailyStatus.color}>
                ₹{todaySpent.toLocaleString()}
              </span>
            </div>
            {dailyStatus.icon}
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="budget-card">
          <h3 className="text-lg font-medium mb-4">Spending by Category</h3>
          <div className="h-[250px]">
            {pieChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieChartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {pieChartData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `₹${Number(value).toLocaleString()}`} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-muted-foreground">
                No expense data available
              </div>
            )}
          </div>
        </Card>
        
        <Card className="budget-card">
          <h3 className="text-lg font-medium mb-4">Last 7 Days Spending</h3>
          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barChartData}>
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip formatter={(value) => `₹${Number(value).toLocaleString()}`} />
                <Bar dataKey="amount" fill="#0BB4AA" name="Spent" />
                <Bar dataKey="allowance" fill="#1A73E8" name="Daily Allowance" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <Card className="budget-card">
        <h3 className="text-lg font-medium mb-4">Spending Insights</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {bestDay && (
            <div className="p-3 bg-muted/30 rounded-md">
              <h4 className="font-medium text-budget-success mb-1">Best Spending Day</h4>
              <p className="text-sm">{format(new Date(bestDay[0]), "dd MMM yyyy")}</p>
              <p className="text-lg font-semibold">₹{Number(bestDay[1]).toLocaleString()}</p>
            </div>
          )}
          
          {worstDay && (
            <div className="p-3 bg-muted/30 rounded-md">
              <h4 className="font-medium text-budget-warning mb-1">Highest Spending Day</h4>
              <p className="text-sm">{format(new Date(worstDay[0]), "dd MMM yyyy")}</p>
              <p className="text-lg font-semibold">₹{Number(worstDay[1]).toLocaleString()}</p>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default Dashboard;
