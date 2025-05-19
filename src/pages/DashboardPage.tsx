
import React from "react";
import Dashboard from "@/components/Dashboard";
import BudgetSetup from "@/components/BudgetSetup";
import ExpenseForm from "@/components/ExpenseForm";

const DashboardPage: React.FC = () => {
  return (
    <div className="container max-w-5xl py-4 md:py-8 space-y-6">
      <h1 className="text-2xl font-bold mb-6">Personal Budget Dashboard</h1>
      
      <Dashboard />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <BudgetSetup />
        <ExpenseForm />
      </div>
    </div>
  );
};

export default DashboardPage;
