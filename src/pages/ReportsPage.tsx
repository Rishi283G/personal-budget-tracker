
import React from "react";
import Reports from "@/components/Reports";

const ReportsPage: React.FC = () => {
  return (
    <div className="container max-w-5xl py-4 md:py-8 space-y-6">
      <h1 className="text-2xl font-bold mb-6">Budget Reports</h1>
      
      <Reports />
    </div>
  );
};

export default ReportsPage;
