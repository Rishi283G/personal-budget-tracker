import React from "react";
import { useBudget } from "@/contexts/BudgetContext";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { format } from "date-fns";
import { ArrowUp, ArrowDown, Calendar, TrendingUp, TrendingDown, AlertTriangle, CheckCircle } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from "recharts";

const Dashboard: React.FC = () => {
  const { 
    budget, 
    remainingBudget, 
    dailyAllowance, 
    expenses, 
    todaySpent, 
    startDate, 
    endDate,
    averageDailySpending,
    projectedMonthlySpending,
    budgetHealthStatus,
    daysUntilBudgetExhausted,
    spendingTrend
  } = useBudget();
  
  const percentSpent = Math.round(((budget - remainingBudget) / budget) * 100);
  const today = new Date();
  const remainingDays = Math.max(1, Math.ceil((endDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)));
  
  // Calculate if today is over/under budget
  const dailyStatus = todaySpent > dailyAllowance ? 
    { status: "over", icon: <ArrowUp className="text-budget-warning" />, color: "text-budget-warning" } :
    { status: "under", icon: <ArrowDown className="text-budget-success" />, color: "text-budget-success" };

  // Get health status color and icon
  const getHealthStatusDisplay = () => {
    switch (budgetHealthStatus) {
      case "excellent":
        return { color: "text-budget-success", icon: <CheckCircle className="w-4 h-4" />, text: "Excellent" };
      case "good":
        return { color: "text-blue-500", icon: <CheckCircle className="w-4 h-4" />, text: "Good" };
      case "warning":
        return { color: "text-yellow-500", icon: <AlertTriangle className="w-4 h-4" />, text: "Warning" };
      case "critical":
        return { color: "text-budget-warning", icon: <AlertTriangle className="w-4 h-4" />, text: "Critical" };
    }
  };

  const healthDisplay = getHealthStatusDisplay();

  // Get spending trend display
  const getTrendDisplay = () => {
    switch (spendingTrend) {
      case "increasing":
        return { color: "text-budget-warning", icon: <TrendingUp className="w-4 h-4" />, text: "Increasing" };
      case "decreasing":
        return { color: "text-budget-success", icon: <TrendingDown className="w-4 h-4" />, text: "Decreasing" };
      case "stable":
        return { color: "text-muted-foreground", icon: <TrendingUp className="w-4 h-4" />, text: "Stable" };
    }
  };

  const trendDisplay = getTrendDisplay();

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
      {/* Budget Health Alert */}
      {(budgetHealthStatus === "warning" || budgetHealthStatus === "critical") && (
        <Card className="budget-card border-yellow-200 bg-yellow-50">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-yellow-600" />
            <div>
              <h4 className="font-medium text-yellow-800">Budget Alert</h4>
              <p className="text-sm text-yellow-700">
                {budgetHealthStatus === "critical" 
                  ? "You're spending faster than planned. Consider reducing expenses."
                  : "Your spending is slightly above the ideal pace. Monitor your expenses."}
              </p>
            </div>
          </div>
        </Card>
      )}

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

      {/* Dynamic Insights Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="budget-card">
          <h3 className="text-lg font-medium text-muted-foreground mb-2">Budget Health</h3>
          <div className="flex items-center gap-2">
            {healthDisplay.icon}
            <span className={`text-xl font-bold ${healthDisplay.color}`}>
              {healthDisplay.text}
            </span>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Based on spending pace vs time passed
          </p>
        </Card>

        <Card className="budget-card">
          <h3 className="text-lg font-medium text-muted-foreground mb-2">Spending Trend</h3>
          <div className="flex items-center gap-2">
            {trendDisplay.icon}
            <span className={`text-xl font-bold ${trendDisplay.color}`}>
              {trendDisplay.text}
            </span>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Last 7 days vs previous 7 days
          </p>
        </Card>

        <Card className="budget-card">
          <h3 className="text-lg font-medium text-muted-foreground mb-2">Budget Runway</h3>
          <div className="text-2xl font-bold">
            {daysUntilBudgetExhausted > remainingDays ? `${remainingDays}` : `${daysUntilBudgetExhausted}`} days
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            {daysUntilBudgetExhausted > remainingDays 
              ? "Budget will last until end date"
              : "At current spending rate"}
          </p>
        </Card>
      </div>

      {/* Projections Card */}
      <Card className="budget-card">
        <h3 className="text-lg font-medium mb-4">Spending Analysis</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <h4 className="font-medium text-muted-foreground mb-2">Average Daily Spending</h4>
              <p className="text-2xl font-bold">₹{Math.round(averageDailySpending).toLocaleString()}</p>
              <p className="text-sm text-muted-foreground">
                {averageDailySpending > dailyAllowance 
                  ? `₹${Math.round(averageDailySpending - dailyAllowance)} above target`
                  : `₹${Math.round(dailyAllowance - averageDailySpending)} below target`}
              </p>
            </div>
            
            <div>
              <h4 className="font-medium text-muted-foreground mb-2">Projected Monthly Total</h4>
              <p className="text-2xl font-bold">₹{Math.round(projectedMonthlySpending).toLocaleString()}</p>
              <p className="text-sm text-muted-foreground">
                {projectedMonthlySpending > budget 
                  ? `₹${Math.round(projectedMonthlySpending - budget)} over budget`
                  : `₹${Math.round(budget - projectedMonthlySpending)} under budget`}
              </p>
            </div>
          </div>
          
          <div className="space-y-2">
            <h4 className="font-medium text-muted-foreground mb-2">Quick Tips</h4>
            {budgetHealthStatus === "critical" && (
              <p className="text-sm p-2 bg-red-50 text-red-700 rounded">
                🚨 Consider reducing daily spending by ₹{Math.round(averageDailySpending - dailyAllowance)} to stay on track
              </p>
            )}
            {budgetHealthStatus === "warning" && (
              <p className="text-sm p-2 bg-yellow-50 text-yellow-700 rounded">
                ⚠️ Monitor your spending closely to avoid going over budget
              </p>
            )}
            {budgetHealthStatus === "excellent" && (
              <p className="text-sm p-2 bg-green-50 text-green-700 rounded">
                ✅ Great job! You're spending within your planned budget
              </p>
            )}
            {spendingTrend === "increasing" && (
              <p className="text-sm p-2 bg-blue-50 text-blue-700 rounded">
                📈 Your spending has increased recently. Review your recent expenses
              </p>
            )}
          </div>
        </div>
      </Card>

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
