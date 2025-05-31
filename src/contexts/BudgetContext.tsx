
import React, { createContext, useContext, useState, useEffect } from "react";
import { format } from "date-fns";

export interface Expense {
  id: string;
  amount: number;
  date: string;
  description: string;
  category: string;
}

interface BudgetContextType {
  budget: number;
  setBudget: (budget: number) => void;
  startDate: Date;
  setStartDate: (date: Date) => void;
  endDate: Date;
  setEndDate: (date: Date) => void;
  expenses: Expense[];
  addExpense: (expense: Omit<Expense, "id">) => void;
  deleteExpense: (id: string) => void;
  remainingBudget: number;
  dailyAllowance: number;
  todaySpent: number;
  resetBudget: () => void;
}

const defaultStartDate = new Date();
const defaultEndDate = new Date(new Date().setMonth(defaultStartDate.getMonth() + 1));

const BudgetContext = createContext<BudgetContextType | undefined>(undefined);

export const BudgetProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [budget, setBudget] = useState<number>(() => {
    const saved = localStorage.getItem("budget");
    return saved ? Number(saved) : 3200;
  });
  
  const [startDate, setStartDate] = useState<Date>(() => {
    const saved = localStorage.getItem("startDate");
    return saved ? new Date(saved) : defaultStartDate;
  });
  
  const [endDate, setEndDate] = useState<Date>(() => {
    const saved = localStorage.getItem("endDate");
    return saved ? new Date(saved) : defaultEndDate;
  });
  
  const [expenses, setExpenses] = useState<Expense[]>(() => {
    const saved = localStorage.getItem("expenses");
    return saved ? JSON.parse(saved) : [];
  });

  // Calculate remaining budget
  const remainingBudget = budget - expenses.reduce((total, expense) => total + expense.amount, 0);
  
  // Calculate remaining days from today to end date
  const today = new Date();
  const remainingDays = Math.max(1, Math.ceil((endDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)));
  
  // Calculate dynamic daily allowance based on remaining budget and remaining days
  const dailyAllowance = remainingBudget / remainingDays;
  
  // Calculate today's spent amount
  const todayFormatted = format(today, "yyyy-MM-dd");
  const todaySpent = expenses
    .filter(expense => expense.date === todayFormatted)
    .reduce((total, expense) => total + expense.amount, 0);

  // Save to localStorage whenever state changes
  useEffect(() => {
    localStorage.setItem("budget", budget.toString());
    localStorage.setItem("startDate", startDate.toISOString());
    localStorage.setItem("endDate", endDate.toISOString());
    localStorage.setItem("expenses", JSON.stringify(expenses));
  }, [budget, startDate, endDate, expenses]);

  // Add expense function
  const addExpense = (expense: Omit<Expense, "id">) => {
    const newExpense = {
      ...expense,
      id: crypto.randomUUID()
    };
    setExpenses(prev => [...prev, newExpense]);
  };

  // Delete expense function
  const deleteExpense = (id: string) => {
    setExpenses(prev => prev.filter(expense => expense.id !== id));
  };

  // Reset budget function
  const resetBudget = () => {
    if (confirm("Are you sure you want to reset your budget data? This will delete all expenses.")) {
      setExpenses([]);
      setStartDate(new Date());
      setEndDate(new Date(new Date().setMonth(new Date().getMonth() + 1)));
    }
  };

  return (
    <BudgetContext.Provider
      value={{
        budget,
        setBudget,
        startDate,
        setStartDate,
        endDate,
        setEndDate,
        expenses,
        addExpense,
        deleteExpense,
        remainingBudget,
        dailyAllowance,
        todaySpent,
        resetBudget
      }}
    >
      {children}
    </BudgetContext.Provider>
  );
};

export const useBudget = (): BudgetContextType => {
  const context = useContext(BudgetContext);
  if (!context) {
    throw new Error("useBudget must be used within a BudgetProvider");
  }
  return context;
};
