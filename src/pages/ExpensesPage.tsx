
import React from "react";
import ExpenseForm from "@/components/ExpenseForm";
import ExpensesList from "@/components/ExpensesList";

const ExpensesPage: React.FC = () => {
  return (
    <div className="container max-w-5xl py-4 md:py-8 space-y-6">
      <h1 className="text-2xl font-bold mb-6">Expense Tracker</h1>
      
      <ExpenseForm />
      <ExpensesList />
    </div>
  );
};

export default ExpensesPage;
