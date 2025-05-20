
import React from "react";
import ExpenseForm from "@/components/ExpenseForm";
import ExpensesList from "@/components/ExpensesList";

const ExpensesPage: React.FC = () => {
  return (
    <div className="container max-w-5xl pt-2 pb-6 md:py-8 space-y-6 px-4 md:px-6">
      <h1 className="text-2xl font-bold mb-6">Expense Tracker</h1>
      
      <div className="space-y-6">
        <ExpenseForm />
        <ExpensesList />
      </div>
    </div>
  );
};

export default ExpensesPage;
